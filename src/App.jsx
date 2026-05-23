import { useState, useEffect, useRef } from 'react';
import { useLocalStorage, useLocalStorageSet } from './hooks/useLocalStorage';
import './index.css';
import './redesign.css';
import Clock from './components/Clock';
import YTMusicPlayer from './components/YTMusicPlayer';
import DynamicTitle from './components/DynamicTitle';
import WelcomeAnimation from './components/WelcomeAnimation';
import EntryPage from './components/EntryPage';
import Home from './pages/Home';
import About from './pages/About';
import ChatKPIs from './pages/ChatKPIs';
import ChatFlows from './pages/ChatFlows';
import HashLibrary from './pages/HashLibrary';
import AgentGuide from './pages/AgentGuide';
import CallKPIs from './pages/CallKPIs';
import CallScripts from './pages/CallScripts';
import Box8 from './pages/Box8';
import MojoPortioning from './pages/MojoPortioning';
import Tags from './pages/Tags';
import Resolution from './pages/Resolution';
import Ratings from './pages/Ratings';
import Escalation from './pages/Escalation';
import Refunds from './pages/Refunds';
import YellowAI from './pages/YellowAI';
import CheatSheet from './pages/CheatSheet';
import Quiz from './pages/Quiz';
import PlatformOverview from './pages/PlatformOverview';
import RefundsMaster from './pages/RefundsMaster';
import CCTemplates from './pages/CCTemplates';
import UserDashboard from './pages/UserDashboard';
import ProfileSetup from './pages/ProfileSetup';
import DirectChat from './components/DirectChat';
import AdminDashboard from './pages/admin/AdminDashboard';
import NoticeBoardPage from './pages/NoticeBoard';

import { db, auth } from './firebase';
import { MAIN_ADMIN_EMAILS, isAdminRole } from './config/roles';
import { ref as dbRef, set, push, onValue, onDisconnect, serverTimestamp, remove, update } from 'firebase/database';
import { signInAnonymously, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { pinTeamMessage, listenUserConversations } from './services/messaging';
import UserAvatar from './components/UserAvatar';
import { getUserColor, notifyAvatarChange } from './hooks/useAvatar';

// ── NOTEPAD COMPONENT (Firebase-synced with Dashboard) ──
function NotepadPanel({ uid, onClose, onNavigateDashboard }) {
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [viewingNote, setViewingNote] = useState(null);
  const [viewMode, setViewMode] = useState('view');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editColor, setEditColor] = useState('');
  const editTimer = useRef(null);

  const NOTE_COLORS = ['#FFE0B2','#FFCDD2','#C8E6C9','#B3E5FC','#E1BEE7','#FFF9C4','#B2EBF2','#D7CCC8'];

  useEffect(() => {
    if (!uid) return;
    const notesRef = dbRef(db, `notes/${uid}`);
    const unsub = onValue(notesRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        setNotes(list);
      } else {
        setNotes([]);
      }
    });
    return () => unsub();
  }, [uid]);

  const saveNote = (id, data) => {
    if (!uid || !id) return;
    set(dbRef(db, `notes/${uid}/${id}`), { ...data, updatedAt: Date.now() });
  };

  const createNote = () => {
    if (!uid || !newNoteText.trim()) return;
    const lines = newNoteText.trim().split('\n');
    const title = lines[0].substring(0, 60) || 'Untitled';
    const content = lines.slice(1).join('\n');
    const color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
    const newRef = push(dbRef(db, `notes/${uid}`));
    set(newRef, { title, content, color, createdAt: Date.now(), updatedAt: Date.now() });
    setNewNoteText('');
  };

  const openNote = (note) => {
    setViewingNote(note);
    setViewMode('view');
    const plainContent = note.content ? note.content.replace(/<[^>]*>/g, '') : '';
    setEditTitle(note.title || '');
    setEditContent(plainContent);
    setEditColor(note.color || NOTE_COLORS[0]);
  };

  const closeView = () => {
    setViewingNote(null);
    setViewMode('view');
    if (editTimer.current) clearTimeout(editTimer.current);
  };

  const switchToEdit = () => {
    setViewMode('edit');
  };

  const handleEditChange = (field, val) => {
    if (field === 'single') {
      const lines = val.split('\n');
      const newTitle = lines[0].substring(0, 60) || 'Untitled';
      const newContent = lines.slice(1).join('\n');
      setEditTitle(newTitle);
      setEditContent(newContent);
      if (editTimer.current) clearTimeout(editTimer.current);
      editTimer.current = setTimeout(() => {
        if (viewingNote) saveNote(viewingNote.id, { title: newTitle, content: newContent, color: editColor });
      }, 600);
    } else {
      if (field === 'title') setEditTitle(val);
      else setEditContent(val);
      if (editTimer.current) clearTimeout(editTimer.current);
      editTimer.current = setTimeout(() => {
        if (viewingNote) saveNote(viewingNote.id, { title: field === 'title' ? val : editTitle, content: field === 'content' ? val : editContent, color: editColor });
      }, 600);
    }
  };

  const deleteNote = (noteId) => {
    if (!uid) return;
    remove(dbRef(db, `notes/${uid}/${noteId}`));
    closeView();
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const stripHtml = (html) => html ? html.replace(/<[^>]*>/g, '') : '';

  const noteTextColor = (bg) => {
    if (!bg) return 'var(--md-on-surface)';
    const hex = bg.replace('#', '');
    const r = parseInt(hex.substring(0,2), 16), g = parseInt(hex.substring(2,4), 16), b = parseInt(hex.substring(4,6), 16);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.55 ? '#1a1a1a' : '#f1f3f4';
  };

  return (
    <>
    <div style={{
      position: 'absolute', top: 58, right: 0, width: 'min(380px, 95vw)',
      background: 'var(--md-surface)', borderRadius: 24,
      border: '1px solid rgba(var(--md-primary-rgb), 0.15)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)',
      zIndex: 100, display: 'flex', flexDirection: 'column',
      height: '460px', maxHeight: '70vh', overflow: 'hidden',
      animation: 'chatPanelIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        background: 'linear-gradient(135deg, var(--md-primary), rgba(var(--md-primary-rgb), 0.85))',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderRadius: '24px 24px 0 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>note_alt</span>
          <span style={{ fontSize: 14, fontWeight: 900 }}>Notepad</span>
          <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, background: 'rgba(255,255,255,0.15)', padding: '1px 8px', borderRadius: 10 }}>{notes.length}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={() => { onClose(); if (onNavigateDashboard) onNavigateDashboard(); }}
            style={{
              padding: '3px 10px', borderRadius: 6, border: 'none',
              background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer',
              fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap',
            }}>
            View All →
          </button>
          <button onClick={onClose} style={{
            width: 26, height: 26, borderRadius: 6, border: 'none',
            background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
          </button>
        </div>
      </div>

      {/* Quick-add */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--md-outline)', display: 'flex', gap: 8 }}>
        <input
          value={newNoteText}
          onChange={e => setNewNoteText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); createNote(); } }}
          placeholder="Quick note... (Enter to save)"
          style={{
            flex: 1, padding: '8px 12px', borderRadius: 10,
            border: '1px solid var(--md-outline)', background: 'var(--md-surface-variant)',
            color: 'var(--md-on-surface)', fontSize: 12, outline: 'none',
          }}
        />
        <button onClick={createNote} disabled={!newNoteText.trim()}
          style={{
            padding: '8px 14px', borderRadius: 10, border: 'none',
            background: !newNoteText.trim() ? 'var(--md-on-surface-dim)' : 'var(--md-primary)',
            color: '#fff', cursor: !newNoteText.trim() ? 'not-allowed' : 'pointer',
            fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap',
          }}>
          + Add
        </button>
      </div>

      {/* Notes list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
        {!uid ? (
          <div style={{ textAlign: 'center', padding: 30, color: 'var(--md-on-surface-dim)', fontSize: 11 }}>
            Sign in to use the notepad
          </div>
        ) : notes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 30, color: 'var(--md-on-surface-dim)', fontSize: 11 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, opacity: 0.3, display: 'block', marginBottom: 6 }}>note_add</span>
            No notes yet. Type above to create one!
          </div>
        ) : (
          notes.map(note => {
            const tc = noteTextColor(note.color || NOTE_COLORS[0]);
            return (
            <div key={note.id} style={{ marginBottom: 8, borderRadius: 12, overflow: 'hidden', border: viewingNote?.id === note.id ? `2px solid ${tc}` : `1px solid var(--md-outline)`, background: note.color || NOTE_COLORS[0], transition: 'border 0.2s, box-shadow 0.2s', boxShadow: viewingNote?.id === note.id ? `0 0 0 1px ${tc}` : 'none' }}>
              <div onClick={() => openNote(note)}
                style={{ padding: '10px 12px', cursor: 'pointer', minHeight: 44, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: tc, marginBottom: 2, lineHeight: 1.3 }}>{note.title || 'Untitled'}</div>
                {note.content && <div style={{ fontSize: 10, color: tc, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.7 }}>{stripHtml(note.content).substring(0, 80)}</div>}
                <div style={{ fontSize: 9, color: tc, marginTop: 3, opacity: 0.5 }}>{formatTime(note.updatedAt)}</div>
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '7px 14px', borderTop: '1px solid var(--md-outline)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 9, color: 'var(--md-on-surface-dim)',
      }}>
        <span>Synced with Dashboard 🔄</span>
        <span>{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
      </div>
    </div>

    {/* Note Viewer Popup */}
    {viewingNote && (
      <div style={{ position: 'absolute', top: 58, right: 395, width: '320px', maxHeight: '70vh', zIndex: 100, display: 'flex', flexDirection: 'column', background: viewMode === 'edit' ? 'var(--md-surface)' : (viewingNote.color || NOTE_COLORS[0]), borderRadius: 18, boxShadow: '0 25px 80px rgba(0,0,0,0.35)', animation: 'chatPanelIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', overflow: 'hidden', color: viewMode === 'view' ? noteTextColor(viewingNote.color || NOTE_COLORS[0]) : 'inherit' }}
        onClick={e => e.stopPropagation()}>

          {/* Minimal Header */}
          <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'inherit', opacity: 0.6 }}>
              {viewMode === 'edit' ? 'Edit Note' : 'Preview'}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {viewMode === 'view' ? (
                <button onClick={switchToEdit} style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit' }} title="Edit Note">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                </button>
              ) : null}
              <button onClick={closeView} style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit' }} title="Close">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px 20px' }}>
            {viewMode === 'edit' ? (
              <div>
                <textarea 
                  value={[editTitle === 'Untitled' ? '' : editTitle, editContent].filter(Boolean).join('\n')} 
                  onChange={e => handleEditChange('single', e.target.value)}
                  placeholder="Take a note..."
                  rows={10}
                  style={{ width: '100%', padding: '14px', borderRadius: 12, border: '1px solid var(--md-outline)', background: 'var(--md-surface-variant)', color: 'var(--md-on-surface)', fontSize: 14, lineHeight: 1.6, resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
                <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                  {NOTE_COLORS.map(c => (
                    <div key={c} onClick={() => { setEditColor(c); if (viewingNote) saveNote(viewingNote.id, { title: editTitle, content: editContent, color: c }); }}
                      style={{ width: 24, height: 24, borderRadius: '50%', background: c, cursor: 'pointer', border: c === editColor ? `2px solid ${noteTextColor(c)}` : '1px solid var(--md-outline)', boxShadow: c === editColor ? `0 0 0 2px ${c}` : 'none', transition: 'all .15s' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
                  <button onClick={() => deleteNote(viewingNote.id)}
                    style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'rgba(233,30,99,0.12)', color: '#E91E63', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                    Delete
                  </button>
                  <button onClick={() => setViewMode('view')}
                    style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--md-primary)', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 800 }}>
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {viewingNote.title && <div style={{ fontSize: 18, fontWeight: 900, color: 'inherit', marginBottom: 12 }}>{viewingNote.title}</div>}
                {viewingNote.content ? (
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: 'inherit' }} dangerouslySetInnerHTML={{ __html: viewingNote.content }} />
                ) : (
                  <div style={{ fontSize: 13, color: 'inherit', opacity: 0.4, fontStyle: 'italic' }}>No content</div>
                )}
              </div>
            )}
          </div>
      </div>
    )}
  </>
  );
}

// ── NAV GROUPS (accordion menu) ──
const NAV_GROUPS = [
  {
    id: 'home',
    icon: 'home',
    label: 'Home',
    type: 'single',
  },
  {
    id: 'dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
    type: 'single',
  },
  {
    id: 'notices',
    icon: 'campaign',
    label: 'Notice Board',
    type: 'single',
  },
  {
    id: 'admin',
    icon: 'shield',
    label: 'Admin',
    type: 'single',
  },
  {
    id: 'grp-platform',
    icon: 'explore',
    label: 'Platform',
    type: 'group',
    children: [
      { id: 'about',            icon: 'info',        label: 'About EatClub' },
      { id: 'platform-overview',icon: 'web',         label: 'Platform Guide' },

    ],
  },
  {
    id: 'grp-chat',
    icon: 'chat',
    label: 'Chat Operations',
    type: 'group',
    children: [
      { id: 'chat-kpis',    icon: 'bar_chart',    label: 'Chat KPIs' },
      { id: 'chat-flows',   icon: 'account_tree', label: 'Chat Flows' },
      { id: 'hash-library', icon: 'tag',          label: 'Hash Library' },
      { id: 'agent-guide',  icon: 'smart_toy',    label: 'Chat Agent Guide' },
      { id: 'yellow-ai',    icon: 'adb',          label: 'Yellow.ai Inbox' },
    ],
  },
  {
    id: 'grp-call',
    icon: 'call',
    label: 'Call Operations',
    type: 'group',
    children: [
      { id: 'call-kpis',    icon: 'call',         label: 'Call KPIs' },
      { id: 'call-scripts', icon: 'assignment',   label: 'Call Scripts' },
      { id: 'cc-templates', icon: 'content_copy', label: 'CC Templates', isNew: true },
    ],
  },
  {
    id: 'grp-brands',
    icon: 'lunch_dining',
    label: 'Brand Guides',
    type: 'group',
    children: [
      { id: 'box8', icon: 'lunch_dining',  label: 'Box8 Portioning' },
      { id: 'mojo', icon: 'local_pizza',   label: 'Mojo / Lean Crust' },
    ],
  },
  {
    id: 'grp-ops',
    icon: 'support_agent',
    label: 'Operations & SOPs',
    type: 'group',
    children: [
      { id: 'tags',          icon: 'label',    label: 'Complaint Tags' },
      { id: 'resolution',    icon: 'bolt',     label: 'Resolution Flows' },
      { id: 'ratings',       icon: 'star',     label: 'Rating Logic' },
      { id: 'escalation',    icon: 'report',   label: 'Escalation Matrix' },
      { id: 'refunds',       icon: 'payments', label: 'Refunds & Comp.' },
      { id: 'refunds-master',icon: 'table_chart', label: 'Refund Matrix', isNew: true },
    ],
  },
  {
    id: 'grp-tools',
    icon: 'construction',
    label: 'Tools & Training',
    type: 'group',
    children: [
      { id: 'cheat-sheet', icon: 'push_pin', label: 'Cheat Sheet' },
      { id: 'quiz',        icon: 'quiz',     label: 'Knowledge Quiz' },
    ],
  },
];

const PAGE_TITLES = {
  'dashboard': 'Dashboard',
  'notices': 'Notice Board',
  'admin': 'Admin Dashboard',
  'home': 'Home',
  'about': 'About EatClub',
  'chat-kpis': 'Chat KPIs',
  'chat-flows': 'Chat Flows',
  'hash-library': 'Hash Library',
  'agent-guide': 'Agent Guide',
  'call-kpis': 'Call KPIs',
  'call-scripts': 'Call Scripts',
  'cc-templates': 'CC Templates — Copy-Ready Scripts',
  'box8': 'Box8 Portioning',
  'mojo': 'Mojo / Lean Crust',
  'tags': 'Complaint Tags',
  'resolution': 'Resolution Flows',
  'ratings': 'Rating Logic',
  'escalation': 'Escalation Matrix',
  'refunds': 'Refunds & Compensation',
  'refunds-master': 'Refund Master Sheet',
  'yellow-ai': 'Yellow.ai Inbox',
  'cheat-sheet': 'Cheat Sheet',
  'platform-overview': 'EatClub Platform Guide',

  'quiz': 'Knowledge Quiz',
};

const PAGE_ICONS = {
  'dashboard': 'dashboard', 'notices': 'campaign', 'admin': 'shield', 'home': 'home', 'about': 'info', 'chat-kpis': 'bar_chart', 'chat-flows': 'account_tree',
  'hash-library': 'tag', 'agent-guide': 'smart_toy', 'call-kpis': 'call',
  'call-scripts': 'assignment', 'cc-templates': 'content_copy', 'box8': 'lunch_dining',
  'mojo': 'local_pizza', 'tags': 'label', 'resolution': 'bolt', 'ratings': 'star',
  'escalation': 'report', 'refunds': 'payments', 'refunds-master': 'table_chart',
  'yellow-ai': 'adb', 'cheat-sheet': 'push_pin', 'platform-overview': 'web',
  'quiz': 'quiz',
};

function renderPage(page, navigate, user, userProfile, onUpdateProfile, onLogout, xp, streak, completedModules) {
  switch (page) {
    case 'admin': return <AdminDashboard user={user} />;
    case 'notices': return <NoticeBoardPage user={user} />;
    case 'dashboard': return <UserDashboard user={user} userProfile={userProfile} onUpdateProfile={onUpdateProfile} onLogout={onLogout} xp={xp} streak={streak} completedModules={completedModules} />;
    case 'home': return <Home navigate={navigate} />;
    case 'about': return <About />;
    case 'chat-kpis': return <ChatKPIs />;
    case 'chat-flows': return <ChatFlows />;
    case 'hash-library': return <HashLibrary />;
    case 'agent-guide': return <AgentGuide />;
    case 'call-kpis': return <CallKPIs />;
    case 'call-scripts': return <CallScripts />;
    case 'cc-templates': return <CCTemplates />;
    case 'box8': return <Box8 />;
    case 'mojo': return <MojoPortioning />;
    case 'tags': return <Tags />;
    case 'resolution': return <Resolution />;
    case 'ratings': return <Ratings navigate={navigate} />;
    case 'escalation': return <Escalation />;
    case 'refunds': return <Refunds navigate={navigate} />;
    case 'refunds-master': return <RefundsMaster navigate={navigate} />;
    case 'yellow-ai': return <YellowAI />;
    case 'cheat-sheet': return <CheatSheet />;
    case 'platform-overview': return <PlatformOverview />;
    case 'quiz': return <Quiz />;
    default: return <Home navigate={navigate} />;
  }
}

const BG_THEMES = [
  { id: 'light', name: 'Light', icon: '☀️', desc: 'Clean white surface' },
  { id: 'dark', name: 'Dark', icon: '🌙', desc: 'Deep dark background' },
  { id: 'dim', name: 'Dim', icon: '🌓', desc: 'Soft dark, easy on eyes' },
];

const APP_THEME_COLORS = [
  { id: 'orange',   p: '#FF5722', rgb: '255, 87, 34',   pc: '#FFDBCF', opc: '#3E0B00', category: 'Dynamic' },
  { id: 'pink',     p: '#E91E63', rgb: '233, 30, 99',   pc: '#F8BBD0', opc: '#3A0019', category: 'Dynamic' },
  { id: 'sky',      p: '#00BCD4', rgb: '0, 188, 212',   pc: '#B2EBF2', opc: '#002124', category: 'Dynamic' },
  { id: 'gold',     p: '#FFD700', rgb: '255, 215, 0',   pc: '#FFF9C4', opc: '#332B00', category: 'Dynamic' },
  { id: 'blue',     p: '#2196F3', rgb: '33, 150, 243',  pc: '#BBDEFB', opc: '#001E31', category: 'Simple' },
  { id: 'green',    p: '#4CAF50', rgb: '76, 175, 80',   pc: '#C8E6C9', opc: '#002105', category: 'Simple' },
  { id: 'slate',    p: '#607D8B', rgb: '96, 125, 139',  pc: '#CFD8DC', opc: '#12191C', category: 'Simple' },
  { id: 'indigo',   p: '#3F51B5', rgb: '63, 81, 181',   pc: '#C5CAE9', opc: '#0D1137', category: 'Pro' },
  { id: 'forest',   p: '#1B5E20', rgb: '27, 94, 32',    pc: '#C8E6C9', opc: '#001A03', category: 'Pro' },
  { id: 'midnight', p: '#121212', rgb: '18, 18, 18',    pc: '#2C2C2C', opc: '#FFFFFF', category: 'Pro' },
];

// Font options
const FONT_OPTIONS = [
  { id: 'default', name: 'Default (System)', family: '-apple-system, BlinkMacSystemFont, sans-serif' },
  { id: 'poppins', name: 'Poppins', family: "'Poppins', sans-serif" },
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif" },
  { id: 'open-sans', name: 'Open Sans', family: "'Open Sans', sans-serif" },
  { id: 'roboto', name: 'Roboto', family: "'Roboto', sans-serif" },
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif" },
  { id: 'montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { id: 'lato', name: 'Lato', family: "'Lato', sans-serif" },
];

// Animation speed options
const ANIMATION_SPEEDS = [
  { id: 'slow', name: 'Slow', multiplier: 1.5 },
  { id: 'normal', name: 'Normal', multiplier: 1 },
  { id: 'fast', name: 'Fast', multiplier: 0.7 },
  { id: 'instant', name: 'Instant', multiplier: 0 },
];

// Helper: find which group a page belongs to
function findPageGroup(pageId) {
  for (const grp of NAV_GROUPS) {
    if (grp.type === 'group' && grp.children.some(c => c.id === pageId)) {
      return grp.id;
    }
  }
  return null;
}

// Helper: get breadcrumb info for a page
function getBreadcrumb(pageId) {
  if (pageId === 'home') return { group: null, item: 'Home', icon: 'home' };
  for (const group of NAV_GROUPS) {
    if (group.type === 'group' && group.children) {
      const child = group.children.find(c => c.id === pageId);
      if (child) return { group: group.label, item: child.label, icon: child.icon || PAGE_ICONS[pageId] };
    } else if (group.type === 'single' && group.id === pageId) {
      return { group: null, item: group.label, icon: group.icon || PAGE_ICONS[pageId] };
    }
  }
  return { group: null, item: PAGE_TITLES[pageId] || pageId, icon: PAGE_ICONS[pageId] || 'article' };
}

export default function App() {
  // ── PERSISTENT STATE (survives refresh/reopen) ──────────────────────────
  const [page, setPage] = useLocalStorage('ec_page', 'home');

  const [bgTheme, setBgTheme] = useLocalStorage('ec_bg_theme', 'light');
  const [activeTheme, setActiveTheme] = useLocalStorage('ec_theme', 'sky');
  const [recentColors, setRecentColors] = useLocalStorage('ec_recent_colors', []);
  const [activeFont, setActiveFont] = useLocalStorage('ec_font', 'default');
  const [animSpeed, setAnimSpeed] = useLocalStorage('ec_anim_speed', 'normal');
  const [openGroups, setOpenGroups] = useLocalStorageSet(
    'ec_open_groups',
    new Set([findPageGroup('home')].filter(Boolean))
  );

  // ── XP / STREAK / COMPLETED MODULES ──
  const [xp, setXp] = useLocalStorage('ec_xp', 0);
  const [streak, setStreak] = useLocalStorage('ec_streak', 0);
  const [lastVisitDate, setLastVisitDate] = useLocalStorage('ec_last_visit', '');
  const [completedModules, setCompletedModules] = useLocalStorage('ec_completed_modules', []);
  const [bookmarkedModules, setBookmarkedModules] = useLocalStorage('ec_bookmarked_modules', []);

  const [dailyXpDate, setDailyXpDate] = useLocalStorage('ec_daily_xp', '');
  const [dailyXpMessage, setDailyXpMessage] = useState(null);

  // Track daily visit for streak + award daily login XP
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastVisitDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastVisitDate === yesterday) {
        setStreak(prev => prev + 1);
      } else if (lastVisitDate && lastVisitDate !== today) {
        setStreak(1);
      } else if (!lastVisitDate) {
        setStreak(1);
      }
      setLastVisitDate(today);

      // Award daily login XP (once per calendar day)
      const uid = googleUser?.uid || localStorage.getItem('eatclub_uid');
      if (dailyXpDate !== today && uid) {
        const dailyBonus = 3;
        const currentXp = parseInt(localStorage.getItem('ec_xp') || '0');
        const newXp = currentXp + dailyBonus;
        setXp(newXp);
        setDailyXpDate(today);
        setDailyXpMessage(`+${dailyBonus} XP Daily Login`);
        setTimeout(() => setDailyXpMessage(null), 4000);
        // Sync to Firebase leaderboard
        const name = googleUser?.displayName || localStorage.getItem('eatclub_agent_name') || '';
        const email = googleUser?.email || localStorage.getItem('eatclub_agent_email') || '';
        const photoURL = googleUser?.photoURL || '';
        const role = localStorage.getItem('eatclub_role') || '';
        const completedList = JSON.parse(localStorage.getItem('ec_completed_modules') || '[]');
        const completedCount = Array.isArray(completedList) ? completedList.length : 0;
        set(dbRef(db, 'leaderboard/' + uid), {
          name, email, photoURL, role, points: newXp,
          completedCount, lastActive: Date.now()
        }).catch(() => null);
      }
    }
  }, []);

  const handleModuleComplete = (moduleId, moduleName) => {
    const newXp = (parseInt(localStorage.getItem('ec_xp') || '0')) + 25;
    setXp(newXp);
    setCompletedModules(prev => {
      if (prev.find(m => m.id === moduleId || m === moduleId)) return prev;
      return [...prev, { id: moduleId, name: moduleName, completedAt: Date.now() }];
    });
    // Save last session
    const session = JSON.parse(localStorage.getItem('eatclub_last_session') || '{}');
    session.time = Date.now();
    session.modules = [...new Set([...(session.modules||[]), moduleName])];
    session.xpGained = (session.xpGained||0) + 25;
    localStorage.setItem('eatclub_last_session', JSON.stringify(session));
    // Sync XP + completed count to Firebase leaderboard
    const uid = googleUser?.uid || localStorage.getItem('eatclub_uid');
    if (uid) {
      const name = googleUser?.displayName || localStorage.getItem('eatclub_agent_name') || '';
      const email = googleUser?.email || localStorage.getItem('eatclub_agent_email') || '';
      const photoURL = googleUser?.photoURL || '';
      const role = localStorage.getItem('eatclub_role') || '';
      const completedList = JSON.parse(localStorage.getItem('ec_completed_modules') || '[]');
      const completedCount = Array.isArray(completedList) ? completedList.length : 0;
      const lastActive = Date.now();
      set(dbRef(db, 'leaderboard/' + uid), {
        name, email, photoURL, role, points: newXp,
        completedCount, lastActive
      }).catch(() => null);
    }
  };

  const handleToggleBookmark = (moduleId) => {
    setBookmarkedModules(prev => {
      if (prev.includes(moduleId)) return prev.filter(m => m !== moduleId);
      return [...prev, moduleId];
    });
  };

  const MODULE_PAGE_IDS = ['about','platform-overview','chat-kpis','chat-flows','hash-library','agent-guide','call-kpis','call-scripts','cc-templates','box8','mojo','tags','resolution','ratings','escalation','refunds','refunds-master','yellow-ai','cheat-sheet','quiz'];

  // ── NON-PERSISTENT STATE ─────────────────────────────────────────────
  const [partyMode, setPartyMode] = useState(false);
  const [showContactCard, setShowContactCard] = useState(false);
  const [showActiveMembers, setShowActiveMembers] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);
  const [activeMembersList, setActiveMembersList] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [dmTarget, setDmTarget] = useState(null);
  const [chatTab, setChatTab] = useState('team');
  const [userConversations, setUserConversations] = useState([]);

  useEffect(() => {
    if (showChat) setUnreadCount(0);
  }, [showChat]);

  useEffect(() => {
    const memberId = localStorage.getItem('eatclub_member_id');
    if (memberId) {
      return listenUserConversations(memberId, setUserConversations);
    }
  }, []);

  const [showProfilePanel, setShowProfilePanel] = useState(false);

  const toggleGroup = (grpId) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(grpId)) next.delete(grpId);
      else next.add(grpId);
      return next;
    });
  };

  // ── AUTH EXPIRY LOGIC ──
  const checkAuthExpiry = () => {
    return !!localStorage.getItem('eatclub_google_user');
  };

  const [isAuthorized, setIsAuthorized] = useState(checkAuthExpiry());
  const [showWelcome, setShowWelcome] = useState(true);

  // ── GOOGLE AUTH STATE ──
  const [googleUser, setGoogleUser] = useState(() => {
    const saved = localStorage.getItem('eatclub_google_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [userProfile, setUserProfile] = useState(() => ({
    bio: localStorage.getItem('eatclub_bio') || '',
    role: localStorage.getItem('eatclub_role') || '',
  }));
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem('eatclub_role') || '');
  const [userIsAdmin, setUserIsAdmin] = useState(localStorage.getItem('eatclub_is_admin') === 'true');

  const handleGoogleLogin = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userData = {
        uid: user.uid,
        displayName: user.displayName || user.email.split('@')[0] || 'User',
        email: user.email,
        photoURL: user.photoURL,
      };
      localStorage.setItem('eatclub_google_user', JSON.stringify(userData));
      localStorage.setItem('eatclub_uid', user.uid);
      localStorage.setItem('eatclub_agent_name', userData.displayName);
      localStorage.setItem('eatclub_agent_email', userData.email);
      setGoogleUser(userData);
      setIsAuthorized(true);

      // Check if user has existing profile
      const existingBio = localStorage.getItem('eatclub_bio');
      const existingRole = localStorage.getItem('eatclub_role');
      const savedProfile = localStorage.getItem('eatclub_profile_complete');
      if (savedProfile && (existingBio || existingRole)) {
        setUserProfile({ bio: existingBio || '', role: existingRole || '' });
      } else {
        setShowProfileSetup(true);
      }

      // Also try to update presence with Google user data
      const memberId = localStorage.getItem('eatclub_member_id');
      if (memberId) {
        set(dbRef(db, 'presence/' + memberId), {
          id: memberId, name: userData.displayName, status: 'online', lastSeen: Date.now(), joinedAt: Date.now(),
          location: 'Fetching...', browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other',
          os: navigator.platform, currentPage: 'home', isMe: true,
          bio: existingBio || '', role: existingRole || '', email: userData.email,
          photoURL: userData.photoURL || ''
        }).catch(() => null);
      }

      // Save user profile to Firebase (for leaderboard & profile sync)
      if (userData.uid) {
        const autoRole = MAIN_ADMIN_EMAILS.includes(userData.email) ? 'Admin' : (existingRole || '');
        set(dbRef(db, 'users/' + userData.uid), {
          name: userData.displayName,
          email: userData.email,
          photoURL: userData.photoURL || '',
          bio: existingBio || '',
          role: autoRole,
          lastLogin: Date.now()
        }).catch(() => null);
        // Seed leaderboard entry
        set(dbRef(db, 'leaderboard/' + userData.uid), {
          name: userData.displayName,
          email: userData.email,
          photoURL: userData.photoURL || '',
          role: autoRole,
          points: 0,
          completedCount: 0,
          lastActive: Date.now()
        }).catch(() => null);
        if (autoRole === 'Admin') {
          localStorage.setItem('eatclub_role', 'Admin');
          setUserRole('Admin');
        }
      }
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const stored = localStorage.getItem('eatclub_google_user');
        if (!stored) {
          const userData = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          };
          localStorage.setItem('eatclub_google_user', JSON.stringify(userData));
          localStorage.setItem('eatclub_uid', firebaseUser.uid);
          localStorage.setItem('eatclub_agent_name', userData.displayName);
          localStorage.setItem('eatclub_agent_email', userData.email);
          setGoogleUser(userData);
        }
        setIsAuthorized(true);
      }
    });
    return () => unsub();
  }, []);

  // Sync role & isAdmin from Firebase
  useEffect(() => {
    const uid = googleUser?.uid || localStorage.getItem('eatclub_uid');
    if (!uid) return;
    const email = googleUser?.email || localStorage.getItem('eatclub_agent_email') || '';

    const userRef = dbRef(db, 'users/' + uid);
    const unsub = onValue(userRef, (snap) => {
      const data = snap.val();
      if (!data) return;

      const role = data.role || '';
      const isAdmin = data.isAdmin === true;

      setUserRole(role);
      localStorage.setItem('eatclub_role', role);

      setUserIsAdmin(isAdmin);
      localStorage.setItem('eatclub_is_admin', isAdmin ? 'true' : 'false');
    });
    return () => unsub();
  }, [googleUser?.uid]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    localStorage.removeItem('eatclub_google_user');
    localStorage.removeItem('eatclub_uid');
    localStorage.removeItem('eatclub_agent_email');
    setGoogleUser(null);
    setUserProfile({ bio: '', role: '' });
    setIsAuthorized(false);
  };

  const handleUpdateProfile = (profile) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
    if (profile.bio) localStorage.setItem('eatclub_bio', profile.bio);
    if (profile.role) localStorage.setItem('eatclub_role', profile.role);
  };

  const handleProfileSetupComplete = (profile) => {
    handleUpdateProfile(profile);
    setShowProfileSetup(false);
  };

  const handleProfileSetupSkip = () => {
    setShowProfileSetup(false);
  };

  const chatClientRef = useRef(null);
  const initialized = useRef(false);
  const [toasts, setToasts] = useState([]);
  const showChatRef = useRef(showChat);
  const initialLoad = useRef(true);

  useEffect(() => { showChatRef.current = showChat; }, [showChat]);

  const addToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, ...msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let memberId = localStorage.getItem('eatclub_member_id');
    if (!memberId) {
      memberId = 'member_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      localStorage.setItem('eatclub_member_id', memberId);
    }

    const sessionStartTime = Date.now();
    let locationData = 'Fetching...';

    const getAgentDetails = (st = 'online') => {
      const currentName = localStorage.getItem('eatclub_agent_name') || 'Local User';
      const currentBio = localStorage.getItem('eatclub_bio') || '';
      const currentRole = localStorage.getItem('eatclub_role') || '';
      const currentEmail = localStorage.getItem('eatclub_agent_email') || '';
      return {
        id: memberId, name: currentName, status: st, lastSeen: Date.now(), joinedAt: Date.now(),
        location: locationData, browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other',
        os: navigator.platform, currentPage: page, isMe: true,
        bio: currentBio, role: currentRole, email: currentEmail
      };
    };

    // --- 1. LOCAL BROADCAST FALLBACK ---
    const channel = new BroadcastChannel('eatclub_team_hub');

    const updateLocalPresence = (status = 'online') => {
      const me = getAgentDetails(status);
      const stored = JSON.parse(localStorage.getItem('ec_local_users') || '[]');
      const filtered = stored.filter(u => u.id !== memberId && (Date.now() - u.lastSeen < 2 * 60 * 60 * 1000));
      const freshList = [...filtered, me];
      localStorage.setItem('ec_local_users', JSON.stringify(freshList));
      setActiveMembersList(freshList.map(u => ({ ...u, isMe: u.id === memberId })));
      channel.postMessage({ type: 'presence', user: me });
    };

    channel.onmessage = (e) => {
      if (e.data.type === 'chat') {
        const msg = e.data.payload;
        const currentName = localStorage.getItem('eatclub_agent_name') || 'Local User';
        if (msg.timestamp >= sessionStartTime && msg.user !== currentName) {
          if (!showChatRef.current) addToast({ title: msg.user, text: msg.text });
        }
        setChatMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, msg].sort((a,b) => a.timestamp - b.timestamp).slice(-100);
        });
      }
      if (e.data.type === 'presence') {
        const stored = JSON.parse(localStorage.getItem('ec_local_users') || '[]');
        setActiveMembersList(stored.map(u => ({ ...u, isMe: u.id === memberId })));
      }
    };

    // Load initial local data
    const localMsgs = JSON.parse(localStorage.getItem('ec_local_msgs') || '[]');
    setChatMessages(localMsgs);
    updateLocalPresence('online');
    initialLoad.current = false;

    // --- 2. FIREBASE REALTIME DATABASE ---
    const presenceRef = dbRef(db, 'presence/' + memberId);
    const chatsRef = dbRef(db, 'chats');
    const connectedRef = dbRef(db, '.info/connected');

    // Attempt Anonymous Auth
    signInAnonymously(auth)
      .then(() => {
        console.log("Authenticated anonymously with Firebase");
      })
      .catch((error) => {
        console.warn("Anonymous auth failed (likely disabled), proceeding without auth:", error.message);
      });

    onValue(connectedRef, (snap) => {

      if (snap.val() === true) {
        onDisconnect(presenceRef).remove().catch(() => null);
        set(presenceRef, getAgentDetails('online')).catch(() => null);
      }
    }, (err) => console.error("Presence connection error:", err));

    const unsubscribePresence = onValue(dbRef(db, 'presence'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const users = Object.entries(data).map(([id, val]) => ({
          ...val,
          id,
          isMe: id === memberId
        }));
        setActiveMembersList(users);
      }
    }, (err) => console.error("Presence sync error:", err));

    const unsubscribeChat = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const nowMs = Date.now();
        const msgs = Object.entries(data)
          .map(([fbId, val]) => ({ fbId, ...val }))
          .filter(m => m.pinned || (nowMs - (m.timestamp || 0) < 24 * 60 * 60 * 1000))
          .sort((a, b) => a.timestamp - b.timestamp);
        const lastMsg = msgs[msgs.length - 1];
        
        const currentName = localStorage.getItem('eatclub_agent_name') || 'Local User';
        const myId = localStorage.getItem('eatclub_member_id');
        if (lastMsg && lastMsg.timestamp >= sessionStartTime && !initialLoad.current) {
          const isOwn = lastMsg.userId === myId || lastMsg.user === currentName;
          if (!isOwn && !showChatRef.current) {
            setUnreadCount(prev => prev + 1);
            addToast({ title: lastMsg.user, text: lastMsg.text });
          }
        }
        setChatMessages(msgs.slice(-100));
        localStorage.setItem('ec_local_msgs', JSON.stringify(msgs.slice(-100)));
      } else {
        setChatMessages([]);
        localStorage.removeItem('ec_local_msgs');
      }
    }, (err) => console.error("Chat sync error:", err));

    // Removed visibilitychange listener to keep user 'online' while tab is open

    // Fetch IP location exactly once
    fetch('https://ipapi.co/json/').then(res => res.json()).then(data => {
      if (data && data.city) {
        locationData = `${data.city}, ${data.country_name || ''}`;
        updateLocalPresence('online');
        set(presenceRef, getAgentDetails('online')).catch(() => null);
      }
    }).catch(() => null);

    // Save refs for sendMessage
    chatClientRef.current = { channel, memberId };

    return () => {
      channel.close();
      unsubscribePresence();
      unsubscribeChat();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Firebase presence when page changes
  useEffect(() => {
    const memberId = chatClientRef.current?.memberId || localStorage.getItem('eatclub_member_id');
    if (!memberId) return;
    const currentName = localStorage.getItem('eatclub_agent_name') || 'Local User';
    const currentBio = localStorage.getItem('eatclub_bio') || '';
    const currentRole = localStorage.getItem('eatclub_role') || '';
    const currentEmail = localStorage.getItem('eatclub_agent_email') || '';
    const location = 'Fetching...';
    set(dbRef(db, 'presence/' + memberId), {
      id: memberId, name: currentName, status: 'online', lastSeen: Date.now(), joinedAt: Date.now(),
      location, browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other',
      os: navigator.platform, currentPage: page, isMe: true,
      bio: currentBio, role: currentRole, email: currentEmail
    }).catch(() => null);
  }, [page]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const currentUser = activeMembersList.find(a => a.isMe);
    const userName = currentUser ? currentUser.name : (localStorage.getItem('eatclub_agent_name') || 'You');
    const memberId = chatClientRef.current?.memberId || localStorage.getItem('eatclub_member_id') || '';
    const msg = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      user: userName, userId: memberId, text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };
    
    // Save locally
    setChatMessages(prev => {
       const next = [...prev, msg].slice(-100);
       localStorage.setItem('ec_local_msgs', JSON.stringify(next));
       return next;
    });
    setNewMessage('');

    // Broadcast
    const { channel } = chatClientRef.current || {};
    if (channel) channel.postMessage({ type: 'chat', payload: msg });
    push(dbRef(db, 'chats'), msg).catch((err) => {
      console.error("Failed to send message:", err);
      addToast({ title: 'Error', text: 'Failed to send message. Check permissions.' });
    });
  };



  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    localStorage.setItem('ec_welcome_shown_for', Date.now().toString());
  };

  const getUserColor = (name) => {
    if (!name) return 'var(--md-primary)';
    const colors = ['#FF5722','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50','#8BC34A','#CDDC39','#FFC107','#FF9800','#795548'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const formatRelativeTime = (ts) => {
    if (!ts) return '';
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'yesterday';
    return `${days}d ago`;
  };

  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (showChat && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, showChat]);

  const changeThemeColor = (t) => {
    setActiveTheme(t.id);
    const root = document.documentElement;
    root.style.setProperty('--md-primary', t.p);
    root.style.setProperty('--md-primary-rgb', t.rgb);
    root.style.setProperty('--md-primary-container', t.pc);
    root.style.setProperty('--md-on-primary-cont', t.opc);

    // Track recent colors (keep last 5)
    setRecentColors(prev => {
      const filtered = prev.filter(c => c.id !== t.id);
      return [t, ...filtered].slice(0, 5);
    });
  };

  // Change font
  const changeFont = (font) => {
    setActiveFont(font.id);
    const fontObj = FONT_OPTIONS.find(f => f.id === font.id);
    if (fontObj) {
      document.body.style.fontFamily = fontObj.family;
    }
  };

  // Change animation speed
  const changeAnimSpeed = (speed) => {
    setAnimSpeed(speed.id);
    document.documentElement.style.setProperty('--anim-multiplier', speed.multiplier);
  };

  // ── RESTORE THEME ON EVERY MOUNT ──────────────────────────────────────
  useEffect(() => {
    applyBgTheme(bgTheme);
    // Restore theme color CSS variables
    const t = APP_THEME_COLORS.find(c => c.id === activeTheme);
    if (t) {
      const root = document.documentElement;
      root.style.setProperty('--md-primary', t.p);
      root.style.setProperty('--md-primary-rgb', t.rgb);
      root.style.setProperty('--md-primary-container', t.pc);
      root.style.setProperty('--md-on-primary-cont', t.opc);
    }

    // Restore font
    const fontObj = FONT_OPTIONS.find(f => f.id === activeFont);
    if (fontObj) {
      document.body.style.fontFamily = fontObj.family;
    }

    // Restore animation speed
    const speedObj = ANIMATION_SPEEDS.find(s => s.id === animSpeed);
    if (speedObj) {
      document.documentElement.style.setProperty('--anim-multiplier', speedObj.multiplier);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount — values come from persisted localStorage

  // ── KEEP BG THEME IN SYNC WHEN CHANGED ────────────────────────────────
  useEffect(() => {
    applyBgTheme(bgTheme);
  }, [bgTheme]);


  const activatePartyMode = () => {

    if (partyMode) return;
    setPartyMode(true);
    const container = document.createElement('div');
    container.className = 'party-particles-container';
    document.body.appendChild(container);
    const elements = ['❤️','🌺','🌸','💖','🌼','🌷','✨','💐'];
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'party-particle';
      particle.innerText = elements[Math.floor(Math.random() * elements.length)];
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
      particle.style.animationDelay = Math.random() * 0.5 + 's';
      particle.style.fontSize = (Math.random() * 20 + 20) + 'px';
      container.appendChild(particle);
    }
    setTimeout(() => {
      setPartyMode(false);
      if (container.parentNode) container.parentNode.removeChild(container);
    }, 5000);
  };

  const applyBgTheme = (id) => {
    const root = document.documentElement;
    // Remove all bg-theme classes
    document.body.classList.remove('light-theme', 'dark-theme', 'dim-theme');
    if (id === 'light') {
      document.body.classList.add('light-theme');
      root.style.removeProperty('--md-background');
      root.style.removeProperty('--md-surface');
      root.style.removeProperty('--md-surface-variant');
      root.style.removeProperty('--md-on-surface');
      root.style.removeProperty('--md-on-surface-var');
    } else if (id === 'dark') {
      document.body.classList.add('dark-theme');
      root.style.removeProperty('--md-background');
      root.style.removeProperty('--md-surface');
      root.style.removeProperty('--md-surface-variant');
      root.style.removeProperty('--md-on-surface');
      root.style.removeProperty('--md-on-surface-var');
    } else if (id === 'dim') {
      document.body.classList.add('dim-theme');
      root.style.setProperty('--md-background', '#13132B');
      root.style.setProperty('--md-surface', '#1A1A3E');
      root.style.setProperty('--md-surface-variant', '#25255A');
      root.style.setProperty('--md-on-surface', '#E8E8F4');
      root.style.setProperty('--md-on-surface-var', '#C0C0E0');
    }
  };

  const changeBgTheme = (id) => {
    setBgTheme(id);
    applyBgTheme(id);
  };

  const navigate = (id) => {
    setPage(id);
    // Auto-open the group this page belongs to
    const grpId = findPageGroup(id);
    if (grpId) {
      setOpenGroups(prev => {
        const next = new Set(prev);
        next.add(grpId);
        return next;
      });
    }
  };

  const socialLinks = [
    { label: 'YouTube',   url: 'https://www.youtube.com/c/creespygaming',           icon: (<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>), color: '#FF0000', bg: 'rgba(255,0,0,0.12)' },
    { label: 'Spotify',   url: 'https://open.spotify.com/user/axpldv8o0jtjfbvlbckp4gn0o', icon: (<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>), color: '#1DB954', bg: 'rgba(29,185,84,0.12)' },
    { label: 'Instagram', url: 'https://www.instagram.com/_ig_creespy_/',            icon: (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>), color: '#E1306C', bg: 'rgba(225,48,108,0.12)' },
    { label: 'GitHub',    url: 'https://github.com/CREESPYG',                        icon: (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>), color: '#6e7681', bg: 'rgba(110,118,129,0.12)' },
    { label: 'LinkedIn',  url: 'https://www.linkedin.com/in/arif-ansari-a9586810a/', icon: (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>), color: '#0A66C2', bg: 'rgba(10,102,194,0.12)' },
  ];


  // ── ADMIN ROUTE GUARD ──
  const adminUser = { email: googleUser?.email || localStorage.getItem('eatclub_agent_email'), isAdmin: userIsAdmin };
  useEffect(() => {
    if (page === 'admin' && !isAdminRole(adminUser)) {
      setPage('home');
    }
  }, [page, adminUser.email, adminUser.isAdmin, setPage]);

  // ── WELCOME ANIMATION ──
  if (showWelcome) {
    return <WelcomeAnimation onComplete={handleWelcomeComplete} />;
  }

  // ── LOGIN PAGE (Dynamic EatClub Entry) ──
  if (!isAuthorized) {
    return <EntryPage onGoogleLogin={handleGoogleLogin} />;
  }

  // ── PROFILE SETUP OVERLAY (after Google login) ──
  if (showProfileSetup && googleUser) {
    return <ProfileSetup user={googleUser} onComplete={handleProfileSetupComplete} onSkip={handleProfileSetupSkip} />;
  }

  return (
    <div className="app-shell">

      {/* ══════ NOTIFICATION TOASTS — Premium ══════ */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map(t => (
          <div key={t.id} className="toast-notification" onClick={() => setShowChat(true)}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(var(--md-primary-rgb), 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)', fontSize: 18 }}>chat</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--md-on-surface)' }}>{t.title}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--md-on-surface-var)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ══════ CONTACT CARD MODAL ══════ */}
      {showContactCard && (
        <div className="contact-modal-overlay" onClick={() => setShowContactCard(false)}>
          <div className="contact-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, borderRadius: 28, overflow: 'hidden', padding: 0, border: 'none', background: 'var(--md-surface)' }}>

            {/* Close btn */}
            <button className="contact-close-btn" onClick={() => setShowContactCard(false)} title="Close"
              style={{ position: 'absolute', top: 14, right: 14, zIndex: 10, background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
            </button>

            {/* Cover / hero */}
            <div style={{ position: 'relative', height: 140, background: 'var(--md-surface-variant)', overflow: 'hidden' }}>
              <img src="/creespy-cover.jpg" alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Subtle dark gradient to make text readable */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
              {/* Decorative circles */}
              <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
              <div style={{ position: 'absolute', bottom: -40, left: -20, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ position: 'absolute', bottom: 8, left: 20, fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: 2, textTransform: 'uppercase' }}>@CREESPY</div>
            </div>

            {/* Name & title */}
            <div style={{ textAlign: 'center', padding: '24px 24px 0' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--md-on-surface)', letterSpacing: '-0.3px' }}>MD ARIF ANSARI</div>
              <div style={{ fontSize: 13, color: 'var(--md-primary)', fontWeight: 700, marginTop: 2 }}>Chat Executive · EatClub CC</div>
            </div>

            {/* Stats strip */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, padding: '14px 24px', margin: '12px 20px', background: 'var(--md-surface-variant)', borderRadius: 16 }}>
              {[
                { icon: 'badge', label: 'Role', val: 'Chat Exec' },
                { icon: 'calendar_month', label: 'Since', val: 'Jul 2019' },
                { icon: 'location_on', label: 'City', val: 'Dhanbad' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--md-primary)', display: 'block', marginBottom: 2 }}>{s.icon}</span>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--md-on-surface)' }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: 'var(--md-on-surface-var)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div style={{ padding: '0 20px 8px' }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: 'var(--md-on-surface-var)', marginBottom: 10, textAlign: 'center', textTransform: 'uppercase' }}>Connect with Me</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {socialLinks.map(s => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 14, background: s.bg, border: `1px solid ${s.color}25`, textDecoration: 'none', transition: 'all 0.2s', color: s.color }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${s.color}30`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                    <span style={{ color: s.color, display: 'flex', flexShrink: 0 }}>{s.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{s.label}</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 13, marginLeft: 'auto', opacity: 0.5 }}>open_in_new</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', padding: '12px 20px 20px', fontSize: 11, color: 'var(--md-on-surface-var)' }}>
              ✨ Built with ❤️ for the <strong style={{ color: 'var(--md-primary)' }}>EatClub CC Team</strong>
            </div>
          </div>
        </div>
      )}

      {/* ══════ SIDEBAR NAV ══════ */}
      <nav className="nav-rail" aria-label="Main Navigation">

        {/* Brand */}
        <div className="nav-brand">
          <div className="nav-logo" style={{ padding: 0, overflow: 'hidden', background: 'transparent', width: 48, height: 38 }}>
            <img src="/logo.png" alt="EatClub Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="nav-brand-text">
            <h2><DynamicTitle text="EatClub CC" /></h2>
            <span>Training Portal</span>
          </div>
        </div>

        {/* Fixed top nav items (never scroll) */}
        <div className="nav-dashboard-fixed">
          {NAV_GROUPS.slice(0, 3).map(item => {
            if (item.type === 'single') {
              if (item.id === 'admin' && !isAdminRole(adminUser)) {
                return null;
              }
              return (
                <button
                  key={item.id}
                  className={`nav-item ${page === item.id ? 'active' : ''}`}
                  onClick={() => navigate(item.id)}
                  title={item.label}
                  aria-current={page === item.id ? 'page' : undefined}
                >
                  <span className="nav-icon material-symbols-outlined">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              );
            }
            return null;
          })}
        </div>

        {/* Nav Items (scrollable) */}
        <div className="nav-items-scroll">
          {NAV_GROUPS.slice(3).map(grp => {
            if (grp.type === 'single') {
              if (grp.id === 'admin' && !isAdminRole(adminUser)) return null;
              return (
                <button
                  key={grp.id}
                  className={`nav-item ${page === grp.id ? 'active' : ''}`}
                  onClick={() => navigate(grp.id)}
                  title={grp.label}
                  aria-current={page === grp.id ? 'page' : undefined}
                >
                  <span className="nav-icon material-symbols-outlined">{grp.icon}</span>
                  <span className="nav-label">{grp.label}</span>
                </button>
              );
            }

            // Group type – accordion
            const isOpen = openGroups.has(grp.id);
            const hasActivePage = grp.children.some(c => c.id === page);

            return (
              <div key={grp.id} className="nav-group">
                {/* Group Header */}
                <button
                  className={`nav-group-header ${hasActivePage ? 'has-active' : ''} ${isOpen ? 'open' : ''}`}
                  onClick={() => toggleGroup(grp.id)}
                  title={grp.label}
                  aria-expanded={isOpen}
                >
                  <span className="nav-icon material-symbols-outlined">{grp.icon}</span>
                  <span className="nav-label">{grp.label}</span>
                  <span className="nav-chevron material-symbols-outlined">
                    {isOpen ? 'expand_less' : 'expand_more'}
                  </span>
                  {hasActivePage && !isOpen && (
                    <span className="nav-active-dot" aria-hidden="true" />
                  )}
                </button>

                {/* Group Children — inner div required for grid-template-rows animation */}
                <div
                  className={`nav-group-children ${isOpen ? 'open' : ''}`}
                  aria-hidden={!isOpen}
                >
                  <div>
                    {grp.children.map(child => (
                      <button
                        key={child.id}
                        className={`nav-child-item ${page === child.id ? 'active' : ''}`}
                        onClick={() => navigate(child.id)}
                        title={child.label}
                        aria-current={page === child.id ? 'page' : undefined}
                      >
                        <span className="nav-child-icon material-symbols-outlined">{child.icon}</span>
                        <span className="nav-label">{child.label}</span>
                        {child.isNew && <span className="nav-new-badge">NEW</span>}
                        {child.isFeatured && <span className="nav-hot-badge">⚡</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar spacer */}
        <div style={{ height: 4 }} />
      </nav>

      {/* ══════ UNIFIED PROFILE & SETTINGS PANEL ══════ */}
      {showProfilePanel && (
        <>
          <div className="profile-panel-overlay" onClick={() => setShowProfilePanel(false)} aria-hidden="true" />
          <div
            className="profile-panel"
            role="dialog"
            aria-label="Profile and Settings"
            tabIndex={-1}
            onKeyDown={e => { if (e.key === 'Escape') setShowProfilePanel(false); }}
          >
            {/* ── Header ── */}
            <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid var(--md-outline)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
              <span style={{ fontSize:16,fontWeight:900,color:'var(--md-on-surface)' }}>Profile & Settings</span>
              <button onClick={() => setShowProfilePanel(false)} style={{ width:32,height:32,borderRadius:8,border:'none',background:'var(--md-surface-variant)',color:'var(--md-on-surface)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }} aria-label="Close panel">
                <span className="material-symbols-outlined" style={{ fontSize:18 }}>close</span>
              </button>
            </div>

            {/* ── Scrollable content ── */}
            <div style={{ flex:1, overflowY:'auto', padding:'20px' }}>
              {/* ═══ PROFILE ═══ */}
              <div className="panel-section">
                <div className="panel-section-header">Profile</div>
                <div style={{ textAlign:'center', marginBottom:16 }}>
                  <UserAvatar
                    size="2xl"
                    name={localStorage.getItem('eatclub_agent_name') || 'User'}
                    photoURL={googleUser?.photoURL}
                    style={{ margin: '0 auto 12px' }}
                  />
                  <div style={{ fontSize:17,fontWeight:800,color:'var(--md-on-surface)' }}>{localStorage.getItem('eatclub_agent_name') || 'User'}</div>
                  <div style={{ fontSize:12,color:'var(--md-on-surface-var)',marginTop:2 }}>{localStorage.getItem('eatclub_agent_email') || ''}</div>
                  <div style={{ display:'inline-block',marginTop:6,padding:'2px 12px',borderRadius:100,background:'rgba(var(--md-primary-rgb),.1)',color:'var(--md-primary)',fontSize:11,fontWeight:700 }}>{localStorage.getItem('eatclub_role') || 'Member'}</div>
                </div>
                <button onClick={() => { setShowProfilePanel(false); setPage('dashboard'); }}
                  style={{ width:'100%',padding:'10px 16px',borderRadius:10,border:'1px solid var(--md-outline)',background:'var(--md-surface-variant)',color:'var(--md-on-surface)',fontSize:12,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:8,justifyContent:'center',fontFamily:'inherit' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:16 }}>open_in_new</span>
                  Edit Full Profile on Dashboard
                </button>
              </div>

              {/* ═══ THEME ═══ */}
              <div className="panel-section">
                <div className="panel-section-header">Theme</div>

                {/* Background theme */}
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:9,fontWeight:800,color:'var(--md-on-surface-var)',marginBottom:8,letterSpacing:.5 }}>BACKGROUND THEME</div>
                  <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8 }}>
                    {BG_THEMES.map(t => {
                      const active = bgTheme === t.id;
                      const previews = {
                        light: 'linear-gradient(135deg,#e8eaed,#ffffff)',
                        dark: 'linear-gradient(135deg,#1e1e1e,#121212)',
                        dim: 'linear-gradient(135deg,#1A1A3E,#13132B)',
                      };
                      return (
                        <button key={t.id} onClick={() => changeBgTheme(t.id)}
                          style={{
                            padding:'10px 6px',borderRadius:10,cursor:'pointer',fontFamily:'inherit',
                            border: active ? '2px solid var(--md-primary)' : '1px solid var(--md-outline)',
                            background: active ? 'var(--md-primary-container)' : 'var(--md-surface-variant)',
                            transition:'all .15s',textAlign:'center',
                          }}>
                          <div style={{
                            width:'100%',height:40,borderRadius:6,marginBottom:6,
                            background: previews[t.id],
                            border:'1px solid rgba(0,0,0,.08)',
                            display:'flex',alignItems:'center',justifyContent:'center',
                          }}>
                            <span style={{ fontSize:16 }}>{t.icon}</span>
                          </div>
                          <div style={{ fontSize:11,fontWeight:700,color:'var(--md-on-surface)' }}>{t.name}</div>
                          <div style={{ fontSize:8,color:'var(--md-on-surface-var)',marginTop:1 }}>{t.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active color pill */}
                <div style={{ marginBottom:16,padding:'10px 14px',background:'var(--md-surface-variant)',borderRadius:10,display:'flex',alignItems:'center',gap:10 }}>
                  <span style={{ width:16,height:16,borderRadius:'50%',background:(APP_THEME_COLORS.find(t => t.id === activeTheme)?.p || '#00BCD4'),flexShrink:0 }} />
                  <span style={{ fontSize:12,fontWeight:700,color:'var(--md-on-surface)',textTransform:'capitalize',flex:1 }}>{activeTheme} accent</span>
                  <span style={{ fontSize:10,color:'var(--md-on-surface-var)' }}>{BG_THEMES.find(t => t.id === bgTheme)?.name || 'Light'}</span>
                </div>

                {/* Theme color grid */}
                {recentColors.length > 0 && (
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:9,fontWeight:800,color:'var(--md-on-surface-var)',marginBottom:8,letterSpacing:.5 }}>RECENT</div>
                    <div style={{ display:'flex',gap:8 }}>
                      {recentColors.map((t, i) => (
                        <button key={i} onClick={() => changeThemeColor(t)} title={t.id}
                          style={{ width:28,height:28,borderRadius:'50%',border:activeTheme === t.id ? '2px solid var(--md-on-surface)' : '2px solid transparent',background:t.p,cursor:'pointer',transition:'all .15s',transform:activeTheme === t.id ? 'scale(1.1)' : 'scale(1)' }} />
                      ))}
                    </div>
                  </div>
                )}

                {['Dynamic','Simple','Pro'].map(cat => (
                  <div key={cat} style={{ marginBottom:10 }}>
                    <div style={{ fontSize:9,fontWeight:800,opacity:.4,marginBottom:6,letterSpacing:.5,color:'var(--md-on-surface-var)' }}>{cat.toUpperCase()}</div>
                    <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6 }}>
                      {APP_THEME_COLORS.filter(t => t.category === cat).map(t => (
                        <button key={t.id} onClick={() => changeThemeColor(t)} title={t.id}
                          style={{ width:36,height:36,borderRadius:8,border:activeTheme === t.id ? '2px solid var(--md-on-surface)' : '1px solid var(--md-outline)',background:t.p,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',transition:'all .1s' }}>
                          {activeTheme === t.id && <span style={{ color:'#fff',fontSize:12,textShadow:'0 1px 2px rgba(0,0,0,.5)' }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Custom color picker */}
                <div style={{ display:'flex',alignItems:'center',gap:10,marginTop:6 }}>
                  <input type="color" id="customColorPicker"
                    onChange={(e) => {
                      const hex = e.target.value;
                      const r = parseInt(hex.slice(1,3), 16);
                      const g = parseInt(hex.slice(3,5), 16);
                      const b = parseInt(hex.slice(5,7), 16);
                      changeThemeColor({ id:'custom', p:hex, rgb:`${r}, ${g}, ${b}`, pc:`#${hex.slice(1,3)}${hex.slice(3,5)}${hex.slice(5,7)}`, opc:'#000', category:'Custom' });
                    }}
                    style={{ width:36,height:36,border:'none',borderRadius:8,cursor:'pointer',background:'transparent',padding:0 }} />
                  <label htmlFor="customColorPicker" style={{ fontSize:11,color:'var(--md-on-surface-var)',cursor:'pointer' }}>Custom color</label>
                </div>
              </div>

              {/* ═══ APPEARANCE ═══ */}
              <div className="panel-section">
                <div className="panel-section-header">Appearance</div>

                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:10,fontWeight:700,color:'var(--md-on-surface-var)',marginBottom:8 }}>Font</div>
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:6 }}>
                    {FONT_OPTIONS.map(font => (
                      <button key={font.id} onClick={() => changeFont(font)}
                        style={{ padding:'8px 10px',borderRadius:8,fontSize:11,cursor:'pointer',
                          border: activeFont === font.id ? '2px solid var(--md-primary)' : '1px solid var(--md-outline)',
                          background: activeFont === font.id ? 'var(--md-primary-container)' : 'var(--md-surface-variant)',
                          color:'var(--md-on-surface)',fontFamily:font.family,transition:'all .1s' }}>
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize:10,fontWeight:700,color:'var(--md-on-surface-var)',marginBottom:8 }}>Animation Speed</div>
                  <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6 }}>
                    {ANIMATION_SPEEDS.map(speed => (
                      <button key={speed.id} onClick={() => changeAnimSpeed(speed)}
                        style={{ padding:'6px 4px',borderRadius:8,fontSize:10,cursor:'pointer',
                          border: animSpeed === speed.id ? '2px solid var(--md-primary)' : '1px solid var(--md-outline)',
                          background: animSpeed === speed.id ? 'var(--md-primary-container)' : 'var(--md-surface-variant)',
                          color:'var(--md-on-surface)',fontWeight: animSpeed === speed.id ? 800 : 500,transition:'all .1s' }}>
                        {speed.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ═══ ACCOUNT ═══ */}
              <div className="panel-section">
                <div className="panel-section-header">Account</div>

                <div style={{ padding:'12px',background:'var(--md-surface-variant)',borderRadius:10,marginBottom:16 }}>
                  <div style={{ fontSize:11,fontWeight:700,color:'var(--md-on-surface)' }}>v1.0.0</div>
                  <div style={{ fontSize:9,color:'var(--md-on-surface-var)' }}>2025-05-17</div>
                </div>

                <button onClick={() => { handleLogout(); setShowProfilePanel(false); }}
                  style={{ width:'100%',padding:'12px 16px',borderRadius:10,border:'1px solid rgba(233,30,99,.2)',background:'rgba(233,30,99,.06)',color:'#E91E63',fontSize:12,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:8,justifyContent:'center',fontFamily:'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(233,30,99,.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(233,30,99,.06)'}>
                  <span className="material-symbols-outlined" style={{ fontSize:16 }}>logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════ MAIN ══════ */}
      <div className="main-content">

        {/* TOP BAR */}
        <header className="topbar" role="banner">
          {/* Left section (Breadcrumbs) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, zIndex: 1 }}>
            {(() => {
              const bc = getBreadcrumb(page);
              return (
                <div className="breadcrumb-tracker" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: '500', color: 'var(--md-on-surface-var)', marginLeft: '10px', whiteSpace: 'nowrap', userSelect: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '17px', color: 'var(--md-primary)' }}>{bc.icon}</span>
                  {page === 'home' ? (
                    <span style={{ color: 'var(--md-on-surface)', fontWeight: '600' }}>EatClub Home</span>
                  ) : (
                    <>
                      <span style={{ cursor: 'pointer', transition: 'color 0.2s', opacity: 0.8 }} onClick={() => setPage('home')} onMouseOver={(e) => e.target.style.color='var(--md-primary)'} onMouseOut={(e) => e.target.style.color=''}>Home</span>
                      {bc.group && (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '15px', opacity: 0.4 }}>chevron_right</span>
                          <span style={{ opacity: 0.7 }}>{bc.group}</span>
                        </>
                      )}
                      <span className="material-symbols-outlined" style={{ fontSize: '15px', opacity: 0.4 }}>chevron_right</span>
                      <span style={{ color: 'var(--md-on-surface)', fontWeight: '600' }}>{bc.item}</span>
                    </>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Center section (Music | Clock | Credits) — Absolutely Centered */}
          <div className="topbar-center-group" style={{ 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            whiteSpace: 'nowrap',
            zIndex: 0
          }}>
            {/* Music player (Left of Timer) */}
            <YTMusicPlayer />

            <div style={{ width: '1.5px', height: '18px', background: 'var(--md-on-surface)', opacity: 0.15, borderRadius: '2px' }} />

            {/* Timer Clock (Center) */}
            <div style={{ fontSize: '13px' }}>
              <Clock />
            </div>

            <div style={{ width: '1.5px', height: '18px', background: 'var(--md-on-surface)', opacity: 0.15, borderRadius: '2px' }} />

            {/* Made By Creespy tab (Right of Clock) */}
            <button className="credits-btn" onClick={() => { activatePartyMode(); setShowContactCard(true); }} style={{ margin: 0 }}>
               MADE BY CREESPY (Aaرف!)
            </button>
          </div>

          <div style={{ flex: 1 }} />

          {/* Right section (Actions) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', zIndex: 1 }} className="topbar-actions">
            {/* Notepad */}
            <div style={{ position: 'relative' }}>
              <button
                className={`theme-toggle-btn ${showNotepad ? 'active' : ''}`}
                onClick={() => { setShowNotepad(!showNotepad); setShowChat(false); setShowActiveMembers(false); }}
                title="Notepad"
                aria-label="Toggle notepad"
                aria-expanded={showNotepad}
              >
                <span className="material-symbols-outlined">note_alt</span>
              </button>
              {showNotepad && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowNotepad(false)} />
                  <NotepadPanel
                    uid={googleUser?.uid || localStorage.getItem('eatclub_uid') || ''}
                    onClose={() => setShowNotepad(false)}
                    onNavigateDashboard={() => { setPage('dashboard'); setShowNotepad(false); }}
                  />
                </>
              )}
            </div>

            {/* Live Chat — Redesigned */}
            <div style={{ position: 'relative' }}>
              <button
                className={`theme-toggle-btn ${showChat ? 'active' : ''}`}
                onClick={() => { setShowChat(!showChat); setShowNotepad(false); setShowActiveMembers(false); }}
                title="Live chat"
                aria-label="Toggle live chat"
                aria-expanded={showChat}
              >
                <span className="material-symbols-outlined">chat</span>
                {unreadCount > 0 && (
                  <span className="online-count-badge" style={{ background: 'linear-gradient(135deg, #F44336, #C62828)' }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              {showChat && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowChat(false)} />
                  <div className="chat-panel" role="dialog" aria-label="Live chat">
                    {dmTarget ? (
                      <DirectChat
                        otherUser={dmTarget}
                        myId={localStorage.getItem('eatclub_member_id') || ''}
                        myName={localStorage.getItem('eatclub_agent_name') || 'User'}
                        myRole={localStorage.getItem('eatclub_role') || ''}
                        myPhotoURL={(() => { try { const a = JSON.parse(localStorage.getItem('eatclub_avatar')); if (a?.type === 'google') return googleUser?.photoURL || ''; if (a?.type === 'emoji') return a.value || ''; return googleUser?.photoURL || ''; } catch { return googleUser?.photoURL || ''; } })()}
                        onBack={() => setDmTarget(null)}
                      />
                    ) : (
                      <>
                        <div className="chat-header" style={{ flexDirection: 'column', alignItems: 'stretch', padding: '12px 16px', gap: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div className="chat-header-left">
                                <div className="chat-header-icon">
                                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>forum</span>
                                </div>
                                <div className="chat-header-meta">
                                  <h3 style={{ margin: 0 }}>Chats</h3>
                                  <div className="chat-header-status">
                                    <span className="status-dot" />
                                    {activeMembersList.filter(u => u.status === 'online').length} online
                                  </div>
                                </div>
                              </div>
                              <button className="chat-close-btn" onClick={() => setShowChat(false)} aria-label="Close chat">
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                              </button>
                            </div>
                            
                            {/* Tabs */}
                            <div style={{ display: 'flex', background: 'var(--md-surface-variant)', borderRadius: 8, padding: 4 }}>
                              <button onClick={() => setChatTab('team')} style={{ flex: 1, padding: '6px 0', borderRadius: 6, border: 'none', background: chatTab === 'team' ? 'var(--md-surface)' : 'transparent', color: chatTab === 'team' ? 'var(--md-primary)' : 'var(--md-on-surface-var)', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: chatTab === 'team' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Team</button>
                              <button onClick={() => setChatTab('dms')} style={{ flex: 1, padding: '6px 0', borderRadius: 6, border: 'none', background: chatTab === 'dms' ? 'var(--md-surface)' : 'transparent', color: chatTab === 'dms' ? 'var(--md-primary)' : 'var(--md-on-surface-var)', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: chatTab === 'dms' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Direct Messages</button>
                            </div>
                          </div>

                          {chatTab === 'team' ? (
                            <>
                              {/* Chat Messages */}
                              <div ref={chatContainerRef} className="chat-messages">
                                {chatMessages.length === 0 ? (
                                  <div className="chat-empty">
                                    <div className="chat-empty-icon">
                                      <span className="material-symbols-outlined">chat_bubble_outline</span>
                                    </div>
                                    <p>No messages in the last 24 hours.<br/>Be the first to say hello! 👋</p>
                                  </div>
                                ) : (
                                  chatMessages.map((m, idx) => {
                                    const myName = localStorage.getItem('eatclub_agent_name');
                                    const myId = localStorage.getItem('eatclub_member_id');
                                    const isMe = m.userId === myId || m.user === myName;
                                    const userColor = getUserColor(m.user);
                                    return (
                                      <div key={m.id || m.fbId || idx} className={`chat-msg-group ${isMe ? 'is-me' : 'is-other'}`}
                                        style={{ marginTop: '4px' }}>
                                        {!isMe && (
                                          <div className="chat-msg-sender" style={{ color: userColor }}>
                                            <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: userColor, marginRight: 5 }} />
                                            {m.user}
                                          </div>
                                        )}
                                        {isMe && (
                                          <div className="chat-msg-sender is-me" style={{ color: 'var(--md-on-surface-dim)', textAlign: 'right', marginRight: 12 }}>
                                            You
                                          </div>
                                        )}
                                        <div className={`chat-bubble ${isMe ? 'mine' : 'theirs'}`}
                                          style={!isMe ? { borderLeft: `3px solid ${userColor}` } : {}}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                            <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{m.text}</span>
                                            <button onClick={() => pinTeamMessage(m.fbId, !m.pinned)} style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: m.pinned ? 1 : 0.3, color: m.pinned ? 'var(--md-primary)' : 'inherit' }} title={m.pinned ? "Unpin" : "Pin for 24h+"}>
                                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>push_pin</span>
                                            </button>
                                          </div>
                                          <div className="chat-bubble-time">{m.time}</div>
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                                <div ref={chatEndRef} />
                              </div>

                              {/* Chat Input */}
                              <form onSubmit={sendMessage} className="chat-input-area">
                                <input
                                  type="text"
                                  className="chat-input"
                                  placeholder="Type a message..."
                                  value={newMessage}
                                  onChange={(e) => setNewMessage(e.target.value)}
                                  aria-label="Chat message"
                                />
                                <button type="submit" className="chat-send-btn" aria-label="Send message">
                                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                                </button>
                              </form>
                            </>
                          ) : (
                            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: 'var(--md-surface)' }}>
                              {userConversations.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--md-on-surface-var)' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: 36, opacity: 0.3, marginBottom: 12 }}>inbox</span>
                                  <div style={{ fontSize: 13, fontWeight: 700 }}>No active chats</div>
                                  <div style={{ fontSize: 11, marginTop: 4 }}>Select a user from Active Members to start chatting.</div>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  {userConversations.map(conv => (
                                    <div key={conv.convId} onClick={() => setDmTarget({ id: conv.otherUserId, name: conv.otherUserName, role: conv.otherRole, photoURL: conv.otherPhotoURL })}
                                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: 'var(--md-surface-variant)', cursor: 'pointer', transition: 'transform 0.2s' }}
                                      onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                                      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                                    >
                                      <UserAvatar size={40} name={conv.otherUserName} photoURL={conv.otherPhotoURL} />
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--md-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.otherUserName}</div>
                                          <div style={{ fontSize: 9, color: 'var(--md-on-surface-dim)' }}>
                                            {conv.lastActivity ? new Date(conv.lastActivity).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                                          </div>
                                        </div>
                                        <div style={{ fontSize: 11, color: conv.unreadCount > 0 ? 'var(--md-on-surface)' : 'var(--md-on-surface-var)', fontWeight: conv.unreadCount > 0 ? 800 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                          {conv.lastSender === localStorage.getItem('eatclub_member_id') ? 'You: ' : ''}{conv.lastMessage || 'Started a conversation'}
                                        </div>
                                      </div>
                                      {conv.unreadCount > 0 && (
                                        <div style={{ background: 'var(--md-primary)', color: '#fff', fontSize: 10, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
                                          {conv.unreadCount}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Active Members — Redesigned */}
            <div style={{ position: 'relative' }}>
              <button
                className={`theme-toggle-btn ${showActiveMembers ? 'active' : ''}`}
                onClick={() => { setShowActiveMembers(!showActiveMembers); setShowChat(false); }}
                title="Team members online"
                aria-label="View active team members"
                aria-expanded={showActiveMembers}
              >
                <span className="material-symbols-outlined">group</span>
                {activeMembersList.filter(u => u.status === 'online').length > 0 && (
                  <span className="online-count-badge">
                    {activeMembersList.filter(u => u.status === 'online').length}
                  </span>
                )}
              </button>
              {showActiveMembers && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowActiveMembers(false)} />
                  <div className="members-panel" role="dialog" aria-label="Active team members">
                    {/* Header */}
                    <div className="members-header">
                      <div className="members-header-left">
                        <div className="members-header-icon">
                          <span className="material-symbols-outlined">groups</span>
                        </div>
                        <div>
                          <div className="members-header-title">Team Hub</div>
                          <div className="members-header-sub">{activeMembersList.length} total members</div>
                        </div>
                      </div>
                      <div className="members-online-pill">
                        <span className="pulse-dot" />
                        {activeMembersList.filter(u => u.status === 'online').length} Online
                      </div>
                    </div>

                    {/* Members List */}
                    <div className="members-list">
                      {/* Online Section */}
                      <div className="members-section-label">Online Now</div>
                          {activeMembersList.filter(u => u.status === 'online').map((member, idx) => {
                            const safeName = typeof member.name === 'string' ? member.name : 'Unknown User';
                            return (
                              <div key={member.id || idx} className={`member-card ${member.isMe ? 'is-me' : ''}`}
                                style={{ animationDelay: `${idx * 0.05}s` }}>
                                <div className="member-avatar">
                                  <UserAvatar
                                    size={36}
                                    name={safeName}
                                    photoURL={member.photoURL}
                                    showStatus
                                    status="online"
                                    statusColor="#4CAF50"
                                  />
                                </div>
                                <div className="member-info">
                                  <div className="member-name-row">
                                    <span className="member-name">{safeName}</span>
                                    {member.isMe && <span className="member-you-badge">YOU</span>}
                                  </div>
                                  {member.role && (
                                    <div style={{ fontSize:10,fontWeight:700,color:'var(--md-primary)',marginTop:1 }}>{member.role}</div>
                                  )}
                                  {member.bio && (
                                    <div style={{ fontSize:9,color:'var(--md-on-surface-var)',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:200 }}>{member.bio}</div>
                                  )}
                                  <div className="member-activity">
                                    <span className="activity-dot" />
                                    Active Now
                                    {member.lastSeen && (
                                      <span style={{ fontSize:9,color:'rgba(76,175,80,0.6)',marginLeft:4 }}>
                                        • online {formatRelativeTime(member.lastSeen)}
                                      </span>
                                    )}
                                    {member.currentPage && (
                                      <span className="page-tag">
                                        • <span className="material-symbols-outlined">article</span> {member.currentPage}
                                      </span>
                                    )}
                                  </div>
                                  <div className="member-meta">
                                    {member.email && (
                                      <span className="member-meta-item">
                                        <span className="material-symbols-outlined">mail</span>
                                        {member.email}
                                      </span>
                                    )}
                                    {member.location && member.location !== 'Fetching...' && (
                                      <span className="member-meta-item">
                                        <span className="material-symbols-outlined">location_on</span>
                                        {member.location}
                                      </span>
                                    )}
                                    {member.browser && (
                                      <span className="member-meta-item">
                                        <span className="material-symbols-outlined">language</span>
                                        {member.browser}
                                      </span>
                                    )}
                                    {member.os && (
                                      <span className="member-meta-item">
                                        <span className="material-symbols-outlined">devices</span>
                                        {member.os}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {!member.isMe && (
                                  <button onClick={() => { setDmTarget({ id: member.id, name: safeName, role: member.role, photoURL: member.photoURL }); setShowActiveMembers(false); setShowChat(true); }}
                                    style={{ alignSelf:'flex-end', padding:'5px 12px', borderRadius:8, border:'1px solid var(--md-outline)', background:'var(--md-surface)', color:'var(--md-primary)', fontSize:10, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize:12, verticalAlign:'middle', marginRight:3 }}>chat</span>
                                    Message
                                  </button>
                                )}
                              </div>
                            );
                          })}
                          
                          {/* Offline Section */}
                      {activeMembersList.filter(u => u.status !== 'online').length > 0 && (
                        <>
                          <div style={{ height: 8 }} />
                          <div className="members-section-label">Recently Active</div>
                          {activeMembersList.filter(u => u.status !== 'online').sort((a, b) => b.lastSeen - a.lastSeen).map((member, idx) => {
                            const safeName = typeof member.name === 'string' ? member.name : 'Unknown User';
                            const isIdle = member.status === 'idle';
                            return (
                              <div key={member.id || idx} className="member-card offline"
                                style={{ animationDelay: `${idx * 0.05}s` }}>
                                <div className="member-avatar">
                                  <UserAvatar
                                    size={36}
                                    name={safeName}
                                    photoURL={member.photoURL}
                                    showStatus
                                    status={isIdle ? 'idle' : 'offline'}
                                    statusColor={isIdle ? '#FF9800' : undefined}
                                  />
                                </div>
                                <div className="member-info">
                                  <div className="member-name-row">
                                    <span className="member-name">{safeName}</span>
                                  </div>
                                  {member.role && (
                                    <div style={{ fontSize:10,fontWeight:700,color:'var(--md-primary)',marginTop:1 }}>{member.role}</div>
                                  )}
                                  {member.bio && (
                                    <div style={{ fontSize:9,color:'var(--md-on-surface-var)',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:200 }}>{member.bio}</div>
                                  )}
                                  <div className="member-last-seen">
                                    <span className="material-symbols-outlined">schedule</span>
                                    {isIdle ? 'Idle' : 'Last visited'} {formatRelativeTime(member.lastSeen)}
                                    {member.lastSeen && (
                                      <span style={{ fontSize:9,color:'var(--md-on-surface-var)',marginLeft:4 }}>
                                        • {new Date(member.lastSeen).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                                      </span>
                                    )}
                                  </div>
                                  {member.currentPage && (
                                    <div className="member-meta" style={{ marginTop: 3 }}>
                                      <span className="member-meta-item">
                                        <span className="material-symbols-outlined">article</span>
                                        Was on: {member.currentPage}
                                      </span>
                                    </div>
                                  )}
                                  <div className="member-meta">
                                    {member.email && (
                                      <span className="member-meta-item">
                                        <span className="material-symbols-outlined">mail</span>
                                        {member.email}
                                      </span>
                                    )}
                                    {member.location && member.location !== 'Fetching...' && (
                                      <span className="member-meta-item">
                                        <span className="material-symbols-outlined">location_on</span>
                                        {member.location}
                                      </span>
                                    )}
                                    {member.browser && (
                                      <span className="member-meta-item">
                                        <span className="material-symbols-outlined">language</span>
                                        {member.browser}
                                      </span>
                                    )}
                                    {member.os && (
                                      <span className="member-meta-item">
                                        <span className="material-symbols-outlined">devices</span>
                                        {member.os}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {!member.isMe && (
                                  <button onClick={() => { setDmTarget({ id: member.id, name: safeName, role: member.role, photoURL: member.photoURL }); setShowActiveMembers(false); setShowChat(true); }}
                                    style={{ alignSelf:'flex-end', padding:'5px 12px', borderRadius:8, border:'1px solid var(--md-outline)', background:'var(--md-surface)', color:'var(--md-primary)', fontSize:10, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize:12, verticalAlign:'middle', marginRight:3 }}>chat</span>
                                    Message
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile button - opens left panel */}
            <button
              onClick={() => setShowProfilePanel(true)}
              className="topbar-profile-btn"
              aria-label="Open profile panel"
              aria-expanded={showProfilePanel}
              style={{
                display:'flex',alignItems:'center',gap:8,marginLeft:6,
                background:'none',border:'none',cursor:'pointer',padding:'4px 6px',
                borderRadius:10,color:'inherit',fontFamily:'inherit',
              }}
            >
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:11,fontWeight:800,color:'var(--md-on-surface)',lineHeight:1.2 }}>
                  {localStorage.getItem('eatclub_agent_name') || 'User'}
                </div>
                <div style={{ fontSize:9,color:'var(--md-on-surface-var)',fontWeight:600 }}>
                  {localStorage.getItem('eatclub_role') || 'Member'}
                </div>
              </div>
              <UserAvatar
                size={32}
                name={localStorage.getItem('eatclub_agent_name') || 'User'}
                photoURL={googleUser?.photoURL}
                style={{ pointerEvents: 'none' }}
                alt="Profile"
              />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main key={page} role="main" className={MODULE_PAGE_IDS.includes(page) ? 'has-module-footer' : ''}>
          {renderPage(page, navigate, googleUser, userProfile, handleUpdateProfile, handleLogout, xp, streak, completedModules)}
        </main>

        {/* Daily Login XP Toast */}
        {dailyXpMessage && (
          <div style={{
            position:'fixed', bottom: MODULE_PAGE_IDS.includes(page) ? 70 : 20, right: 20, zIndex: 9999,
            padding:'10px 18px', borderRadius: 12,
            background: 'linear-gradient(135deg, #FFD700, #FFA000)',
            color: '#1a1a1a', fontSize: 13, fontWeight: 800,
            boxShadow: '0 6px 24px rgba(255,165,0,0.4)',
            display: 'flex', alignItems: 'center', gap: 8,
            animation: 'chatPanelIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            pointerEvents: 'none',
          }}>
            <span className="material-symbols-outlined" style={{fontSize:18}}>login</span>
            {dailyXpMessage}
          </div>
        )}

        {/* ══════ MODULE ACTIONS FOOTER ══════ */}
        {MODULE_PAGE_IDS.includes(page) && (
          <div className="module-footer" role="contentinfo" aria-label="Module progress footer">
            {/* Left: Streak + XP details */}
            <div className="module-footer-left">
              <div className="module-footer-section">
                <span className="material-symbols-outlined" style={{ fontSize:18,color:'#FF5722' }}>local_fire_department</span>
                <div className="module-footer-stat">
                  <span className="module-footer-stat-value streak">{streak}</span>
                  <span className="module-footer-stat-label">Day Streak</span>
                </div>
              </div>
              <div className="module-footer-divider" />
              <div className="module-footer-section">
                <span className="material-symbols-outlined" style={{ fontSize:18,color:'#FFD700' }}>emoji_events</span>
                <div className="module-footer-stat">
                  <span className="module-footer-stat-value xp">{xp}</span>
                  <span className="module-footer-stat-label">Total XP</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="module-footer-right">
              <button onClick={() => handleToggleBookmark(page)}
                style={{
                  padding:'7px 14px',borderRadius:100,
                  border:'1px solid var(--md-outline)',
                  background:bookmarkedModules.includes(page) ? 'rgba(255,152,0,.12)' : 'var(--md-surface-variant)',
                  color:bookmarkedModules.includes(page) ? '#FF9800' : 'var(--md-on-surface-var)',
                  fontSize:11,fontWeight:700,cursor:'pointer',
                  display:'flex',alignItems:'center',gap:6,whiteSpace:'nowrap',
                }}>
                <span className="material-symbols-outlined" style={{ fontSize:14 }}>
                  {bookmarkedModules.includes(page) ? 'bookmark' : 'bookmark_border'}
                </span>
                {bookmarkedModules.includes(page) ? 'Bookmarked' : 'Bookmark'}
              </button>
              {!completedModules.find(m => m.id === page || m === page) ? (
                <button onClick={() => handleModuleComplete(page, PAGE_TITLES[page] || page)}
                  style={{
                    padding:'7px 18px',borderRadius:100,border:'none',
                    background:'linear-gradient(135deg,var(--md-primary),#FF8F00)',
                    color:'#fff',fontSize:11,fontWeight:800,cursor:'pointer',
                    display:'flex',alignItems:'center',gap:6,whiteSpace:'nowrap',
                    boxShadow:'0 4px 14px rgba(var(--md-primary-rgb),.3)',
                  }}>
                  <span className="material-symbols-outlined" style={{ fontSize:14 }}>check_circle</span>
                  Complete +25 XP
                </button>
              ) : (
                <div style={{ display:'flex',alignItems:'center',gap:6,padding:'5px 12px',borderRadius:100,background:'rgba(76,175,80,.1)',color:'#4CAF50',fontSize:11,fontWeight:700 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:14 }}>check_circle</span>
                  Done
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
