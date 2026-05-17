import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref as dbRef, onValue, push, set, update, remove } from 'firebase/database';

const S = {
  P: 'var(--md-primary)', Prgb: 'var(--md-primary-rgb)',
  S: 'var(--md-surface)', SV: 'var(--md-surface-variant)',
  S2: 'var(--md-surface-2)', OnS: 'var(--md-on-surface)',
  OnSV: 'var(--md-on-surface-var)', OnSD: 'var(--md-on-surface-dim)',
  Out: 'var(--md-outline)',
};
const NOTE_COLORS = ['#FFE0B2','#FFCDD2','#C8E6C9','#B3E5FC','#E1BEE7','#FFF9C4','#B2EBF2','#D7CCC8'];
const ROLE_OPTIONS = [
  'Chat Executive', 'Senior Chat Executive', 'Email Support Agent', 'Call Support Agent',
  'Team Lead', 'Quality Analyst', 'Operations Manager', 'Trainer',
  'Admin', 'Super Admin', 'Developer',
  'Customer Support Specialist', 'Escalation Specialist', 'Custom',
];

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

  const AVATAR_EMOJIS = ['🎮','👨‍💻','👩‍💻','😎','🚀','🌟','💪','🎯','🔥','💎','🧠','🌈'];
  const AVATAR_GRADIENTS = [
    'linear-gradient(135deg,var(--md-primary),#FF8F00)',
    'linear-gradient(135deg,#E91E63,#9C27B0)',
    'linear-gradient(135deg,#2196F3,#00BCD4)',
    'linear-gradient(135deg,#4CAF50,#8BC34A)',
    'linear-gradient(135deg,#FF5722,#FF9800)',
    'linear-gradient(135deg,#673AB7,#3F51B5)',
    'linear-gradient(135deg,#607D8B,#37474F)',
    'linear-gradient(135deg,#795548,#A1887F)',
  ];

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      try { setLastSession(JSON.parse(lastSesh)); } catch { /* ignore parse errors */ }
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

  const handleSaveProfile = () => {
    if (!uid) return;
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
        
        /* Keep Masonry Grid */
        .keep-grid { column-count: auto; column-width: 240px; column-gap: 16px; width: 100% }
        .keep-note-wrapper { break-inside: avoid; margin-bottom: 16px; transition: transform .2s ease }
        .keep-note-wrapper:hover { transform: translateY(-2px) }
        
        .note-card { border-radius:12px;padding:14px;cursor:pointer;transition:all .2s;position:relative;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.1);box-shadow: 0 1px 3px rgba(0,0,0,0.2) }
        .note-card:hover { box-shadow:0 4px 12px rgba(0,0,0,.3); border-color: rgba(255,255,255,0.2) }
        .note-card.active { border-color:${S.P}; box-shadow:0 0 0 1px ${S.P} }
        .note-card-title { font-size:15px;font-weight:700;margin-bottom:8px;word-wrap:break-word; color: #f1f3f4 }
        .note-card-preview { font-size:13px;line-height:1.5;flex:1;word-wrap:break-word; color: #e8eaed }
        .note-card-date { font-size:10px;opacity:.6;margin-top:12px;text-align:right }
        
        .keep-input-container { max-width: 600px; margin: 0 auto 32px; background: ${S.SV}; border-radius: 8px; border: 1px solid ${S.Out}; box-shadow: 0 1px 2px rgba(0,0,0,0.3); transition: all .2s }
        .keep-input-container:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.4) }
        .keep-input-placeholder { padding: 12px 16px; color: ${S.OnSV}; font-weight: 700; cursor: pointer; font-size: 14px }
        
        .note-editor-title { width:100%;padding:10px 14px;border-radius:10px;border:1px solid ${S.Out};background:${S.S};color:${S.OnS};font-size:16px;font-weight:700;margin-bottom:12px }
        .note-editor-title:focus { outline:none;border-color:${S.P} }
        .note-editor-body { width:100%;min-height:300px;border-radius:8px;padding:14px;background:${S.S};border:1px solid ${S.Out};color:${S.OnS};font-size:14px;line-height:1.6;outline:none }
        .note-editor-body:focus { border-color:${S.P} }
        .note-toolbar { display:flex;align-items:center;gap:4px;padding:8px 10px;background:${S.SV};border:1px solid ${S.Out};border-radius:8px 8px 0 0; border-bottom: none }
        .note-tb-btn { width:30px;height:28px;border:none;border-radius:6px;background:none;color:${S.OnSV};cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;font-size:13px }
        .note-tb-btn:hover { background:rgba(${S.Prgb},.1);color:${S.P} }
        .note-tb-sep { width:1px;height:16px;background:${S.Out};margin:0 2px }
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
                <div style={{ width:64,height:64,borderRadius:'50%',overflow:'hidden',flexShrink:0,background:`linear-gradient(135deg,${S.P},#FF8F00)` }}>
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                  ) : (
                    <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:900,color:'#fff' }}>
                      {userEmail.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
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
              <select className="profile-field" value={ROLE_OPTIONS.includes(editRole) ? editRole : 'Custom'} onChange={e => { const v = e.target.value; if (v === 'Custom') { setShowCustomRole(true); setEditRole(''); } else { setShowCustomRole(false); setEditRole(v); } }} style={{ cursor:'pointer',appearance:'auto' }}>
                <option value="" disabled>Select your role</option>
                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {showCustomRole && (
                <input className="profile-field" value={editRole} onChange={e => setEditRole(e.target.value)} placeholder="Enter your custom role..." style={{ marginTop:8 }} />
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

      {/* ═══ NOTES — Google Keep Redesign ═══ */}
      {activeTab === 'notes' && (
        <div style={{ position: 'relative' }}>
          {/* Take a note bar */}
          <div className="keep-input-container" onClick={createNewNote}>
            <div className="keep-input-placeholder">Take a note...</div>
          </div>

          {/* Note Editor Overlay (Keep Style) */}
          {activeNoteId && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
              onClick={() => setActiveNoteId(null)}>
              <div className="dash-card" style={{ width: '100%', maxWidth: 600, background: noteColor, color: '#1a1a1a', padding: 0, overflow: 'hidden' }}
                onClick={e => e.stopPropagation()}>
                <div style={{ padding: 16 }}>
                  <input className="note-editor-title" value={noteTitle} onChange={e => handleNoteChange('title', e.target.value)} 
                    placeholder="Title" style={{ background: 'transparent', border: 'none', color: 'inherit' }} />
                  <div style={{ display: 'flex', gap: 4, marginBottom: 8, padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                    <button onMouseDown={e => { e.preventDefault(); document.execCommand('bold', false); }}
                      style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#1a1a1a' }} title="Bold">
                      <b>B</b>
                    </button>
                    <button onMouseDown={e => { e.preventDefault(); document.execCommand('italic', false); }}
                      style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#1a1a1a' }} title="Italic">
                      <i>I</i>
                    </button>
                    <span style={{ width: 1, background: 'rgba(0,0,0,0.1)', margin: '0 4px' }} />
                    <button onMouseDown={e => { e.preventDefault(); document.execCommand('insertUnorderedList', false); }}
                      style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#1a1a1a' }} title="Bullet list">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>format_list_bulleted</span>
                    </button>
                    <button onMouseDown={e => { e.preventDefault(); document.execCommand('insertOrderedList', false); }}
                      style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#1a1a1a' }} title="Numbered list">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>format_list_numbered</span>
                    </button>
                    <span style={{ width: 1, background: 'rgba(0,0,0,0.1)', margin: '0 4px' }} />
                    <button onMouseDown={e => { e.preventDefault(); document.execCommand('strikeThrough', false); }}
                      style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#1a1a1a' }} title="Strikethrough">
                      <span style={{ textDecoration: 'line-through' }}>S</span>
                    </button>
                    <button onMouseDown={e => { e.preventDefault(); document.execCommand('underline', false); }}
                      style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#1a1a1a' }} title="Underline">
                      <span style={{ textDecoration: 'underline' }}>U</span>
                    </button>
                  </div>
                  <div className="note-editor-body"
                    contentEditable
                    suppressContentEditableWarning
                    ref={noteEditorRef}
                    onInput={e => {
                      const html = e.currentTarget.innerHTML;
                      setNoteContent(html);
                      if (noteTimer.current) clearTimeout(noteTimer.current);
                      noteTimer.current = setTimeout(() => {
                        saveNote(activeNoteId, { title: noteTitle, content: html, color: noteColor });
                      }, 800);
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'inherit', minHeight: 120 }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {NOTE_COLORS.map(c => (
                        <div key={c} onClick={() => { setNoteColor(c); saveNote(activeNoteId, { title: noteTitle, content: noteContent, color: c }); }}
                          style={{ width: 24, height: 24, borderRadius: '50%', background: c, cursor: 'pointer', border: c === noteColor ? `2px solid rgba(0,0,0,0.5)` : '1px solid rgba(0,0,0,0.1)' }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: noteSaved ? 'rgba(0,0,0,0.5)' : '#d32f2f' }}>{noteSaved ? 'Saved' : 'Saving...'}</span>
                      <button onClick={() => deleteNote(activeNoteId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.6)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                      </button>
                      <button onClick={() => setActiveNoteId(null)} style={{ padding: '6px 16px', borderRadius: 4, border: 'none', background: 'rgba(0,0,0,0.1)', fontWeight: 700, cursor: 'pointer' }}>Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Masonry Grid */}
          <div className="keep-grid">
            {savedNotes.map(n => (
              <div key={n.id} className="keep-note-wrapper">
                <div className="note-card" style={{ background: n.color || NOTE_COLORS[0], color: '#1a1a1a' }} onClick={() => selectNote(n)}>
                  {n.title && <div className="note-card-title" style={{ color: '#1a1a1a' }}>{n.title}</div>}
                  <div className="note-card-preview" style={{ color: '#1a1a1a' }} dangerouslySetInnerHTML={{ __html: n.content || '' }} />
                  <div className="note-card-date" style={{ color: 'rgba(0,0,0,0.5)' }}>{formatTime(n.updatedAt)}</div>
                </div>
              </div>
            ))}
          </div>

          {savedNotes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: S.OnSV }}>
              <span className="material-symbols-outlined" style={{ fontSize: 64, opacity: 0.3, marginBottom: 16 }}>lightbulb</span>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Notes you add appear here</div>
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
                  <div style={{ width:36,height:36,borderRadius:'50%',overflow:'hidden',flexShrink:0,background:`linear-gradient(135deg,${S.P},#FF8F00)` }}>
                    {member.photoURL ? (
                      <img src={member.photoURL} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                    ) : (
                      <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,color:'#fff' }}>
                        {(member.name||'?').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
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
              <div style={{ width:44,height:44,borderRadius:'50%',overflow:'hidden',flexShrink:0,background:`linear-gradient(135deg,${S.P},#FF8F00)` }}>
                {selectedUser.photoURL ? (
                  <img src={selectedUser.photoURL} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                ) : (
                  <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,color:'#fff' }}>
                    {(selectedUser.name||'?').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
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
