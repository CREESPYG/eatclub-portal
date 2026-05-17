import { useState, useEffect, useRef } from 'react';
import { useLocalStorage, useLocalStorageSet } from './hooks/useLocalStorage';
import './index.css';
import './redesign.css';
import Clock from './components/Clock';
import SpotifyPlayer from './components/SpotifyPlayer';
import DynamicTitle from './components/DynamicTitle';
import WelcomeAnimation from './components/WelcomeAnimation';
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

import { db, auth } from './firebase';
import { ref as dbRef, set, push, onValue, onDisconnect, serverTimestamp, remove, update } from 'firebase/database';
import { signInAnonymously, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// ── NAV GROUPS (accordion menu) ──
const NAV_GROUPS = [
  {
    id: 'dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
    type: 'single',
  },
  {
    id: 'home',
    icon: 'home',
    label: 'Home',
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
  'dashboard': 'dashboard', 'home': 'home', 'about': 'info', 'chat-kpis': 'bar_chart', 'chat-flows': 'account_tree',
  'hash-library': 'tag', 'agent-guide': 'smart_toy', 'call-kpis': 'call',
  'call-scripts': 'assignment', 'cc-templates': 'content_copy', 'box8': 'lunch_dining',
  'mojo': 'local_pizza', 'tags': 'label', 'resolution': 'bolt', 'ratings': 'star',
  'escalation': 'report', 'refunds': 'payments', 'refunds-master': 'table_chart',
  'yellow-ai': 'adb', 'cheat-sheet': 'push_pin', 'platform-overview': 'web',
  'quiz': 'quiz',
};

function renderPage(page, navigate, user, userProfile, onUpdateProfile, onLogout, xp, streak, completedModules) {
  switch (page) {
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

const APP_THEME_COLORS = [
  { id: 'orange',   p: '#FF5722', rgb: '255, 87, 34',   pc: '#FFDBCF', opc: '#3E0B00', category: 'Dynamic' },
  { id: 'pink',     p: '#E91E63', rgb: '233, 30, 99',   pc: '#F8BBD0', opc: '#3A0019', category: 'Dynamic' },
  { id: 'sky',      p: '#00BCD4', rgb: '0, 188, 212',   pc: '#B2EBF2', opc: '#002124', category: 'Dynamic' },
  { id: 'gold',     p: '#FFD700', rgb: '255, 215, 0',   pc: '#FFF9C4', opc: '#332B00', category: 'Dynamic' },
  { id: 'blue',     p: '#2196F3', rgb: '33, 150, 243',  pc: '#BBDEFB', opc: '#001E31', category: 'Simple' },
  { id: 'green',    p: '#4CAF50', rgb: '76, 175, 80',   pc: '#C8E6C9', opc: '#002105', category: 'Simple' },
  { id: 'slate',    p: '#607D8B', rgb: '96, 125, 139',  pc: '#CFD8DC', opc: '#12191C', category: 'Simple' },
  { id: 'nordic',   p: '#90A4AE', rgb: '144, 164, 174', pc: '#ECEFF1', opc: '#263238', category: 'Simple' },
  { id: 'indigo',   p: '#3F51B5', rgb: '63, 81, 181',   pc: '#C5CAE9', opc: '#0D1137', category: 'Pro' },
  { id: 'forest',   p: '#1B5E20', rgb: '27, 94, 32',    pc: '#C8E6C9', opc: '#001A03', category: 'Pro' },
  { id: 'midnight', p: '#121212', rgb: '18, 18, 18',    pc: '#2C2C2C', opc: '#FFFFFF', category: 'Pro' },
  { id: 'crimson',  p: '#880E4F', rgb: '136, 14, 79',   pc: '#F8BBD0', opc: '#1A0009', category: 'Pro' },
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
  const [collapsed, setCollapsed] = useLocalStorage('ec_sidebar_collapsed', false);
  const [isLight, setIsLight] = useLocalStorage('ec_is_light', true);
  const [activeTheme, setActiveTheme] = useLocalStorage('ec_theme', 'sky');
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

  // Track daily visit for streak
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
    }
  }, []);

  const handleModuleComplete = (moduleId, moduleName) => {
    setXp(prev => prev + 25);
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
  const [activeMembersList, setActiveMembersList] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const toggleGroup = (grpId) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(grpId)) next.delete(grpId);
      else next.add(grpId);
      return next;
    });
  };

  // ── AUTH EXPIRY LOGIC (24 HOURS) ──
  const checkAuthExpiry = () => {
    const lastAuth = localStorage.getItem('eatclub_auth_time');
    if (!lastAuth) return false;
    const diff = Date.now() - parseInt(lastAuth);
    return diff < 24 * 60 * 60 * 1000;
  };

  const [isAuthorized, setIsAuthorized] = useState(checkAuthExpiry());
  const [showWelcome, setShowWelcome] = useState(true);
  const [loginName, setLoginName] = useState('');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginShake, setLoginShake] = useState(false);

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

  const handleGoogleLogin = async () => {
    try {
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
          bio: existingBio || '', role: existingRole || '', email: userData.email
        }).catch(() => null);
      }
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

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
        set(presenceRef, getAgentDetails(document.hidden ? 'idle' : 'online')).catch(() => null);
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
        const msgs = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
        const lastMsg = msgs[msgs.length - 1];
        
        const currentName = localStorage.getItem('eatclub_agent_name') || 'Local User';
        if (lastMsg && lastMsg.timestamp >= sessionStartTime && lastMsg.user !== currentName && !initialLoad.current) {
           if (!showChatRef.current) {
             addToast({ title: lastMsg.user, text: lastMsg.text });
           }
        }
        setChatMessages(msgs.slice(-100));
      }
    }, (err) => console.error("Chat sync error:", err));

    const handleVisibilityChange = () => {
      const st = document.hidden ? 'idle' : 'online';
      updateLocalPresence(st);
      set(presenceRef, getAgentDetails(st)).catch(() => null);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Fetch IP location exactly once
    fetch('https://ipapi.co/json/').then(res => res.json()).then(data => {
      if (data && data.city) {
        locationData = `${data.city}, ${data.country_name || ''}`;
        updateLocalPresence(document.hidden ? 'idle' : 'online');
        set(presenceRef, getAgentDetails(document.hidden ? 'idle' : 'online')).catch(() => null);
      }
    }).catch(() => null);

    // Save refs for sendMessage
    chatClientRef.current = { channel, memberId };

    return () => {
      channel.close();
      unsubscribePresence();
      unsubscribeChat();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const currentUser = activeMembersList.find(a => a.isMe);
    const userName = currentUser ? currentUser.name : (localStorage.getItem('eatclub_agent_name') || 'You');
    const msg = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      user: userName, text: newMessage,
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

  const handleLogin = (e) => {
    e.preventDefault();
    const name = loginName.trim();
    const pass = loginPasscode;
    if (!name) {
      setLoginError('Please enter your full name.');
      setLoginShake(true);
      setTimeout(() => setLoginShake(false), 500);
      return;
    }
    if (pass !== 'Hello@CC') {
      setLoginError('Invalid Passcode');
      setLoginShake(true);
      setTimeout(() => setLoginShake(false), 500);
      return;
    }

    const authTime = Date.now().toString();
    localStorage.setItem('eatclub_agent_name', name);
    localStorage.setItem('eatclub_auth_time', authTime);
    
    // Immediately update presence with new name
    const memberId = localStorage.getItem('eatclub_member_id');
    if (memberId) {
      set(dbRef(db, 'presence/' + memberId), {
        id: memberId, name: name, status: 'online', lastSeen: Date.now(), joinedAt: Date.now(),
        location: 'Fetching...', browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other',
        os: navigator.platform, currentPage: page, isMe: true,
        bio: '', role: '', email: ''
      }).catch(() => null);
    }

    setLoginError('');
    setIsAuthorized(true);
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    const authTime = localStorage.getItem('eatclub_auth_time');
    localStorage.setItem('ec_welcome_shown_for', authTime || Date.now().toString());
  };

  const getUserColor = (name) => {
    if (!name) return 'var(--md-primary)';
    const colors = ['#FF5722','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50','#8BC34A','#CDDC39','#FFC107','#FF9800','#795548'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
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
  };

  // ── RESTORE THEME + LIGHT/DARK ON EVERY MOUNT ──────────────────────────
  useEffect(() => {
    // Restore light/dark class
    if (isLight) document.body.classList.add('light-theme');
    else document.body.classList.remove('light-theme');

    // Restore theme color CSS variables
    const t = APP_THEME_COLORS.find(c => c.id === activeTheme);
    if (t) {
      const root = document.documentElement;
      root.style.setProperty('--md-primary', t.p);
      root.style.setProperty('--md-primary-rgb', t.rgb);
      root.style.setProperty('--md-primary-container', t.pc);
      root.style.setProperty('--md-on-primary-cont', t.opc);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount — values come from persisted localStorage

  // ── ALSO KEEP LIGHT/DARK CLASS IN SYNC WHEN TOGGLED ────────────────────
  useEffect(() => {
    if (isLight) document.body.classList.add('light-theme');
    else document.body.classList.remove('light-theme');
  }, [isLight]);


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

  const toggleTheme = () => {
    setIsLight(prev => {
      const next = !prev;
      if (next) document.body.classList.add('light-theme');
      else document.body.classList.remove('light-theme');
      return next;
    });
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


  // ── WELCOME ANIMATION ──
  if (showWelcome) {
    return <WelcomeAnimation onComplete={handleWelcomeComplete} />;
  }

  // ── COMBINED LOGIN PAGE (Name + Passcode) ──
  if (!isAuthorized) {
    return (
      <div className="passcode-container">
        <div className="passcode-card">
          <div className="passcode-avatar-wrap">
            <div className="passcode-avatar">🎮</div>
            <div className="passcode-online-dot"></div>
          </div>
          <div className="passcode-header">
            <h1>EatClub CC Portal</h1>
            <p>Login with your name & passcode to access the workspace</p>
          </div>
          <form onSubmit={handleLogin} className={loginShake ? 'login-shake' : ''}>
            <div className="passcode-input-group">
              <div className="login-field">
                <span className="material-symbols-outlined login-field-icon">person</span>
                <input
                  type="text"
                  className="passcode-input"
                  placeholder="Your Full Name"
                  value={loginName}
                  onChange={e => setLoginName(e.target.value)}
                  autoFocus
                  autoComplete="off"
                  style={{ letterSpacing: 'normal', textAlign: 'left', paddingLeft: '48px' }}
                />
              </div>
              <div className="login-field" style={{ marginTop: '12px' }}>
                <span className="material-symbols-outlined login-field-icon">lock</span>
                <input
                  type="password"
                  className="passcode-input"
                  placeholder="Passcode"
                  value={loginPasscode}
                  onChange={e => setLoginPasscode(e.target.value)}
                  autoComplete="off"
                  style={{ paddingLeft: '48px' }}
                />
              </div>
              {loginError && (
                <div className="passcode-error" style={{ display: 'block', color: '#ff5252', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>
                  {loginError}
                </div>
              )}
            </div>
            <button type="submit" className="passcode-submit">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>login</span>
              Enter Workspace
            </button>
          </form>

          <div style={{ display:'flex',alignItems:'center',gap:12,margin:'14px 0' }}>
            <div style={{ flex:1,height:'1px',background:'var(--md-outline)' }} />
            <span style={{ fontSize:10,color:'var(--md-on-surface-var)',fontWeight:700,letterSpacing:1 }}>OR</span>
            <div style={{ flex:1,height:'1px',background:'var(--md-outline)' }} />
          </div>

          <button onClick={handleGoogleLogin} className="google-signin-btn" type="button">
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="admin-contact">
            <div className="admin-contact-title">Contact Admin/Developer</div>
            <a href="https://www.linkedin.com/in/arif-ansari-a9586810a/" target="_blank" rel="noopener noreferrer" className="contact-mini-badge">
              <div className="mini-avatar">👨‍💻</div>
              <div className="mini-details">
                <div className="mini-name">MD ARIF ANSARI</div>
                <div className="mini-handle">Admin & Lead Developer</div>
              </div>
              <span className="material-symbols-outlined" style={{marginLeft: 'auto', fontSize: 18}}>open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    );
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
      <nav className={`nav-rail ${collapsed ? 'collapsed' : ''}`} aria-label="Main Navigation">

        {/* Brand */}
        <div className="nav-brand">
          <div className="nav-logo" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="/logo.jpeg" alt="EatClub Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="nav-brand-text">
            <h2><DynamicTitle text="EatClub CC" /></h2>
            <span>Training Portal</span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="nav-items">
          {NAV_GROUPS.map(grp => {
            if (grp.type === 'single') {
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
                  title={collapsed ? grp.label : undefined}
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

        {/* Sidebar footer */}
        <div className="nav-footer">
          <div className="nav-footer-inner">
            <span className="material-symbols-outlined" style={{ fontSize: 14, opacity: 0.5 }}>verified</span>
            <span className="nav-label" style={{ fontSize: '11px', opacity: 0.5 }}>v2.0 • CREESPY</span>
          </div>
          <div style={{ padding:'6px 12px',borderTop:'1px solid var(--md-outline)',marginTop:2,display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ width:22,height:22,borderRadius:'50%',background:'linear-gradient(135deg,var(--md-primary),#FF8F00)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:900,color:'#fff',flexShrink:0 }}>
              {(localStorage.getItem('eatclub_agent_name') || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex:1,minWidth:0,fontSize:10,fontWeight:600,color:'var(--md-on-surface-var)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
              {localStorage.getItem('eatclub_agent_name') || 'User'}
            </div>
          </div>
        </div>
      </nav>

      {/* ══════ MAIN ══════ */}
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>

        {/* TOP BAR */}
        <header className="topbar" role="banner">
          {/* Left section (Menu toggle & Breadcrumbs) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, zIndex: 1 }}>
            <button
              className="topbar-menu-btn material-symbols-outlined"
              onClick={() => setCollapsed(c => !c)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? 'menu_open' : 'menu'}
            </button>
            
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
            <SpotifyPlayer primaryColor={APP_THEME_COLORS.find(t => t.id === activeTheme)?.p || '#FF5722'} />

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
            {/* Theme Picker */}
            <div style={{ position: 'relative' }}>
              <button
                className={`theme-toggle-btn ${showThemeMenu ? 'active' : ''}`}
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                title="Change theme colour"
                aria-haspopup="true"
                aria-expanded={showThemeMenu}
              >
                <span className="material-symbols-outlined">palette</span>
              </button>
              {showThemeMenu && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowThemeMenu(false)} />
                  <div className="theme-dropdown" style={{ width: '240px', padding: '16px' }}>
                    {['Dynamic', 'Simple', 'Pro'].map(cat => (
                      <div key={cat} style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.45, marginBottom: '8px', letterSpacing: '1px' }}>{cat.toUpperCase()}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                          {APP_THEME_COLORS.filter(t => t.category === cat).map(t => (
                            <button
                              key={t.id}
                              className={`theme-option ${activeTheme === t.id ? 'active' : ''}`}
                              onClick={() => { changeThemeColor(t); setShowThemeMenu(false); }}
                              style={{ padding: '7px 10px', fontSize: '0.78rem' }}
                            >
                              <span style={{ width: 12, height: 12, borderRadius: '50%', background: t.p, flexShrink: 0, display: 'inline-block' }} />
                              <span>{t.id.charAt(0).toUpperCase() + t.id.slice(1)}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Light / Dark Toggle */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
              aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <span className="material-symbols-outlined">{isLight ? 'dark_mode' : 'light_mode'}</span>
            </button>

            {/* Live Chat — Redesigned */}
            <div style={{ position: 'relative' }}>
              <button
                className={`theme-toggle-btn ${showChat ? 'active' : ''}`}
                onClick={() => { setShowChat(!showChat); setShowActiveMembers(false); }}
                title="Live chat"
                aria-label="Toggle live chat"
                aria-expanded={showChat}
              >
                <span className="material-symbols-outlined">chat</span>
                {chatMessages.length > 0 && (
                  <span className="online-count-badge" style={{ background: 'linear-gradient(135deg, #F44336, #C62828)' }}>
                    {chatMessages.length > 99 ? '99+' : chatMessages.length}
                  </span>
                )}
              </button>
              {showChat && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowChat(false)} />
                  <div className="chat-panel" role="dialog" aria-label="Live chat">
                    {/* Chat Header */}
                    <div className="chat-header">
                      <div className="chat-header-left">
                        <div className="chat-header-icon">
                          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>forum</span>
                        </div>
                        <div className="chat-header-meta">
                          <h3>Team Chat</h3>
                          <div className="chat-header-status">
                            <span className="status-dot" />
                            {activeMembersList.filter(u => u.status === 'online').length} members online
                          </div>
                        </div>
                      </div>
                      <button className="chat-close-btn" onClick={() => setShowChat(false)} aria-label="Close chat">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                      </button>
                    </div>

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
                          const isMe = m.user === myName;
                          const userColor = getUserColor(m.user);
                          const prevMsg = chatMessages[idx - 1];
                          const isNewGroup = !prevMsg || prevMsg.user !== m.user;
                          return (
                            <div key={m.id} className={`chat-msg-group ${isMe ? 'is-me' : 'is-other'}`}
                              style={{ marginTop: isNewGroup ? '8px' : '2px' }}>
                              {isNewGroup && !isMe && (
                                <div className="chat-msg-sender" style={{ color: userColor }}>
                                  {m.user}
                                </div>
                              )}
                              <div className={`chat-bubble ${isMe ? 'mine' : 'theirs'}`}
                                style={!isMe ? { borderLeft: `3px solid ${userColor}` } : {}}>
                                {m.text}
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
                              <div className="member-avatar-circle">{safeName.charAt(0).toUpperCase()}</div>
                              <div className="member-status-dot online" />
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
                            const lastActive = new Date(member.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const isIdle = member.status === 'idle';
                            return (
                              <div key={member.id || idx} className="member-card offline"
                                style={{ animationDelay: `${idx * 0.05}s` }}>
                                <div className="member-avatar">
                                  <div className="member-avatar-circle">{safeName.charAt(0).toUpperCase()}</div>
                                  <div className={`member-status-dot ${isIdle ? 'idle' : 'off'}`} />
                                </div>
                                <div className="member-info">
                                  <div className="member-name-row">
                                    <span className="member-name">{safeName}</span>
                                  </div>
                                  {member.role && (
                                    <div style={{ fontSize:10,fontWeight:700,color:'var(--md-primary)',marginTop:1 }}>{member.role}</div>
                                  )}
                                  <div className="member-last-seen">
                                    <span className="material-symbols-outlined">schedule</span>
                                    {isIdle ? 'Idle' : 'Last seen'} at {lastActive}
                                  </div>
                                  {member.currentPage && (
                                    <div className="member-meta" style={{ marginTop: 3 }}>
                                      <span className="member-meta-item">
                                        <span className="material-symbols-outlined">article</span>
                                        Was on: {member.currentPage}
                                      </span>
                                    </div>
                                  )}
                                </div>
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

            {/* User name + Avatar */}
            <div style={{ display:'flex',alignItems:'center',gap:8,marginLeft:6 }}>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:11,fontWeight:800,color:'var(--md-on-surface)',lineHeight:1.2 }}>
                  {localStorage.getItem('eatclub_agent_name') || 'User'}
                </div>
                <div style={{ fontSize:9,color:'var(--md-on-surface-var)',fontWeight:600 }}>
                  {localStorage.getItem('eatclub_role') || 'Member'}
                </div>
              </div>
              <div
                className="topbar-avatar"
                title="Developer card"
                style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => { activatePartyMode(); setShowContactCard(true); }}
                role="button"
                tabIndex={0}
                aria-label="View developer card"
              >
                {googleUser?.photoURL ? (
                  <img src={googleUser.photoURL} alt="Profile" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                ) : (
                  <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,var(--md-primary),#FF8F00)',color:'#fff',fontWeight:900,fontSize:14 }}>
                    {(localStorage.getItem('eatclub_agent_name') || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main key={page} role="main">
          {renderPage(page, navigate, googleUser, userProfile, handleUpdateProfile, handleLogout, xp, streak, completedModules)}
        </main>

        {/* ══════ MODULE ACTIONS BAR ══════ */}
        {MODULE_PAGE_IDS.includes(page) && (
          <div style={{
            position:'fixed',bottom:0,left:0,right:0,zIndex:999,
            background:'var(--md-surface)',
            borderTop:'1px solid var(--md-outline)',
            padding:'10px 20px',
            display:'flex',alignItems:'center',justifyContent:'space-between',
            gap:12,flexWrap:'wrap',
          }}>
            <div style={{ display:'flex',alignItems:'center',gap:12 }}>
              <div style={{ display:'flex',alignItems:'center',gap:6,fontSize:11,fontWeight:700,color:'var(--md-on-surface-var)' }}>
                <span className="material-symbols-outlined" style={{ fontSize:16,color:'#FF5722' }}>local_fire_department</span>
                {streak} day streak
              </div>
              <div style={{ width:1,height:20,background:'var(--md-outline)' }} />
              <div style={{ display:'flex',alignItems:'center',gap:6,fontSize:11,fontWeight:700,color:'var(--md-on-surface-var)' }}>
                <span className="material-symbols-outlined" style={{ fontSize:16,color:'#FFD700' }}>emoji_events</span>
                {xp} XP
              </div>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:8 }}>
              <button onClick={() => handleToggleBookmark(page)}
                style={{
                  padding:'8px 16px',borderRadius:100,
                  border:'1px solid var(--md-outline)',
                  background:bookmarkedModules.includes(page) ? 'rgba(255,152,0,.12)' : 'var(--md-surface-variant)',
                  color:bookmarkedModules.includes(page) ? '#FF9800' : 'var(--md-on-surface-var)',
                  fontSize:11,fontWeight:700,cursor:'pointer',
                  display:'flex',alignItems:'center',gap:6,
                }}>
                <span className="material-symbols-outlined" style={{ fontSize:14 }}>
                  {bookmarkedModules.includes(page) ? 'bookmark' : 'bookmark_border'}
                </span>
                {bookmarkedModules.includes(page) ? 'Bookmarked' : 'Bookmark'}
              </button>
              {!completedModules.find(m => m.id === page || m === page) ? (
                <button onClick={() => handleModuleComplete(page, PAGE_TITLES[page] || page)}
                  style={{
                    padding:'8px 20px',borderRadius:100,
                    border:'none',
                    background:'linear-gradient(135deg,var(--md-primary),#FF8F00)',
                    color:'#fff',fontSize:11,fontWeight:800,cursor:'pointer',
                    display:'flex',alignItems:'center',gap:6,
                    boxShadow:'0 4px 14px rgba(var(--md-primary-rgb),.3)',
                  }}>
                  <span className="material-symbols-outlined" style={{ fontSize:14 }}>check_circle</span>
                  Complete & Earn +25 XP
                </button>
              ) : (
                <div style={{ display:'flex',alignItems:'center',gap:6,padding:'6px 14px',borderRadius:100,background:'rgba(76,175,80,.1)',color:'#4CAF50',fontSize:11,fontWeight:700 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:14 }}>check_circle</span>
                  Completed
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Padding for module action bar */}
      {MODULE_PAGE_IDS.includes(page) && <div style={{ height:60 }} />}
    </div>
  );
}
