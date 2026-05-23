import { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase';
import { ref as dbRef, onValue, push, set, remove, update } from 'firebase/database';
import NoticeBoard from '../../components/admin/NoticeBoard';
import UserManagement from '../../components/admin/UserManagement';
import UserAvatar from '../../components/UserAvatar';
import ActivityLog, { useAdminLog } from '../../components/admin/ActivityLog';
import { isMainAdmin } from '../../config/roles';

function extractGoogleFileId(url) {
  if (!url) return null;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function getEmbedUrl(url) {
  if (!url) return '';
  const t = url.trim();
  // Google Drive
  const gd = extractGoogleFileId(t);
  if (gd) return `https://drive.google.com/file/d/${gd}/preview`;
  if (t.includes('/view')) return t.replace('/view', '/preview');
  // YouTube
  const ytRegexps = [
    t.match(/(?:youtube\.com|youtu\.be)\/shorts\/([a-zA-Z0-9_-]{11})/),
    t.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/),
    t.match(/(?:youtube\.com)\/embed\/([a-zA-Z0-9_-]{11})/),
    t.match(/(?:youtube\.com)\/watch\?v=([a-zA-Z0-9_-]{11})/),
    t.match(/(?:youtube\.com)\/watch\/([a-zA-Z0-9_-]{11})/),
  ];
  for (const m of ytRegexps) {
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  // Vimeo
  const vm = t.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  // Direct video files
  if (t.match(/\.(mp4|webm|ogg|mov)($|\?)/i)) return t;
  return t;
}

function stripHtml(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

function noteTextColor(bg) {
  if (!bg) return '#1a1a1a';
  const hex = bg.replace('#', '');
  const r = parseInt(hex.substring(0,2), 16), g = parseInt(hex.substring(2,4), 16), b = parseInt(hex.substring(4,6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? '#1a1a1a' : '#f1f3f4';
}
import '../../components/admin/admin.css';

const S = {
  P: 'var(--md-primary)', Prgb: 'var(--md-primary-rgb)',
  S: 'var(--md-surface)', SV: 'var(--md-surface-variant)',
  OnS: 'var(--md-on-surface)',
  OnSV: 'var(--md-on-surface-var)', OnSD: 'var(--md-on-surface-dim)',
  Out: 'var(--md-outline)',
};

const bdr = (c) => '1px solid ' + c;
const grad = (c1, c2) => 'linear-gradient(135deg,' + c1 + ',' + c2 + ')';

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
}

const TABS = [
  { id: 'users', icon: 'group', label: 'Team Members' },
  { id: 'leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
  { id: 'analytics', icon: 'analytics', label: 'Analytics' },
  { id: 'notes', icon: 'note_alt', label: 'All Notes' },
  { id: 'notices', icon: 'campaign', label: 'Notices' },
  { id: 'videos', icon: 'play_circle', label: 'Training Videos' },
  { id: 'activity', icon: 'history', label: 'Activity Log' },
];

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('users');
  const [allUsers, setAllUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [presenceData, setPresenceData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [noteDialog, setNoteDialog] = useState(null);
  const [noteSearch, setNoteSearch] = useState('');
  const [allNotes, setAllNotes] = useState({});
  const [videos, setVideos] = useState([]);
  const [videoForm, setVideoForm] = useState({ title: '', duration: '', url: '' });
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [videoToast, setVideoToast] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  const userEmail = user?.email || localStorage.getItem('eatclub_agent_email') || '';
  const uid = user?.uid || localStorage.getItem('eatclub_uid');

  const logAction = useAdminLog(user, uid);

  useEffect(() => {
    const usersRef = dbRef(db, 'users');
    const unsubUsers = onValue(usersRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        list.sort((a, b) => (b.lastLogin || 0) - (a.lastLogin || 0));
        setAllUsers(list);
      }
    });

    const lbRef = dbRef(db, 'leaderboard');
    const unsubLB = onValue(lbRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val })).filter(u => u.name);
        list.sort((a, b) => (b.points || 0) - (a.points || 0));
        setLeaderboard(list);
      }
    });

    const presenceRef = dbRef(db, 'presence');
    const unsubPresence = onValue(presenceRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        setPresenceData(list);
      }
    });

    const notesRef = dbRef(db, 'notes');
    const unsubNotes = onValue(notesRef, snap => {
      const data = snap.val();
      if (data) setAllNotes(data);
    });

    const videosRef = dbRef(db, 'trainingVideos');
    const unsubVideos = onValue(videosRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        list.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
        setVideos(list);
      } else {
        setVideos([]);
      }
    });

    return () => { unsubUsers(); unsubLB(); unsubPresence(); unsubNotes(); unsubVideos(); };
  }, []);

  const onlineCount = presenceData.filter(p => p.status === 'online').length;
  const totalXp = leaderboard.reduce((sum, u) => sum + (u.points || 0), 0);
  const totalCompleted = leaderboard.reduce((sum, u) => sum + (u.completedCount || 0), 0);

  const handleDeleteUser = (uid) => {
    if (!confirm('Are you sure you want to remove this user from the leaderboard?')) return;
    remove(dbRef(db, 'leaderboard/' + uid)).catch(() => null);
  };

  const handleUpdateUserRole = (uid, role) => {
    const newRole = prompt('Enter new role:', role || '');
    if (newRole === null) return;
    update(dbRef(db, 'users/' + uid), { role: newRole }).catch(() => null);
    update(dbRef(db, 'leaderboard/' + uid), { role: newRole }).catch(() => null);
  };

  return (
    <div className="page-content">
      <style>{`
        .admin-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:24px }
        .admin-stat { background:${S.SV};border-radius:16px;padding:16px;border:1px solid ${S.Out};text-align:center }
        .admin-tabs { display:flex;gap:8px;margin-bottom:24px;overflow-x:auto;padding-bottom:4px }
        .admin-tab { padding:10px 18px;border-radius:100px;border:1px solid ${S.Out};background:${S.SV};color:${S.OnS};font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;white-space:nowrap;display:flex;align-items:center;gap:8px }
        .admin-tab:hover { border-color:${S.P};background:rgba(var(--md-primary-rgb),.08) }
        .admin-tab.active { background:${S.P};color:#fff;border-color:${S.P} }
        .admin-card { background:${S.SV};border-radius:16px;padding:20px;border:1px solid ${S.Out};margin-bottom:16px }
        .admin-card-title { font-size:15px;font-weight:800;color:${S.OnS};margin-bottom:14px;display:flex;align-items:center;gap:10px }
        .admin-table { width:100%;border-collapse:collapse }
        .admin-table th { text-align:left;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:${S.OnSV};padding:10px 12px;border-bottom:1px solid ${S.Out} }
        .admin-table td { padding:10px 12px;font-size:12px;color:${S.OnS};border-bottom:1px solid ${S.Out} }
        .admin-table tr:hover td { background:rgba(var(--md-primary-rgb),.03) }
        .admin-badge { padding:2px 10px;border-radius:100px;font-size:10px;font-weight:700 }
        .online-badge { background:rgba(76,175,80,.12);color:#4CAF50 }
        .offline-badge { background:rgba(158,158,158,.12);color:#9E9E9E }
        .user-detail-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px }
        .user-detail-modal { background:${S.S};border-radius:20px;max-width:500px;width:100%;max-height:80vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.5) }
      `}</style>

      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:12 }}>
        <div>
          <div style={{ fontSize:22,fontWeight:900,color:S.OnS,letterSpacing:-.3 }}>Admin Dashboard</div>
          <div style={{ fontSize:12,color:S.OnSV,marginTop:2 }}>Manage team, content & oversee operations</div>
        </div>
        <div style={{ fontSize:11,color:S.OnSV,fontWeight:600,background:'rgba(var(--md-primary-rgb),.08)',padding:'6px 14px',borderRadius:100,border:'1px solid rgba(var(--md-primary-rgb),.15)' }}>
          <span className="material-symbols-outlined" style={{ fontSize:14,verticalAlign:'middle',marginRight:4 }}>shield</span>
          {userEmail}
        </div>
      </div>

      <div className="admin-grid">
        {[
          { icon:'group', label:'Total Users', val:allUsers.length, color:'#2196F3' },
          { icon:'wifi', label:'Online Now', val:onlineCount, color:'#4CAF50' },
          { icon:'emoji_events', label:'Total XP', val:totalXp, color:'#FFD700' },
          { icon:'check_circle', label:'Modules Done', val:totalCompleted, color:'#FF5722' },
        ].map(s => (
          <div key={s.label} className="admin-stat">
            <div style={{ width:40,height:40,borderRadius:12,background:s.color+'18',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize:20,color:s.color }}>{s.icon}</span>
            </div>
            <div style={{ fontSize:24,fontWeight:900,color:S.OnS,lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:10,color:S.OnSV,marginTop:4,fontWeight:700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-tabs" role="tablist" aria-label="Admin dashboard tabs">
        {TABS.filter(t => t.id !== 'activity' || isMainAdmin(userEmail)).map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            className={'admin-tab' + (activeTab === t.id ? ' active' : '')}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="material-symbols-outlined" style={{ fontSize:16 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* USERS - enhanced UserManagement */}
      {activeTab === 'users' && (
        <UserManagement user={user} onLog={logAction} />
      )}

      {/* LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="admin-card-title" style={{ padding: '16px 20px 0', marginBottom: 0 }}>
            <span className="material-symbols-outlined" style={{ color:'#FFD700',fontSize:18 }}>emoji_events</span>
            Full Leaderboard
            <span style={{ fontSize:10,color:S.OnSV,marginLeft:'auto',fontWeight:600 }}>{leaderboard.length} members</span>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>XP</th>
                  <th>Modules</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign:'center',padding:40,color:S.OnSV,fontSize:12 }}>No leaderboard data yet.</td></tr>
                ) : (
                  leaderboard.map((u, idx) => {
                    const rankColors = ['#FFD700','#C0C0C0','#CD7F32'];
                    const rankColor = rankColors[idx] || S.OnSD;
                    return (
                      <tr key={u.id}>
                        <td><div style={{ width:28,height:28,borderRadius:'50%',background:rankColor+'22',color:rankColor,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900 }}>{idx+1}</div></td>
                        <td style={{ fontWeight:700 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <UserAvatar size="xs" name={u.name} photoURL={u.photoURL} style={{ width:24,height:24,fontSize:9 }}/>
                            {u.name}
                          </div>
                        </td>
                        <td style={{ fontSize:11,color:S.OnSV }}>{u.email}</td>
                        <td><span className="admin-badge" style={{ background:'rgba(var(--md-primary-rgb),.08)',color:S.P }}>{u.role || 'Member'}</span></td>
                        <td style={{ fontWeight:800,color:S.P }}>{u.points || 0}</td>
                        <td>{u.completedCount || 0}</td>
                        <td style={{ fontSize:11,color:S.OnSV }}>{u.lastActive ? formatTime(u.lastActive) : '-'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="admin-grid" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))' }}>
          <div className="admin-card">
            <div className="admin-card-title">
              <span className="material-symbols-outlined" style={{ color:'#FF5722',fontSize:18 }}>timeline</span>
              Team Overview
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
              {[
                { label:'Active Users (Online)', val: onlineCount + ' / ' + presenceData.length, color:'#4CAF50' },
                { label:'Avg XP per User', val:allUsers.length ? Math.round(totalXp / allUsers.length) : 0, color:'#FFD700' },
                { label:'Avg Modules per User', val:allUsers.length ? (totalCompleted / allUsers.length).toFixed(1) : 0, color:'#2196F3' },
                { label:'Registered Accounts', val:allUsers.length, color:'#9C27B0' },
              ].map(stat => (
                <div key={stat.label} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',borderRadius:10,background:S.S,border:bdr(S.Out) }}>
                  <span style={{ fontSize:12,fontWeight:600,color:S.OnSV }}>{stat.label}</span>
                  <span style={{ fontSize:16,fontWeight:900,color:stat.color }}>{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-title">
              <span className="material-symbols-outlined" style={{ color:'#E91E63',fontSize:18 }}>groups</span>
              Role Distribution
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {(() => {
                const roleCounts = {};
                allUsers.forEach(u => {
                  const r = u.role || 'Member';
                  roleCounts[r] = (roleCounts[r] || 0) + 1;
                });
                const colors = ['#FF5722','#E91E63','#9C27B0','#2196F3','#4CAF50','#FF9800','#00BCD4','#607D8B'];
                return Object.entries(roleCounts).sort((a,b) => b[1]-a[1]).map(([role, count], i) => (
                  <div key={role} style={{ display:'flex',alignItems:'center',gap:10,padding:'8px 12px',borderRadius:8,background:S.S }}>
                    <div style={{ width:8,height:8,borderRadius:'50%',background:colors[i%colors.length] }} />
                    <span style={{ flex:1,fontSize:12,fontWeight:600,color:S.OnS }}>{role}</span>
                    <span style={{ fontSize:13,fontWeight:800,color:S.OnS }}>{count}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ALL NOTES */}
      {activeTab === 'notes' && (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="admin-card-title" style={{ padding: '18px 20px 0', marginBottom: 12 }}>
            <span className="material-symbols-outlined" style={{ color:S.P,fontSize:18 }}>note_alt</span>
            All Notes
            <span style={{ fontSize:10,color:S.OnSV,marginLeft:'auto',fontWeight:600 }}>
              {Object.values(allNotes).reduce((s, u) => s + Object.keys(u).length, 0)} notes from {Object.keys(allNotes).length} users
            </span>
          </div>

          {/* Search */}
          <div style={{ padding:'0 20px 12px' }}>
            <div style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 14px',borderRadius:10,background:S.S,border:bdr(S.Out),transition:'all .2s',maxWidth:360 }}
              onFocus={e => { e.currentTarget.style.borderColor = S.P; e.currentTarget.style.boxShadow = `0 0 0 2px rgba(var(--md-primary-rgb),.1)` }}
              onBlur={e => { e.currentTarget.style.borderColor = S.Out; e.currentTarget.style.boxShadow = 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize:16,color:S.OnSV }}>search</span>
              <input value={noteSearch} onChange={e => setNoteSearch(e.target.value)}
                placeholder="Search notes by title or content..."
                style={{ flex:1,border:'none',background:'none',color:S.OnS,fontSize:12,fontWeight:600,outline:'none' }} />
              {noteSearch && (
                <span className="material-symbols-outlined" style={{ fontSize:16,color:S.OnSV,cursor:'pointer' }}
                  onClick={() => setNoteSearch('')}>close</span>
              )}
            </div>
          </div>

          {Object.keys(allNotes).length === 0 ? (
            <div style={{ textAlign:'center',padding:'60px 20px',color:S.OnSV,fontSize:13 }}>
              <span className="material-symbols-outlined" style={{ fontSize:48,opacity:.2,marginBottom:12 }}>note_alt</span>
              <div style={{ fontSize:16,fontWeight:700 }}>No notes yet</div>
              <div style={{ fontSize:12,marginTop:4,opacity:.6 }}>Notes created by users will appear here</div>
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column' }}>
              {Object.entries(allNotes).map(([uid, userNotes]) => {
                const userInfo = allUsers.find(u => u.id === uid);
                const notesList = Object.entries(userNotes);
                const sortedNotes = notesList.sort((a,b) => (b[1].updatedAt||0) - (a[1].updatedAt||0));
                const filteredNotes = noteSearch ? sortedNotes.filter(([,n]) =>
                  stripHtml((n.title||'') + ' ' + (n.content||'')).toLowerCase().includes(noteSearch.toLowerCase())
                ) : sortedNotes;
                if (noteSearch && filteredNotes.length === 0) return null;
                return (
                  <div key={uid} style={{ padding:'14px 20px',borderTop:bdr(S.Out),transition:'background .15s' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:12 }}>
                      <UserAvatar size="xs" name={userInfo?.name} photoURL={userInfo?.photoURL} style={{ width:24,height:24,fontSize:9 }}/>
                      <span style={{ fontSize:13,fontWeight:700,color:S.OnS }}>{userInfo?.name || uid.slice(0,8)}</span>
                      <span style={{ fontSize:10,color:S.OnSV,fontWeight:600,padding:'2px 8px',borderRadius:6,background:S.SV }}>{filteredNotes.length} note{filteredNotes.length!==1?'s':''}</span>
                    </div>
                    <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:8 }}>
                      {filteredNotes.map(([noteId, note]) => {
                        const tc = noteTextColor(note.color);
                        const preview = stripHtml(note.content || '');
                        return (
                          <div key={noteId} onClick={() => setNoteDialog({ uid, noteId, ...note, userName: userInfo?.name })}
                            style={{ padding:'12px 14px',borderRadius:12,background:note.color||S.SV,cursor:'pointer',
                              border:bdr(S.Out),transition:'all .2s',display:'flex',flexDirection:'column',gap:4,
                              boxShadow:'0 1px 3px rgba(0,0,0,.08)',color:tc }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.18)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.08)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                            <div style={{ fontWeight:700,fontSize:13,marginBottom:2,wordWrap:'break-word' }}>{note.title || 'Untitled'}</div>
                            {preview && <div style={{ fontSize:11,lineHeight:1.4,opacity:.65,wordWrap:'break-word',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>{preview}</div>}
                            <div style={{ fontSize:9,opacity:.4,marginTop:4,fontWeight:600 }}>{formatTime(note.updatedAt)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* NOTICE BOARD */}
      {activeTab === 'notices' && (
        <NoticeBoard user={user} />
      )}

      {/* TRAINING VIDEOS */}
      {activeTab === 'videos' && (
        <div>
          <div className="admin-card">
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12 }}>
              <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                <span className="material-symbols-outlined" style={{ color:S.P,fontSize:22 }}>play_circle</span>
                <div>
                  <div style={{ fontSize:15,fontWeight:800,color:S.OnS }}>Training Videos</div>
                  <div style={{ fontSize:11,color:S.OnSV,marginTop:1 }}>{videos.length} video{videos.length!==1?'s':''} · Manage training video links shown on Home</div>
                </div>
              </div>
              <button onClick={() => { setVideoForm({ title:'',duration:'',url:'' }); setEditingVideoId(null); setShowVideoForm(true) }}
                className="admin-tab" style={{ padding:'8px 18px',background:S.P,color:'#fff',border:'none' }}>
                <span className="material-symbols-outlined" style={{ fontSize:14 }}>add</span>
                Add Video
              </button>
            </div>
          </div>

          {/* Video List */}
          <div className="admin-card" style={{ padding:0,overflow:'hidden' }}>
            {videos.length === 0 ? (
              <div style={{ textAlign:'center',padding:'60px 20px',color:S.OnSV }}>
                <span className="material-symbols-outlined" style={{ fontSize:48,opacity:.2,marginBottom:12 }}>videocam</span>
                <div style={{ fontSize:16,fontWeight:700,color:S.OnS }}>No training videos yet</div>
                <div style={{ fontSize:12,marginTop:4,opacity:.6 }}>Click "Add Video" to add training video links for agents</div>
              </div>
            ) : (
              <div style={{ display:'flex',flexDirection:'column' }}>
                {videos.map((v, idx) => (
                  <div key={v.id} style={{
                    display:'flex',alignItems:'center',gap:14,padding:'14px 20px',
                    borderTop: idx > 0 ? `1px solid ${S.Out}` : 'none',
                    transition:'background .15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = `rgba(var(--md-primary-rgb),.03)`}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{
                      width:40,height:40,borderRadius:10,
                      background:'rgba(var(--md-primary-rgb),.08)',
                      display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                    }}>
                      <span className="material-symbols-outlined" style={{ color:S.P,fontSize:20 }}>play_circle</span>
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:13,fontWeight:800,color:S.OnS }}>{v.title}</div>
                      <div style={{ display:'flex',alignItems:'center',gap:8,marginTop:2 }}>
                        {v.duration && (
                          <span style={{ fontSize:10,color:S.OnSV,display:'flex',alignItems:'center',gap:3 }}>
                            <span className="material-symbols-outlined" style={{ fontSize:12 }}>schedule</span>
                            {v.duration}
                          </span>
                        )}
                        <span style={{ fontSize:10,color:S.OnSV,opacity:.6 }}>·</span>
                        <span style={{ fontSize:10,color:S.OnSV,display:'flex',alignItems:'center',gap:3 }}>
                          <span className="material-symbols-outlined" style={{ fontSize:12 }}>link</span>
                          {v.url ? v.url.substring(0,40) + '...' : 'No URL'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display:'flex',gap:6,flexShrink:0 }}>
                      <button onClick={() => { setPreviewVideo(v) }}
                        style={{ width:32,height:32,borderRadius:8,border:'1px solid '+S.Out,background:S.SV,color:S.OnS,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = S.P; e.currentTarget.style.color = S.P }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = S.Out; e.currentTarget.style.color = S.OnS }}
                        title="Preview video">
                        <span className="material-symbols-outlined" style={{ fontSize:16 }}>visibility</span>
                      </button>
                      <button onClick={() => { setVideoForm({ title:v.title,duration:v.duration,url:v.url }); setEditingVideoId(v.id); setShowVideoForm(true) }}
                        style={{ width:32,height:32,borderRadius:8,border:'1px solid '+S.Out,background:S.SV,color:S.OnS,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = S.P; e.currentTarget.style.color = S.P }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = S.Out; e.currentTarget.style.color = S.OnS }}
                        title="Edit video">
                        <span className="material-symbols-outlined" style={{ fontSize:16 }}>edit</span>
                      </button>
                      <button onClick={() => {
                        if (!confirm('Delete "'+v.title+'"?')) return;
                        remove(dbRef(db, 'trainingVideos/' + v.id)).catch(() => null);
                        setVideoToast('Video deleted');
                        setTimeout(() => setVideoToast(null), 2000);
                      }}
                        style={{ width:32,height:32,borderRadius:8,border:'1px solid rgba(233,30,99,.2)',background:'rgba(233,30,99,.06)',color:'#E91E63',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(233,30,99,.12)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(233,30,99,.06)' }}
                        title="Delete video">
                        <span className="material-symbols-outlined" style={{ fontSize:16 }}>delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIDEO FORM MODAL */}
      {showVideoForm && (
        <div className="user-detail-overlay" onClick={() => setShowVideoForm(false)} style={{ backdropFilter:'blur(4px)' }}>
          <div className="user-detail-modal" onClick={e => e.stopPropagation()} style={{ maxWidth:480,overflow:'hidden',borderRadius:20 }}>
            <div style={{ padding:'20px 24px',background:'linear-gradient(135deg,'+S.P+',rgba(var(--md-primary-rgb),.85))',color:'#fff' }}>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:20 }}>{editingVideoId ? 'edit' : 'add_circle'}</span>
                  <span style={{ fontSize:16,fontWeight:900 }}>{editingVideoId ? 'Edit Video' : 'Add New Video'}</span>
                </div>
                <button onClick={() => setShowVideoForm(false)}
                  style={{ width:28,height:28,borderRadius:'50%',border:'none',background:'rgba(255,255,255,.15)',color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:16 }}>close</span>
                </button>
              </div>
            </div>
            <div style={{ padding:'20px 24px',background:S.S }}>
              <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
                <div>
                  <label style={{ fontSize:11,fontWeight:700,color:S.OnSV,display:'block',marginBottom:4 }}>Video Title *</label>
                  <input value={videoForm.title} onChange={e => setVideoForm(p => ({...p,title:e.target.value}))}
                    placeholder="e.g. Training Part-1"
                    style={{ width:'100%',padding:'10px 14px',borderRadius:10,border:'1px solid '+S.Out,background:S.SV,color:S.OnS,fontSize:13,fontWeight:600,outline:'none' }}
                    onFocus={e => { e.currentTarget.style.borderColor = S.P; e.currentTarget.style.boxShadow = `0 0 0 2px rgba(var(--md-primary-rgb),.1)` }}
                    onBlur={e => { e.currentTarget.style.borderColor = S.Out; e.currentTarget.style.boxShadow = 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize:11,fontWeight:700,color:S.OnSV,display:'block',marginBottom:4 }}>Duration</label>
                  <input value={videoForm.duration} onChange={e => setVideoForm(p => ({...p,duration:e.target.value}))}
                    placeholder="e.g. 1:04:02"
                    style={{ width:'100%',padding:'10px 14px',borderRadius:10,border:'1px solid '+S.Out,background:S.SV,color:S.OnS,fontSize:13,fontWeight:600,outline:'none' }}
                    onFocus={e => { e.currentTarget.style.borderColor = S.P; e.currentTarget.style.boxShadow = `0 0 0 2px rgba(var(--md-primary-rgb),.1)` }}
                    onBlur={e => { e.currentTarget.style.borderColor = S.Out; e.currentTarget.style.boxShadow = 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize:11,fontWeight:700,color:S.OnSV,display:'block',marginBottom:4 }}>Google Drive URL *</label>
                  <input value={videoForm.url} onChange={e => setVideoForm(p => ({...p,url:e.target.value}))}
                    placeholder="https://drive.google.com/file/d/..."
                    style={{ width:'100%',padding:'10px 14px',borderRadius:10,border:'1px solid '+S.Out,background:S.SV,color:S.OnS,fontSize:13,fontWeight:600,outline:'none' }}
                    onFocus={e => { e.currentTarget.style.borderColor = S.P; e.currentTarget.style.boxShadow = `0 0 0 2px rgba(var(--md-primary-rgb),.1)` }}
                    onBlur={e => { e.currentTarget.style.borderColor = S.Out; e.currentTarget.style.boxShadow = 'none' }} />
                </div>
                {(() => {
                  if (!videoForm.url || videoForm.url.length < 5) return null;
                  const u = videoForm.url;
                  const isGd = !!extractGoogleFileId(u);
                  const isYt = /(youtube\.com|youtu\.be)/.test(u);
                  const isVm = /vimeo\.com/.test(u);
                  const isDirect = /\.(mp4|webm|ogg|mov)($|\?)/i.test(u);
                  if (isGd || isYt || isVm || isDirect) {
                    const label = isGd ? 'Google Drive' : isYt ? 'YouTube' : isVm ? 'Vimeo' : 'Direct video';
                    return (
                      <div style={{ padding:'10px 14px',borderRadius:10,background:'rgba(76,175,80,.06)',border:'1px solid rgba(76,175,80,.2)',fontSize:11,color:'#4CAF50',fontWeight:700,display:'flex',alignItems:'center',gap:8 }}>
                        <span className="material-symbols-outlined" style={{ fontSize:16 }}>check_circle</span>
                        {label} link detected — will play inline
                      </div>
                    );
                  }
                  return (
                    <div style={{ padding:'10px 14px',borderRadius:10,background:'rgba(255,152,0,.06)',border:'1px solid rgba(255,152,0,.2)',fontSize:11,color:'#FF9800',fontWeight:700,display:'flex',alignItems:'center',gap:8 }}>
                      <span className="material-symbols-outlined" style={{ fontSize:16 }}>warning</span>
                      Unrecognized URL format. Supported: Google Drive, YouTube, Vimeo, direct .mp4/.webm/.ogg/.mov
                    </div>
                  );
                })()}
              </div>
              <div style={{ display:'flex',gap:10,marginTop:20 }}>
                <button onClick={() => setShowVideoForm(false)}
                  style={{ flex:1,padding:'10px 16px',borderRadius:10,border:'1px solid '+S.Out,background:S.SV,color:S.OnS,cursor:'pointer',fontSize:12,fontWeight:700 }}>
                  Cancel
                </button>
                <button onClick={() => {
                  if (!videoForm.title.trim() || !videoForm.url.trim()) {
                    setVideoToast('Title and URL are required');
                    setTimeout(() => setVideoToast(null), 2000);
                    return;
                  }
                  const videoData = {
                    title: videoForm.title.trim(),
                    duration: videoForm.duration.trim(),
                    url: videoForm.url.trim(),
                    addedAt: Date.now(),
                    addedBy: userEmail,
                  };
                  if (editingVideoId) {
                    update(dbRef(db, 'trainingVideos/' + editingVideoId), videoData).catch(() => null);
                    setVideoToast('Video updated');
                  } else {
                    push(dbRef(db, 'trainingVideos'), videoData);
                    setVideoToast('Video added');
                  }
                  setTimeout(() => setVideoToast(null), 2000);
                  setShowVideoForm(false);
                  setEditingVideoId(null);
                }}
                  style={{ flex:1,padding:'10px 16px',borderRadius:10,border:'none',background:S.P,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:800,
                    opacity: (!videoForm.title.trim() || !videoForm.url.trim()) ? .6 : 1 }}>
                  {editingVideoId ? 'Update Video' : 'Add Video'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PREVIEW MODAL */}
      {previewVideo && (
        <div className="user-detail-overlay" onClick={() => setPreviewVideo(null)} style={{ backdropFilter:'blur(4px)' }}>
          <div className="user-detail-modal" onClick={e => e.stopPropagation()} style={{ maxWidth:840,overflow:'hidden',borderRadius:20 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 20px',borderBottom:'1px solid '+S.Out }}>
              <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                <span className="material-symbols-outlined" style={{ color:S.P,fontSize:20 }}>play_circle</span>
                <span style={{ fontSize:15,fontWeight:700,color:S.OnS }}>{previewVideo.title}</span>
                {previewVideo.duration && (
                  <span style={{ fontSize:11,color:S.OnSV,fontWeight:600,padding:'2px 10px',borderRadius:6,background:S.SV }}>
                    {previewVideo.duration}
                  </span>
                )}
              </div>
              <button onClick={() => setPreviewVideo(null)}
                style={{ width:28,height:28,borderRadius:'50%',border:'none',background:S.SV,color:S.OnS,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize:16 }}>close</span>
              </button>
            </div>
            <div style={{ position:'relative',width:'100%',paddingTop:'56.25%',background:'#000' }}>
              <iframe src={getEmbedUrl(previewVideo.url)} style={{ position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none' }} allow="autoplay; fullscreen" title={previewVideo.title} />
            </div>
            <div style={{ padding:'14px 20px',display:'flex',justifyContent:'flex-end' }}>
              <button onClick={() => setPreviewVideo(null)}
                style={{ padding:'8px 20px',borderRadius:8,border:'none',background:S.P,color:'#fff',cursor:'pointer',fontSize:11,fontWeight:800 }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITY LOG */}
      {activeTab === 'activity' && isMainAdmin(userEmail) && (
        <ActivityLog user={user} />
      )}

      {/* USER DETAIL MODAL */}
      {selectedUser && (
        <div className="user-detail-overlay" onClick={() => setSelectedUser(null)}>
          <div className="user-detail-modal" onClick={e => e.stopPropagation()}>
            <div style={{ padding:'20px 24px',borderBottom:bdr(S.Out),display:'flex',alignItems:'center',gap:14 }}>
              <UserAvatar size={48} name={selectedUser.name} photoURL={selectedUser.photoURL} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:16,fontWeight:800,color:S.OnS }}>{selectedUser.name}</div>
                <div style={{ fontSize:12,color:S.OnSV }}>{selectedUser.email}</div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ width:28,height:28,borderRadius:'50%',border:'none',background:S.SV,color:S.OnS,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize:16 }}>close</span>
              </button>
            </div>
            <div style={{ padding:'16px 24px' }}>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16 }}>
                <div style={{ padding:12,borderRadius:10,background:S.SV }}>
                  <div style={{ fontSize:10,fontWeight:700,color:S.OnSV,textTransform:'uppercase' }}>Role</div>
                  <div style={{ fontSize:14,fontWeight:800,color:S.OnS,marginTop:2 }}>{selectedUser.role || 'Member'}</div>
                </div>
                <div style={{ padding:12,borderRadius:10,background:S.SV }}>
                  <div style={{ fontSize:10,fontWeight:700,color:S.OnSV,textTransform:'uppercase' }}>Last Login</div>
                  <div style={{ fontSize:14,fontWeight:800,color:S.OnS,marginTop:2 }}>{selectedUser.lastLogin ? formatTime(selectedUser.lastLogin) : 'Unknown'}</div>
                </div>
              </div>
              {selectedUser.bio && (
                <div style={{ padding:'12px 14px',borderRadius:10,background:S.SV,marginBottom:16 }}>
                  <div style={{ fontSize:10,fontWeight:700,color:S.OnSV,textTransform:'uppercase',marginBottom:4 }}>Bio</div>
                  <div style={{ fontSize:12,color:S.OnS }}>{selectedUser.bio}</div>
                </div>
              )}
              <div style={{ display:'flex',gap:8 }}>
                <button onClick={() => handleUpdateUserRole(selectedUser.id, selectedUser.role)}
                  style={{ flex:1,padding:'8px 16px',borderRadius:100,border:bdr(S.Out),background:S.SV,color:S.OnS,fontSize:11,fontWeight:700,cursor:'pointer' }}>
                  Change Role
                </button>
                <button onClick={() => { handleDeleteUser(selectedUser.id); setSelectedUser(null); }}
                  style={{ flex:1,padding:'8px 16px',borderRadius:100,border:'1px solid rgba(233,30,99,.2)',background:'rgba(233,30,99,.06)',color:'#E91E63',fontSize:11,fontWeight:700,cursor:'pointer' }}>
                  Remove from LB
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO TOAST */}
      {videoToast && (
        <div style={{
          position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',
          zIndex:200000,display:'flex',alignItems:'center',gap:8,
          padding:'10px 20px',borderRadius:12,
          background:S.S,color:S.OnS,
          border:'1px solid '+S.Out,
          fontSize:13,fontWeight:700,
          boxShadow:'0 8px 24px rgba(0,0,0,.4)',
          animation:'mfade .2s ease',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize:16,color:S.P }}>check_circle</span>
          {videoToast}
        </div>
      )}

      {/* NOTE DETAIL DIALOG */}
      {noteDialog && (
        <div className="user-detail-overlay" onClick={() => setNoteDialog(null)} style={{ backdropFilter:'blur(4px)' }}>
          <div className="user-detail-modal" onClick={e => e.stopPropagation()} style={{ maxWidth:520,overflow:'hidden',borderRadius:20 }}>
            {/* Header — note color strip */}
            <div style={{ padding:'20px 24px',background:noteDialog.color||S.SV,color:noteTextColor(noteDialog.color) }}>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10 }}>
                <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                  <UserAvatar size="xs" name={noteDialog.userName} style={{ width:20,height:20,fontSize:8,flexShrink:0 }}/>
                  <span style={{ fontSize:10,fontWeight:700,opacity:.6,textTransform:'uppercase',letterSpacing:.3 }}>
                    {noteDialog.userName || 'User'}
                  </span>
                </div>
                <button onClick={() => setNoteDialog(null)}
                  style={{ width:28,height:28,borderRadius:'50%',border:'none',background:'rgba(0,0,0,.06)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'inherit',opacity:.6,transition:'all .15s' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:16 }}>close</span>
                </button>
              </div>
              {noteDialog.title && (
                <div style={{ fontSize:20,fontWeight:900,lineHeight:1.3,wordWrap:'break-word' }}>{noteDialog.title}</div>
              )}
            </div>
            {/* Content */}
            <div style={{ padding:'20px 24px',background:S.S }}>
              <div style={{ fontSize:14,lineHeight:1.7,color:S.OnS,wordWrap:'break-word' }}
                dangerouslySetInnerHTML={{ __html: noteDialog.content || '<span style="opacity:.4">No content</span>' }} />
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:20,paddingTop:14,borderTop:bdr(S.Out) }}>
                <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:12,color:S.OnSV }}>schedule</span>
                  <span style={{ fontSize:11,color:S.OnSV,fontWeight:600 }}>{formatTime(noteDialog.updatedAt)}</span>
                </div>
                <button onClick={() => setNoteDialog(null)}
                  style={{ padding:'8px 20px',borderRadius:8,border:'none',background:S.P,color:'#fff',cursor:'pointer',fontSize:11,fontWeight:800,transition:'all .15s' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
