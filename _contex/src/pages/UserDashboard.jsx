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

  // Notes state
  const [savedNotes, setSavedNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteColor, setNoteColor] = useState(NOTE_COLORS[0]);
  const [noteSaved, setNoteSaved] = useState(true);
  const noteTimer = useRef(null);

  // Last session
  const [lastSession, setLastSession] = useState(null);

  const userEmail = user?.email || localStorage.getItem('eatclub_agent_email') || '';
  const userName = user?.displayName || userProfile?.name || localStorage.getItem('eatclub_agent_name') || 'User';
  const userBio = userProfile?.bio || '';
  const userRole = userProfile?.role || '';
  const uid = user?.uid || localStorage.getItem('eatclub_uid') || '';

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
        .note-card { border-radius:14px;padding:18px;cursor:pointer;transition:all .25s cubic-bezier(.34,1.56,.64,1);position:relative;min-height:120px;display:flex;flex-direction:column;border:1px solid transparent }
        .note-card:hover { transform:translateY(-4px) scale(1.02);box-shadow:0 12px 32px rgba(0,0,0,.18) }
        .note-card.active { border-color:${S.P};box-shadow:0 0 0 2px ${S.P} }
        .note-card-title { font-size:14px;font-weight:800;margin-bottom:6px;word-wrap:break-word }
        .note-card-preview { font-size:12px;line-height:1.5;flex:1;word-wrap:break-word;overflow:hidden }
        .note-card-date { font-size:9px;opacity:.6;margin-top:8px }
        .note-editor-title { width:100%;padding:10px 14px;border-radius:10px;border:1px solid ${S.Out};background:${S.S};color:${S.OnS};font-size:15px;font-weight:800;margin-bottom:12px }
        .note-editor-title:focus { outline:none;border-color:${S.P} }
        .note-editor-body { width:100%;min-height:200px;border-radius:10px;padding:14px;background:${S.S};border:1px solid ${S.Out};color:${S.OnS};font-size:13px;line-height:1.8;resize:vertical;font-family:var(--font-body) }
        .note-editor-body:focus { outline:none;border-color:${S.P} }
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
                <div style={{ width:64,height:64,borderRadius:'50%',background:`linear-gradient(135deg,${S.P},#FF8F00)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:900,color:'#fff',flexShrink:0 }}>
                  {userEmail.charAt(0).toUpperCase()}
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
              <div style={{ fontSize:12,fontWeight:700,color:S.OnSV,marginBottom:8 }}>Bio</div>
              <textarea className="profile-field" value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Tell us about yourself..." rows={3} />
              <div style={{ fontSize:12,fontWeight:700,color:S.OnSV,marginBottom:8 }}>Role / Position</div>
              <input className="profile-field" value={editRole} onChange={e => setEditRole(e.target.value)} placeholder="e.g. Chat Executive, Senior Agent..." />
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

      {/* ═══ NOTES — Google Keep Style ═══ */}
      {activeTab === 'notes' && (
        <div style={{ display:'grid',gridTemplateColumns:'280px 1fr',gap:16 }}>
          {/* Notes list — Google Keep card wall */}
          <div>
            <div className="dash-card" style={{ padding:14 }}>
              <div style={{ fontSize:12,fontWeight:800,color:S.OnS,marginBottom:12,display:'flex',alignItems:'center',gap:8 }}>
                <span className="material-symbols-outlined" style={{ fontSize:16,color:S.P }}>lightbulb</span>
                Keep Notes
                <span style={{ fontSize:10,color:S.OnSV,marginLeft:'auto',fontWeight:600 }}>{savedNotes.length}</span>
              </div>
              <button onClick={createNewNote} style={{ width:'100%',padding:'8px 12px',borderRadius:10,border:`1px dashed ${S.P}`,background:'none',color:S.P,fontSize:11,fontWeight:700,cursor:'pointer',marginBottom:12,display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
                <span className="material-symbols-outlined" style={{ fontSize:14 }}>add</span>
                New Note
              </button>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                {savedNotes.length === 0 ? (
                  <div style={{ textAlign:'center',padding:'20px',color:S.OnSV,fontSize:11 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:28,display:'block',marginBottom:8,color:S.OnSD }}>lightbulb</span>
                    No notes yet
                  </div>
                ) : (
                  savedNotes.map(n => (
                    <div key={n.id} className={`note-card ${activeNoteId === n.id ? 'active' : ''}`}
                      style={{ background: n.color || NOTE_COLORS[0], color: '#1A1A1A' }}
                      onClick={() => selectNote(n)}>
                      {n.title && <div className="note-card-title">{n.title}</div>}
                      <div className="note-card-preview">{(n.content || '').substring(0,100)}{(n.content||'').length>100?'...':''}</div>
                      <div className="note-card-date">{formatTime(n.updatedAt)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Note Editor */}
          <div>
            <div className="dash-card">
              {activeNoteId ? (
                <>
                  <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12 }}>
                    <div className="dash-card-title" style={{ margin:0,display:'flex',alignItems:'center',gap:6 }}>
                      <span className="material-symbols-outlined" style={{ fontSize:18,color:S.P }}>edit_note</span>
                      Edit Note
                    </div>
                    <div style={{ display:'flex',gap:6,alignItems:'center' }}>
                      {/* Color picker */}
                      <div style={{ display:'flex',gap:3 }}>
                        {NOTE_COLORS.slice(0,8).map(c => (
                          <div key={c} onClick={() => { setNoteColor(c); saveNote(activeNoteId, { title: noteTitle, content: noteContent, color: c }); }}
                            style={{ width:20,height:20,borderRadius:'50%',background:c,cursor:'pointer',border: c === noteColor ? `2px solid ${S.P}` : '2px solid transparent',transition:'all .15s' }} />
                        ))}
                      </div>
                      <span style={{ fontSize:10,color:noteSaved?'#4CAF50':'#FF9800',fontWeight:600,marginLeft:6 }}>{noteSaved?'Saved':'...'}</span>
                      <button onClick={() => deleteNote(activeNoteId)} style={{ padding:'4px 8px',borderRadius:8,border:'none',background:'rgba(255,82,82,.1)',color:'#ff5252',fontSize:10,fontWeight:700,cursor:'pointer' }}>
                        <span className="material-symbols-outlined" style={{ fontSize:13 }}>delete</span>
                      </button>
                    </div>
                  </div>
                  <input className="note-editor-title" value={noteTitle} onChange={e => handleNoteChange('title', e.target.value)} placeholder="Note title..." />
                  <textarea className="note-editor-body" value={noteContent} onChange={e => handleNoteChange('content', e.target.value)} placeholder="Start writing..." style={{ background: noteColor+'44' }} />
                </>
              ) : (
                <div style={{ textAlign:'center',padding:'60px 20px',color:S.OnSV,fontSize:12 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:48,color:S.OnSD,display:'block',marginBottom:12 }}>lightbulb</span>
                  Select a note or create a new one<br/>
                  <span style={{ fontSize:10 }}>Syncs with your email ({userEmail})</span>
                </div>
              )}
            </div>
          </div>
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
                <div key={member.id} className="lb-item" style={isMe ? { borderColor:S.P,background:`rgba(${S.Prgb},.05)` } : {}}>
                  <div className="lb-rank" style={{ background: idx < 3 ? rankColor+'22' : S.SV, color: rankColor }}>{idx+1}</div>
                  <div style={{ width:36,height:36,borderRadius:'50%',background:`linear-gradient(135deg,${S.P},#FF8F00)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,color:'#fff',flexShrink:0 }}>
                    {(member.name||'?').charAt(0).toUpperCase()}
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
    </div>
  );
}
