import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref as dbRef, onValue, push, set, update, remove } from 'firebase/database';
import { SIGNUP_ROLES, isRestrictedRole } from '../config/roles';
import UserAvatar from '../components/UserAvatar';
import { AVATAR_EMOJIS, AVATAR_GRADIENTS, notifyAvatarChange } from '../hooks/useAvatar';

const S = {
  P: 'var(--md-primary)', Prgb: 'var(--md-primary-rgb)',
  S: 'var(--md-surface)', SV: 'var(--md-surface-variant)',
  S2: 'var(--md-surface-2)', OnS: 'var(--md-on-surface)',
  OnSV: 'var(--md-on-surface-var)', OnSD: 'var(--md-on-surface-dim)',
  Out: 'var(--md-outline)',
};
const NOTE_COLORS = ['#FFE0B2','#FFCDD2','#C8E6C9','#B3E5FC','#E1BEE7','#FFF9C4','#B2EBF2','#D7CCC8'];

function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  return doc.body.textContent || '';
}

function noteTextColor(bg) {
  if (!bg) return '#1a1a1a';
  const hex = bg.replace('#', '');
  const r = parseInt(hex.substring(0,2), 16), g = parseInt(hex.substring(2,4), 16), b = parseInt(hex.substring(4,6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? '#1a1a1a' : '#f1f3f4';
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  return d.toLocaleDateString('en-IN', { weekday:'short', day:'2-digit', month:'short' });
}

export default function UserDashboard({ user, userProfile, onUpdateProfile, onLogout, streak=0, xp=0, completedModules=[] }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [leaderboard, setLeaderboard] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editRole, setEditRole] = useState('');
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [avatarChoice, setAvatarChoice] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eatclub_avatar')) || {}; } catch { return {}; }
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatText, setChatText] = useState('');
  const chatListRef = useRef(null);

  // User data extraction
  const userEmail = user?.email || localStorage.getItem('eatclub_agent_email') || '';
  const userName = user?.displayName || userProfile?.name || localStorage.getItem('eatclub_agent_name') || 'User';
  const userBio = userProfile?.bio || '';
  const userRole = userProfile?.role || '';
  const uid = user?.uid || localStorage.getItem('eatclub_uid') || '';

  // Notes state
  const [savedNotes, setSavedNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteColor, setNoteColor] = useState(NOTE_COLORS[0]);
  const [noteSaved, setNoteSaved] = useState(true);
  const [noteSearch, setNoteSearch] = useState('');
  const noteTimer = useRef(null);
  const noteEditorRef = useRef(null);

  // 1-on-1 chat listener
  useEffect(() => {
    if (!selectedUser || !uid) return;
    const chatId = [uid, selectedUser.id].sort().join('_');
    const chatRef = dbRef(db, `conversations/${chatId}/messages`);
    const unsub = onValue(chatRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        setChatMessages(list);
        setTimeout(() => { if (chatListRef.current) chatListRef.current.scrollTop = chatListRef.current.scrollHeight; }, 50);
      } else {
        setChatMessages([]);
      }
    });
    return () => unsub();
  }, [selectedUser, uid]);

  useEffect(() => {
    if (noteEditorRef.current && activeNoteId) {
      noteEditorRef.current.innerHTML = noteContent;
    }
  }, [activeNoteId]);

  // Last session
  const [lastSession, setLastSession] = useState(null);


  useEffect(() => {
    if (!uid) return;

    const notesRef = dbRef(db, `notes/${uid}`);
    const unsubNotes = onValue(notesRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        setSavedNotes(list);
      }
    });

    const leaderboardRef = dbRef(db, 'leaderboard');
    const unsubLeader = onValue(leaderboardRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val })).filter(u => u.name);
        list.sort((a, b) => (b.points || 0) - (a.points || 0));
        setLeaderboard(list);
      }
    });

    // Load last session
    const lastSesh = localStorage.getItem('eatclub_last_session');
    if (lastSesh) {
      try { setLastSession(JSON.parse(lastSesh)); } catch {}
    }

    return () => { unsubNotes(); unsubLeader(); };
  }, [uid]);

  // Save note with debounce
  const saveNote = (id, data) => {
    if (!uid || !id) return;
    set(dbRef(db, `notes/${uid}/${id}`), { ...data, updatedAt: Date.now() });
    setNoteSaved(true);
  };

  const handleNoteChange = (field, val) => {
    if (!activeNoteId) return;
    setNoteSaved(false);
    if (field === 'title') setNoteTitle(val);
    else if (field === 'content') setNoteContent(val);
    else if (field === 'color') { setNoteColor(val); saveNote(activeNoteId, { title: noteTitle, content: noteContent, color: val }); return; }
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => {
      saveNote(activeNoteId, { title: field === 'title' ? val : noteTitle, content: field === 'content' ? val : noteContent, color: noteColor });
    }, 800);
  };

  const selectNote = (note) => {
    setActiveNoteId(note.id);
    setNoteTitle(note.title || '');
    setNoteContent(note.content || '');
    setNoteColor(note.color || NOTE_COLORS[0]);
    setNoteSaved(true);
  };

  const createNewNote = () => {
    if (!uid) return;
    const newRef = push(dbRef(db, `notes/${uid}`));
    const noteId = newRef.key;
    const defaultColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
    const data = { title: '', content: '', color: defaultColor, createdAt: Date.now(), updatedAt: Date.now() };
    set(newRef, data);
    selectNote({ id: noteId, ...data });
  };

  const deleteNote = (noteId) => {
    if (!uid) return;
    remove(dbRef(db, `notes/${uid}/${noteId}`));
    if (activeNoteId === noteId) setActiveNoteId(null);
  };

  const [profileError, setProfileError] = useState('');

  const handleSaveProfile = () => {
    if (!uid) return;
    if (isRestrictedRole(editRole)) {
      setProfileError('Admin and Super Admin roles cannot be self-assigned. Contact your administrator.');
      return;
    }
    setProfileError('');
    update(dbRef(db, `users/${uid}`), { bio: editBio, role: editRole });
    localStorage.setItem('eatclub_bio', editBio);
    localStorage.setItem('eatclub_role', editRole);
    onUpdateProfile({ bio: editBio, role: editRole });
    setEditingProfile(false);
  };

  const tabs = [
    { id: 'overview', icon: 'space_dashboard', label: 'Overview' },
    { id: 'profile', icon: 'person', label: 'Profile' },
    { id: 'notes', icon: 'sticky_note_2', label: 'Notepad' },
    { id: 'leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
  ];

  const leaderData = leaderboard.find(u => u.id === uid);
  const rank = leaderboard.findIndex(u => u.id === uid) + 1;

  const statCards = [
    { icon: 'local_fire_department', label: 'Day Streak', val: streak, color: '#FF5722' },
    { icon: 'emoji_events', label: 'Total XP', val: xp, color: '#FFD700' },
    { icon: 'check_circle', label: 'Completed', val: completedModules.length, color: '#4CAF50' },
    { icon: 'group', label: 'Leader Rank', val: rank > 0 ? `#${rank}` : '-', color: '#2196F3' },
  ];

  return (
    <div className="page-content">
      <style>{`
        .dash-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:24px }
        .dash-stat { background:${S.SV};border-radius:16px;padding:18px 16px;border:1px solid ${S.Out};transition:all .3s cubic-bezier(.34,1.56,.64,1) }
        .dash-stat:hover { transform:translateY(-3px);border-color:${S.P};box-shadow:0 10px 24px rgba(${S.Prgb},.1) }
        .dash-tabs { display:flex;gap:8px;margin-bottom:24px;overflow-x:auto;padding-bottom:4px }
        .dash-tab { padding:10px 18px;border-radius:100px;border:1px solid ${S.Out};background:${S.SV};color:${S.OnS};font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;white-space:nowrap;display:flex;align-items:center;gap:8px }
        .dash-tab:hover { border-color:${S.P};background:rgba(${S.Prgb},.08) }
        .dash-tab.active { background:${S.P};color:#fff;border-color:${S.P} }
        .dash-card { background:${S.SV};border-radius:16px;padding:20px;border:1px solid ${S.Out};margin-bottom:16px }
        .dash-card-title { font-size:15px;font-weight:800;color:${S.OnS};margin-bottom:14px;display:flex;align-items:center;gap:10px }
        
        /* Notes Grid — responsive CSS grid (left-to-right) */
        .notes-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;width:100% }
        .notes-note-wrapper { transition: transform .2s ease, box-shadow .2s ease }
        .notes-note-wrapper:hover { transform: translateY(-3px) }
        
        .note-card { border-radius:14px;padding:18px;cursor:pointer;transition:all .25s cubic-bezier(.34,1.56,.64,1);position:relative;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.12);box-shadow:0 2px 8px rgba(0,0,0,0.18) }
        .note-card:hover { box-shadow:0 8px 24px rgba(0,0,0,.28); border-color: rgba(255,255,255,0.25) }
        .note-card.active { border-color:${S.P}; box-shadow:0 0 0 2px ${S.P} }
        .note-card-title { font-size:15px;font-weight:700;margin-bottom:10px;word-wrap:break-word;line-height:1.3 }
        .note-card-preview { font-size:13px;line-height:1.6;flex:1;word-wrap:break-word;opacity:.85;overflow:hidden;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical }
        .note-card-date { font-size:10px;opacity:.5;margin-top:14px;text-align:right;font-weight:600;letter-spacing:.2px }
        
        .notes-search { display:flex;align-items:center;gap:10px;margin-bottom:20px;padding:10px 16px;border-radius:12px;background:${S.SV};border:1px solid ${S.Out};transition:all .2s;max-width:400px }
        .notes-search:focus-within { border-color:${S.P};box-shadow:0 0 0 3px rgba(${S.Prgb},.1) }
        .notes-search input { flex:1;border:none;background:none;color:${S.OnS};font-size:13px;font-weight:600;outline:none }
        .notes-search input::placeholder { color:${S.OnSV};font-weight:500 }
        .notes-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px }
        .notes-count { font-size:11px;color:${S.OnSV};font-weight:600;padding:4px 12px;border-radius:100px;background:${S.S};border:1px solid ${S.Out} }
        
        .keep-input-container { max-width: 600px; margin: 0 auto 28px; background: ${S.SV}; border-radius: 12px; border: 1px solid ${S.Out}; box-shadow: 0 1px 3px rgba(0,0,0,0.25); transition: all .2s }
        .keep-input-container:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.35); border-color:rgba(${S.Prgb},.2) }
        .keep-input-placeholder { padding: 14px 18px; color: ${S.OnSV}; font-weight: 700; cursor: pointer; font-size: 14px; display:flex;align-items:center;gap:10px }
        
        .note-editor-title { width:100%;padding:10px 14px;border-radius:10px;border:1px solid ${S.Out};background:${S.S};color:${S.OnS};font-size:16px;font-weight:700;margin-bottom:12px;transition:border-color .2s }
        .note-editor-title:focus { outline:none;border-color:${S.P} }
        .note-editor-body { width:100%;min-height:200px;border-radius:8px;padding:14px;background:transparent;border:none;color:inherit;font-size:14px;line-height:1.7;outline:none }
        .note-editor-body:focus { }
        .note-toolbar { display:flex;align-items:center;gap:4px;padding:8px 10px;background:rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.08);border-radius:10px 10px 0 0; border-bottom: none;flex-wrap:wrap }
        .note-tb-btn { width:32px;height:30px;border:none;border-radius:8px;background:none;color:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;font-size:13px;opacity:.7 }
        .note-tb-btn:hover { background:rgba(0,0,0,.08);opacity:1 }
        .note-tb-sep { width:1px;height:18px;background:rgba(0,0,0,.1);margin:0 4px;flex-shrink:0 }
        .profile-field { width:100%;padding:12px 14px;border-radius:12px;background:${S.S};border:1px solid ${S.Out};color:${S.OnS};font-size:13px;margin-bottom:12px }
        .profile-field:focus { outline:none;border-color:${S.P} }
        .lb-item { display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:14px;background:${S.S};border:1px solid ${S.Out};margin-bottom:8px;transition:all .2s }
        .lb-item:hover { border-color:rgba(${S.Prgb},.2);transform:translateX(4px) }
        .lb-rank { width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0 }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:12 }}>
        <div>
          <div style={{ fontSize:22,fontWeight:900,color:S.OnS,letterSpacing:-.3 }}>Dashboard</div>
          <div style={{ fontSize:12,color:S.OnSV,marginTop:2 }}>Your progress, notes & team leaderboard</div>
        </div>
        <div style={{ display:'flex',gap:8,alignItems:'center' }}>
          <span style={{ fontSize:10,color:S.OnSV,fontWeight:600 }}>{userEmail}</span>
          {streak > 0 && <span style={{ padding:'2px 10px',borderRadius:100,background:'rgba(255,87,34,.12)',color:'#FF5722',fontSize:10,fontWeight:800 }}>🔥 {streak} day streak</span>}
          <button onClick={onLogout} style={{ padding:'6px 14px',borderRadius:100,border:'1px solid var(--md-outline)',background:S.SV,color:S.OnS,fontSize:11,fontWeight:700,cursor:'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontSize:14,verticalAlign:'middle',marginRight:4 }}>logout</span>
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`dash-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            <span className="material-symbols-outlined" style={{ fontSize:16 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {activeTab === 'overview' && (
        <>
          <div className="dash-grid">
            {statCards.map(s => (
              <div key={s.label} className="dash-stat" style={{ textAlign:'center' }}>
                <div style={{ width:44,height:44,borderRadius:12,background:s.color+'18',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:22,color:s.color }}>{s.icon}</span>
                </div>
                <div style={{ fontSize:28,fontWeight:900,background:`linear-gradient(135deg,${s.color},${s.color}88)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',lineHeight:1 }}>{s.val}</div>
                <div style={{ fontSize:11,color:S.OnSV,marginTop:4,fontWeight:700,letterSpacing:.5,textTransform:'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Last Session */}
          <div className="dash-card">
            <div className="dash-card-title">
              <span className="material-symbols-outlined" style={{ color:S.P,fontSize:18 }}>history</span>
              Last Session
            </div>
            {lastSession ? (
              <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                <div style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:12,background:S.S,border:`1px solid ${S.Out}` }}>
                  <span className="material-symbols-outlined" style={{ color:S.P,fontSize:20 }}>login</span>
                  <div>
                    <div style={{ fontSize:12,fontWeight:700,color:S.OnS }}>Last Login</div>
                    <div style={{ fontSize:11,color:S.OnSV }}>{new Date(lastSession.time).toLocaleString('en-IN')}</div>
                  </div>
                </div>
                {lastSession.modules && lastSession.modules.length > 0 && (
                  <div style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:12,background:S.S,border:`1px solid ${S.Out}` }}>
                    <span className="material-symbols-outlined" style={{ color:'#4CAF50',fontSize:20 }}>check_circle</span>
                    <div>
                      <div style={{ fontSize:12,fontWeight:700,color:S.OnS }}>Modules Completed</div>
                      <div style={{ fontSize:11,color:S.OnSV }}>{lastSession.modules.length} module{lastSession.modules.length>1?'s':''} — {lastSession.modules.join(', ')}</div>
                    </div>
                  </div>
                )}
                {lastSession.xpGained > 0 && (
                  <div style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:12,background:S.S,border:`1px solid ${S.Out}` }}>
                    <span className="material-symbols-outlined" style={{ color:'#FFD700',fontSize:20 }}>emoji_events</span>
                    <div>
                      <div style={{ fontSize:12,fontWeight:700,color:S.OnS }}>XP Gained</div>
                      <div style={{ fontSize:11,color:S.OnSV }}>+{lastSession.xpGained} XP</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign:'center',padding:'20px',color:S.OnSV,fontSize:12 }}>
                No previous session data. Complete a module to start tracking!
              </div>
            )}
          </div>

          {/* Completed Modules */}
          <div className="dash-card">
            <div className="dash-card-title">
              <span className="material-symbols-outlined" style={{ color:S.P,fontSize:18 }}>checklist</span>
              Completed Modules
              <span style={{ fontSize:10,color:S.OnSV,marginLeft:'auto',fontWeight:600 }}>{completedModules.length} done</span>
            </div>
            {completedModules.length === 0 ? (
              <div style={{ textAlign:'center',padding:'20px',color:S.OnSV,fontSize:12 }}>
                No modules completed yet. Visit a training module and click "Complete & Earn XP"!
              </div>
            ) : (
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:8 }}>
                {completedModules.map((m, idx) => (
                  <div key={idx} style={{ padding:'10px 14px',borderRadius:10,background:S.S,border:`1px solid ${S.Out}`,display:'flex',alignItems:'center',gap:8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:16,color:'#4CAF50' }}>check_circle</span>
                    <span style={{ fontSize:11,fontWeight:700,color:S.OnS }}>{m.name || m}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══ PROFILE ═══ */}
      {activeTab === 'profile' && (
        <div className="dash-card">
          <div className="dash-card-title">
            <span className="material-symbols-outlined" style={{ color:S.P,fontSize:18 }}>person</span>
            My Profile
          </div>
          {!editingProfile ? (
            <>
              <div style={{ display:'flex',alignItems:'center',gap:16,marginBottom:20 }}>
                <UserAvatar size="xl" name={userName} photoURL={user?.photoURL} />
                <div>
                  <div style={{ fontSize:18,fontWeight:900,color:S.OnS }}>{userName}</div>
                  <div style={{ fontSize:12,color:S.OnSV,fontWeight:600 }}>{userEmail}</div>
                  {userRole && <div style={{ fontSize:12,color:S.P,fontWeight:700,marginTop:2 }}>{userRole}</div>}
                </div>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16 }}>
                <div style={{ padding:'14px',background:S.S,borderRadius:12,border:`1px solid ${S.Out}` }}>
                  <div style={{ fontSize:10,color:S.OnSV,fontWeight:700,textTransform:'uppercase',letterSpacing:.8 }}>Bio</div>
                  <div style={{ fontSize:13,color:S.OnS,fontWeight:600,marginTop:4 }}>{userBio || 'No bio set yet'}</div>
                </div>
                <div style={{ padding:'14px',background:S.S,borderRadius:12,border:`1px solid ${S.Out}` }}>
                  <div style={{ fontSize:10,color:S.OnSV,fontWeight:700,textTransform:'uppercase',letterSpacing:.8 }}>Role</div>
                  <div style={{ fontSize:13,color:S.OnS,fontWeight:600,marginTop:4 }}>{userRole || 'Not specified'}</div>
                </div>
              </div>
              <button onClick={() => { setEditBio(userBio); setEditRole(userRole); setEditingProfile(true); }}
                style={{ padding:'10px 24px',borderRadius:100,border:'none',background:`linear-gradient(135deg,${S.P},#FF8F00)`,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize:14,verticalAlign:'middle',marginRight:4 }}>edit</span>
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize:12,fontWeight:700,color:S.OnSV,marginBottom:8 }}>Profile Icon</div>
              <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:16 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: avatarChoice.bg || AVATAR_GRADIENTS[0],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, flexShrink: 0, overflow: 'hidden',
                }}>
                  {avatarChoice.type === 'emoji' ? (
                    <span>{avatarChoice.value}</span>
                  ) : (user?.photoURL && avatarChoice.type !== 'letter') ? (
                    <img src={user.photoURL} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                  ) : (
                    <span style={{ color:'#fff', fontWeight: 900, fontSize: 22 }}>
                      {(userName || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex',flexWrap:'wrap',gap:4,marginBottom:4 }}>
                    {AVATAR_EMOJIS.map(emoji => (
                      <button key={emoji} type="button" onClick={() => {
                        const newChoice = { type: 'emoji', value: emoji, bg: avatarChoice.bg || AVATAR_GRADIENTS[0] };
                        setAvatarChoice(newChoice);
                        localStorage.setItem('eatclub_avatar', JSON.stringify(newChoice));
                        notifyAvatarChange();
                      }}
                        style={{
                          width: 32, height: 32, borderRadius: '50%', border: avatarChoice.value === emoji ? '2px solid var(--md-primary)' : '1px solid var(--md-outline)',
                          background: avatarChoice.value === emoji ? 'rgba(var(--md-primary-rgb), 0.1)' : S.SV,
                          cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                        }}>
                        {emoji}
                      </button>
                    ))}
                    <button type="button" onClick={() => {
                      const newChoice = { type: 'letter', bg: avatarChoice.bg || AVATAR_GRADIENTS[0] };
                      setAvatarChoice(newChoice);
                      localStorage.setItem('eatclub_avatar', JSON.stringify(newChoice));
                      notifyAvatarChange();
                    }}
                      style={{
                        width: 32, height: 32, borderRadius: '50%', border: avatarChoice.type === 'letter' || (!avatarChoice.type && !user?.photoURL) ? '2px solid var(--md-primary)' : '1px solid var(--md-outline)',
                        background: avatarChoice.type === 'letter' || (!avatarChoice.type && !user?.photoURL) ? 'rgba(var(--md-primary-rgb), 0.1)' : S.SV,
                        cursor: 'pointer', fontSize: 10, fontWeight: 900, color: S.OnSV, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                      }} title="Initial letter">
                      Aa
                    </button>
                    {user?.photoURL && (
                      <button type="button" onClick={() => {
                        const newChoice = { type: 'google' };
                        setAvatarChoice(newChoice);
                        localStorage.setItem('eatclub_avatar', JSON.stringify(newChoice));
                        notifyAvatarChange();
                      }}
                        style={{
                          width: 32, height: 32, borderRadius: '50%', border: avatarChoice.type === 'google' ? '2px solid var(--md-primary)' : '1px solid var(--md-outline)',
                          background: avatarChoice.type === 'google' ? 'rgba(var(--md-primary-rgb), 0.1)' : S.SV,
                          cursor: 'pointer', overflow: 'hidden', padding: 0,
                        }} title="Google photo">
                        <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    )}
                  </div>
                  <div style={{ display:'flex',flexWrap:'wrap',gap:4 }}>
                    {AVATAR_GRADIENTS.map((grad, i) => (
                      <button key={i} type="button" onClick={() => {
                        const newChoice = { ...avatarChoice, bg: grad };
                        setAvatarChoice(newChoice);
                        localStorage.setItem('eatclub_avatar', JSON.stringify(newChoice));
                        notifyAvatarChange();
                      }}
                        style={{
                          width: 22, height: 22, borderRadius: '50%', border: avatarChoice.bg === grad ? '2px solid var(--md-primary)' : '1px solid var(--md-outline)',
                          background: grad, cursor: 'pointer', padding: 0,
                        }} />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ fontSize:12,fontWeight:700,color:S.OnSV,marginBottom:8 }}>Bio</div>
              <textarea className="profile-field" value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Tell us about yourself..." rows={3} />
              <div style={{ fontSize:12,fontWeight:700,color:S.OnSV,marginBottom:8 }}>Role / Position</div>
              <select
                id="dash-profile-role"
                className="profile-field"
                value={SIGNUP_ROLES.includes(editRole) ? editRole : 'Custom'}
                onChange={e => {
                  const v = e.target.value;
                  setProfileError('');
                  if (v === 'Custom') { setShowCustomRole(true); setEditRole(''); }
                  else { setShowCustomRole(false); setEditRole(v); }
                }}
                style={{ cursor:'pointer',appearance:'auto' }}
                aria-describedby={profileError ? 'profile-role-error' : undefined}
                aria-invalid={!!profileError}
              >
                <option value="" disabled>Select your role</option>
                {SIGNUP_ROLES.map(r => r !== 'Custom' && <option key={r} value={r}>{r}</option>)}
              </select>
              {showCustomRole && (
                <input className="profile-field" value={editRole} onChange={e => { setEditRole(e.target.value); setProfileError(''); }} placeholder="Enter your custom role..." style={{ marginTop:8 }} aria-label="Custom role" />
              )}
              {profileError && (
                <div id="profile-role-error" role="alert" style={{ fontSize: 11, color: '#E91E63', marginTop: 4, marginBottom: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>error</span>
                  {profileError}
                </div>
              )}
              <div style={{ display:'flex',gap:8 }}>
                <button onClick={handleSaveProfile} style={{ padding:'10px 24px',borderRadius:100,border:'none',background:S.P,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:14,verticalAlign:'middle',marginRight:4 }}>save</span>
                  Save Profile
                </button>
                <button onClick={() => setEditingProfile(false)} style={{ padding:'10px 24px',borderRadius:100,border:`1px solid ${S.Out}`,background:S.SV,color:S.OnS,fontSize:12,fontWeight:700,cursor:'pointer' }}>Cancel</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══ NOTES — Polished Notepad ═══ */}
      {activeTab === 'notes' && (
        <div style={{ position: 'relative' }}>
          {/* Take a note bar */}
          <div className="keep-input-container" onClick={createNewNote}>
            <div className="keep-input-placeholder">
              <span className="material-symbols-outlined" style={{ fontSize:18,opacity:.5 }}>lightbulb</span>
              Take a note...
            </div>
          </div>

          {/* Search + count */}
          <div className="notes-header">
            <div className="notes-search">
              <span className="material-symbols-outlined" style={{ fontSize:16,color:S.OnSV }}>search</span>
              <input value={noteSearch} onChange={e => setNoteSearch(e.target.value)} placeholder="Search notes..." />
              {noteSearch && (
                <span className="material-symbols-outlined" style={{ fontSize:16,color:S.OnSV,cursor:'pointer' }}
                  onClick={() => setNoteSearch('')}>close</span>
              )}
            </div>
            <span className="notes-count">{savedNotes.filter(n => !noteSearch || stripHtml(n.title + ' ' + n.content).toLowerCase().includes(noteSearch.toLowerCase())).length} / {savedNotes.length} notes</span>
          </div>

          {/* Note Editor Overlay */}
          {activeNoteId && (
            <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20,backdropFilter:'blur(4px)' }}
              onClick={() => setActiveNoteId(null)}>
              <div style={{ width:'100%',maxWidth:620,background:noteColor,borderRadius:16,overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,0.5)' }}
                onClick={e => e.stopPropagation()}>
                <div style={{ padding:'18px 20px 14px' }}>
                  <input className="note-editor-title" value={noteTitle} onChange={e => handleNoteChange('title', e.target.value)}
                    placeholder="Title" style={{ background:'transparent',border:'none',color:'inherit',fontSize:18 }} />
                  {/* Toolbar */}
                  <div className="note-toolbar" style={{ color:noteTextColor(noteColor) }}>
                    <button onMouseDown={e => { e.preventDefault(); document.execCommand('bold', false); document.execCommand('styleWithCSS', false, false); }}
                      className="note-tb-btn" title="Bold"><b style={{fontSize:14}}>B</b></button>
                    <button onMouseDown={e => { e.preventDefault(); document.execCommand('italic', false); }}
                      className="note-tb-btn" title="Italic"><i style={{fontSize:14}}>I</i></button>
                    <button onMouseDown={e => { e.preventDefault(); document.execCommand('underline', false); }}
                      className="note-tb-btn" title="Underline"><span style={{textDecoration:'underline',fontSize:14}}>U</span></button>
                    <button onMouseDown={e => { e.preventDefault(); document.execCommand('strikeThrough', false); }}
                      className="note-tb-btn" title="Strikethrough"><span style={{textDecoration:'line-through',fontSize:14}}>S</span></button>
                    <span className="note-tb-sep" />
                    <button onMouseDown={e => { e.preventDefault(); document.execCommand('insertUnorderedList', false); }}
                      className="note-tb-btn" title="Bullet list"><span className="material-symbols-outlined" style={{fontSize:16}}>format_list_bulleted</span></button>
                    <button onMouseDown={e => { e.preventDefault(); document.execCommand('insertOrderedList', false); }}
                      className="note-tb-btn" title="Numbered list"><span className="material-symbols-outlined" style={{fontSize:16}}>format_list_numbered</span></button>
                  </div>
                  <div className="note-editor-body"
                    contentEditable suppressContentEditableWarning ref={noteEditorRef}
                    onInput={e => {
                      const html = e.currentTarget.innerHTML;
                      setNoteContent(html);
                      if (noteTimer.current) clearTimeout(noteTimer.current);
                      noteTimer.current = setTimeout(() => {
                        saveNote(activeNoteId, { title: noteTitle, content: html, color: noteColor });
                      }, 800);
                    }}
                    style={{ color: 'inherit', minHeight: 160, fontSize: 14, lineHeight: 1.7 }}
                  />
                  <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:14 }}>
                    <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
                      {NOTE_COLORS.map(c => (
                        <div key={c} onClick={() => { setNoteColor(c); saveNote(activeNoteId, { title: noteTitle, content: noteContent, color: c }); }}
                          style={{ width:26,height:26,borderRadius:'50%',background:c,cursor:'pointer',
                            border:c===noteColor ? `2px solid ${noteTextColor(c)}` : '1px solid rgba(0,0,0,.12)',
                            boxShadow:c===noteColor ? `0 0 0 2px ${c}` : 'none',transition:'all .15s' }} />
                      ))}
                    </div>
                    <div style={{ display:'flex',gap:10,alignItems:'center' }}>
                      <span style={{ fontSize:11,fontWeight:600,color:noteSaved ? 'rgba(0,0,0,.45)' : '#d32f2f',transition:'color .3s' }}>{noteSaved ? 'Saved' : 'Saving...'}</span>
                      <button onClick={() => deleteNote(activeNoteId)}
                        style={{ width:32,height:32,borderRadius:8,border:'none',background:'rgba(0,0,0,.06)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'inherit',opacity:.6,transition:'all .15s' }}
                        title="Delete note">
                        <span className="material-symbols-outlined" style={{fontSize:18}}>delete</span>
                      </button>
                      <button onClick={() => setActiveNoteId(null)}
                        style={{ padding:'7px 18px',borderRadius:8,border:'none',background:'rgba(0,0,0,.08)',fontWeight:700,cursor:'pointer',fontSize:12,color:'inherit',transition:'all .15s' }}>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes Grid */}
          {savedNotes.filter(n => !noteSearch || stripHtml(n.title + ' ' + n.content).toLowerCase().includes(noteSearch.toLowerCase())).length === 0 ? (
            <div style={{ textAlign:'center',padding:'60px 20px',color:S.OnSV }}>
              <span className="material-symbols-outlined" style={{ fontSize:56,opacity:.2,marginBottom:12 }}>{noteSearch ? 'search_off' : 'lightbulb'}</span>
              <div style={{ fontSize:16,fontWeight:700 }}>{noteSearch ? 'No notes match your search' : 'Notes you add appear here'}</div>
              <div style={{ fontSize:12,opacity:.6,marginTop:4 }}>{noteSearch ? 'Try a different keyword' : 'Tap "Take a note..." above to get started'}</div>
            </div>
          ) : (
            <div className="notes-grid">
              {savedNotes
                .filter(n => !noteSearch || stripHtml(n.title + ' ' + n.content).toLowerCase().includes(noteSearch.toLowerCase()))
                .map(n => {
                  const tc = noteTextColor(n.color || NOTE_COLORS[0]);
                  return (
                    <div key={n.id} className="notes-note-wrapper">
                      <div className="note-card" style={{ background: n.color || NOTE_COLORS[0], color: tc }}
                        onClick={() => selectNote(n)}>
                        {n.title && <div className="note-card-title" style={{ color: tc }}>{n.title}</div>}
                        <div className="note-card-preview" style={{ color: tc }}>
                          {stripHtml(n.content) || <span style={{opacity:.4}}>No content</span>}
                        </div>
                        <div className="note-card-date" style={{ color: tc }}>{formatTime(n.updatedAt)}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ═══ LEADERBOARD ═══ */}
      {activeTab === 'leaderboard' && (
        <div className="dash-card">
          <div className="dash-card-title">
            <span className="material-symbols-outlined" style={{ color:'#FFD700',fontSize:18 }}>emoji_events</span>
            Team Leaderboard
            <span style={{ fontSize:10,color:S.OnSV,marginLeft:'auto',fontWeight:600 }}>{leaderboard.length} members</span>
          </div>
          {leaderboard.length === 0 ? (
            <div style={{ textAlign:'center',padding:'30px 20px',color:S.OnSV,fontSize:12 }}>No leaderboard data yet.</div>
          ) : (
            leaderboard.map((member, idx) => {
              const isMe = member.id === uid;
              const rankColors = ['#FFD700','#C0C0C0','#CD7F32','#4CAF50','#2196F3'];
              const rankColor = rankColors[idx] || S.OnSD;
              return (
                <div key={member.id} className="lb-item" style={{ ...(isMe ? { borderColor:S.P,background:`rgba(${S.Prgb},.05)` } : {}), cursor:'pointer' }}
                  onClick={() => setSelectedUser(member)}>
                  <div className="lb-rank" style={{ background: idx < 3 ? rankColor+'22' : S.SV, color: rankColor }}>{idx+1}</div>
                  <UserAvatar size={36} name={member.name} photoURL={member.photoURL} />
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:13,fontWeight:800,color:S.OnS,display:'flex',alignItems:'center',gap:6 }}>
                      {member.name}{isMe && <span style={{ fontSize:8,padding:'1px 6px',borderRadius:6,background:S.P,color:'#fff',fontWeight:800 }}>YOU</span>}
                    </div>
                    <div style={{ fontSize:10,color:S.OnSV }}>{member.role||'Member'} · {member.email||''}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:16,fontWeight:900,color:S.P }}>{member.points||0}</div>
                    <div style={{ fontSize:9,color:S.OnSV,fontWeight:600 }}>pts</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ═══ USER DETAIL MODAL ═══ */}
      {selectedUser && (
        <div className="contact-modal-overlay" onClick={() => { setSelectedUser(null); setChatMessages([]); }}>
          <div className="contact-card" onClick={e => e.stopPropagation()} style={{ maxWidth:520, background:S.S, borderRadius:20, overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 64px rgba(0,0,0,.55)' }}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', borderBottom:`1px solid ${S.Out}` }}>
              <UserAvatar size="lg" name={selectedUser.name} photoURL={selectedUser.photoURL} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15,fontWeight:800,color:S.OnS }}>{selectedUser.name}</div>
                <div style={{ fontSize:11,color:S.OnSV }}>{selectedUser.role||'Member'} · {selectedUser.email||''}</div>
              </div>
              <button onClick={() => { setSelectedUser(null); setChatMessages([]); }}
                style={{ width:28,height:28,borderRadius:'50%',border:'none',background:S.SV,color:S.OnS,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize:16 }}>close</span>
              </button>
            </div>
            {/* Stats */}
            <div style={{ display:'flex', gap:12, padding:'14px 20px', borderBottom:`1px solid ${S.Out}` }}>
              <div style={{ flex:1, textAlign:'center', padding:'10px', borderRadius:10, background:S.SV }}>
                <div style={{ fontSize:20, fontWeight:900, background:`linear-gradient(135deg,${S.P},#FF8F00)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{selectedUser.points||0}</div>
                <div style={{ fontSize:9, color:S.OnSV, fontWeight:700, marginTop:2 }}>Total XP</div>
              </div>
              <div style={{ flex:1, textAlign:'center', padding:'10px', borderRadius:10, background:S.SV }}>
                <div style={{ fontSize:20, fontWeight:900, color:S.P }}>{(() => { const pts = selectedUser.points||0; return pts < 100 ? 'Beginner' : pts < 300 ? 'Intermediate' : pts < 500 ? 'Advanced' : 'Expert'; })()}</div>
                <div style={{ fontSize:9, color:S.OnSV, fontWeight:700, marginTop:2 }}>Level</div>
              </div>
              <div style={{ flex:1, textAlign:'center', padding:'10px', borderRadius:10, background:S.SV }}>
                <div style={{ fontSize:20, fontWeight:900, color:'#4CAF50' }}>{selectedUser.completedCount||0}/20</div>
                <div style={{ fontSize:9, color:S.OnSV, fontWeight:700, marginTop:2 }}>Modules</div>
              </div>
            </div>
            {/* Chat */}
            <div style={{ padding:'0 20px', flex:1, display:'flex', flexDirection:'column', minHeight:0 }}>
              <div style={{ fontSize:12, fontWeight:800, color:S.OnS, padding:'10px 0', display:'flex', alignItems:'center', gap:6 }}>
                <span className="material-symbols-outlined" style={{ fontSize:16, color:S.P }}>chat</span>
                Chat with {selectedUser.name}
              </div>
              <div ref={chatListRef} style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:8, padding:'4px 0', maxHeight:200, scrollbarWidth:'thin' }}>
                {chatMessages.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'20px', color:S.OnSV, fontSize:11 }}>No messages yet. Say hello!</div>
                ) : (
                  chatMessages.map(msg => (
                    <div key={msg.id} style={{ display:'flex', justifyContent: msg.from === uid ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth:'80%', padding:'8px 14px', borderRadius:12, fontSize:12, lineHeight:1.5, 
                        background: msg.from === uid ? S.P : S.SV,
                        color: msg.from === uid ? '#fff' : S.OnS,
                        borderBottomRightRadius: msg.from === uid ? 4 : 12,
                        borderBottomLeftRadius: msg.from === uid ? 12 : 4,
                      }}>
                        <div>{msg.text}</div>
                        <div style={{ fontSize:8, opacity:.6, marginTop:3, textAlign:'right' }}>{msg.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div style={{ display:'flex', gap:8, padding:'10px 0' }}>
                <input value={chatText} onChange={e => setChatText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && chatText.trim()) { sendChat(selectedUser.id, chatText.trim(), uid, userName, setChatText); } }}
                  placeholder="Type a message..." style={{ flex:1, padding:'8px 14px', borderRadius:10, border:`1px solid ${S.Out}`, background:S.S, color:S.OnS, fontSize:12, outline:'none' }}
                  onFocus={e => e.target.style.borderColor = S.P}
                  onBlur={e => e.target.style.borderColor = S.Out} />
                <button onClick={() => { if (chatText.trim()) { sendChat(selectedUser.id, chatText.trim(), uid, userName, setChatText); } }}
                  style={{ padding:'8px 16px', borderRadius:10, border:'none', background:`linear-gradient(135deg,${S.P},#FF8F00)`, color:'#fff', fontSize:12, fontWeight:800, cursor:'pointer', whiteSpace:'nowrap' }}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function sendChat(otherUid, text, myUid, myName, setText) {
  const chatId = [myUid, otherUid].sort().join('_');
  const ref = dbRef(db, `conversations/${chatId}/messages`);
  const msg = {
    text, from: myUid, name: myName,
    time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
    timestamp: Date.now(),
  };
  push(ref, msg).catch(() => null);
  setText('');
}
