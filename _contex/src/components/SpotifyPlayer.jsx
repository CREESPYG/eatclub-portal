import { useState, useEffect, useRef, useCallback } from 'react';

/*
  🎵 YT Music Player — v3
  ────────────────────────
  • Search any song → play instantly
  • Paste YouTube links → add to playlist
  • Queue & Playlist with autoplay
  • Remembers last played + full playlist
  • Track names, artist info, thumbnails
*/

/* ── Curated Song Collections (real video IDs) ── */
const COLLECTIONS = [
  {
    id: 'hindi', emoji: '🇮🇳', label: 'Hindi Hits',
    desc: 'Bollywood & Indie Hindi',
    songs: [
      { videoId: 'vGJTaP6anOU', title: 'Tum Hi Ho', author: 'Arijit Singh' },
      { videoId: 'caGC9KnlPRQ', title: 'Kesariya', author: 'Arijit Singh' },
      { videoId: 'cYOB941gyXI', title: 'Apna Bana Le', author: 'Arijit Singh' },
      { videoId: 'JFcgObbJk6E', title: 'Chaleya', author: 'Arijit Singh' },
      { videoId: 'BddP6PYo2gs', title: 'Phir Aur Kya Chahiye', author: 'Arijit Singh' },
      { videoId: '2ips2mM7Zqw', title: 'Beloved', author: 'Anuv Jain' },
      { videoId: 'hoNb6HuNmU0', title: 'Raataan Lambiyan', author: 'Jubin Nautiyal' },
      { videoId: 'U0B-FmCJEbM', title: 'Maan Meri Jaan', author: 'King' },
      { videoId: 'Tmhm-bseeXI', title: 'Tumse Hi', author: 'Mohit Chauhan' },
      { videoId: 'IqUqEzAxjf0', title: 'Tu Hai Kahan', author: 'AUR' },
      { videoId: 'FAucVNRx_mU', title: 'Heeriye', author: 'Jasleen Royal' },
      { videoId: 's1tAYmMjLdY', title: 'Tera Ban Jaunga', author: 'Akhil Sachdeva' },
      { videoId: '-nMYxFv0FpI', title: 'Agar Tum Saath Ho', author: 'Alka Yagnik & Arijit' },
      { videoId: 'RgKAFK5djSk', title: 'See You Again', author: 'Wiz Khalifa ft. Charlie Puth' },
      { videoId: 'ZAfAud_M_mg', title: 'Tera Yaar Hoon Main', author: 'Arijit Singh' },
    ],
  },
  {
    id: 'global', emoji: '🌍', label: 'Global Top 50',
    desc: 'Worldwide chart-toppers',
    songs: [
      { videoId: 'LDU_Txk06tM', title: 'Blinding Lights', author: 'The Weeknd' },
      { videoId: 'JGwWNGJdvx8', title: 'Shape of You', author: 'Ed Sheeran' },
      { videoId: 'kJQP7kiw5Fk', title: 'Despacito', author: 'Luis Fonsi ft. Daddy Yankee' },
      { videoId: 'CevxZvSJLk8', title: 'Rockstar', author: 'Post Malone ft. 21 Savage' },
      { videoId: 'RBumgq5yVrA', title: 'Photograph', author: 'Ed Sheeran' },
      { videoId: 'bo_efYhYU2A', title: 'Starboy', author: 'The Weeknd ft. Daft Punk' },
      { videoId: 'pRpeEdMmmQ0', title: 'Shake It Off', author: 'Taylor Swift' },
      { videoId: 'fJ9rUzIMcZQ', title: 'Bohemian Rhapsody', author: 'Queen' },
      { videoId: 'hTWKbfoikeg', title: 'Smells Like Teen Spirit', author: 'Nirvana' },
      { videoId: '60ItHLz5WEA', title: 'Alan Walker - Faded', author: 'Alan Walker' },
      { videoId: 'ktvTqknDobU', title: 'Imagine', author: 'John Lennon' },
      { videoId: 'JRfuAukYTKg', title: 'Uptown Funk', author: 'Bruno Mars' },
      { videoId: 'OPf0YbXqDm0', title: 'Uptown Funk', author: 'Mark Ronson ft. Bruno Mars' },
      { videoId: 'SlPhMPnQ58k', title: 'Counting Stars', author: 'OneRepublic' },
      { videoId: 'YQHsXMglC9A', title: 'Hello', author: 'Adele' },
      { videoId: 'hT_nvWreIhg', title: 'Counting Stars', author: 'OneRepublic' },
      { videoId: 'lp-EO5I60KA', title: 'Somebody That I Used To Know', author: 'Gotye' },
    ],
  },
  {
    id: 'romance', emoji: '💕', label: 'Bollywood Romance',
    desc: 'Romantic Hindi melodies',
    songs: [
      { videoId: 'KsBpJMDcXuA', title: 'Kal Ho Naa Ho', author: 'Sonu Nigam' },
      { videoId: 'GlpGNlCHKEk', title: 'Tere Bina', author: 'A.R. Rahman' },
      { videoId: 'oUs6Cq07_O0', title: 'Pee Loon', author: 'Mohit Chauhan' },
      { videoId: 'luPaJKbYBOg', title: 'Tum Se Hi', author: 'Mohit Chauhan' },
      { videoId: 'urM6s8iuBCc', title: 'Kabira', author: 'Arijit Singh & Tochi' },
      { videoId: 'XYxrMqHbP44', title: 'Hawayein', author: 'Arijit Singh' },
      { videoId: 'AhXSPZGgkYI', title: 'Channa Mereya', author: 'Arijit Singh' },
      { videoId: 'SMMiTb8dSuA', title: 'Tujhe Kitna Chahne Lage', author: 'Arijit Singh' },
      { videoId: 'fSS_R91Nimw', title: 'Dil Diyan Gallan', author: 'Atif Aslam' },
      { videoId: 'DVEUyPoxn8A', title: 'Humdard', author: 'Arijit Singh' },
      { videoId: 'cYV-JhJRYXk', title: 'Ilahi', author: 'Arijit Singh' },
      { videoId: 'L-5YUszI6j4', title: 'Banjaara', author: 'Mohammed Irfan' },
    ],
  },
  {
    id: 'punjabi', emoji: '🎧', label: 'Punjabi Fire',
    desc: 'Top Punjabi bangers',
    songs: [
      { videoId: 'DuCplFxjhU8', title: 'Excuses', author: 'AP Dhillon' },
      { videoId: 'gCYcHz2k5x0', title: 'Animals', author: 'Maroon 5' },
      { videoId: 'M5azNpTwVk8', title: 'Brown Munde', author: 'AP Dhillon' },
      { videoId: 'Kkpp2DVmHnE', title: 'Lover', author: 'Diljit Dosanjh' },
      { videoId: 'w_u-AiqHxDg', title: 'Naina', author: 'Diljit Dosanjh' },
      { videoId: 'psBRF5lJg2s', title: 'Insane', author: 'AP Dhillon' },
      { videoId: 'LkSwcri2oZ4', title: 'No Love', author: 'Shubh' },
      { videoId: 'aL_l8GJQHMU', title: 'Elevated', author: 'Shubh' },
      { videoId: 'KHMR0GkC5s4', title: 'Still Rollin', author: 'Shubh' },
      { videoId: 'ZZwbddBqJRw', title: 'We Rollin', author: 'Shubh' },
      { videoId: 'O3m7JHJwMbI', title: 'Jatt Da Muqabala', author: 'Sidhu Moosewala' },
      { videoId: 'yNjVLy5bGLs', title: '295', author: 'Sidhu Moosewala' },
    ],
  },
  {
    id: 'pop', emoji: '🌟', label: 'English Pop',
    desc: 'Pop & indie essentials',
    songs: [
      { videoId: 'HCjNJDNzw8Y', title: 'Love Yourself', author: 'Justin Bieber' },
      { videoId: '450p7goxZqg', title: 'Stay', author: 'The Kid LAROI & Justin Bieber' },
      { videoId: 'E07s5ZYadMY', title: 'Closer', author: 'The Chainsmokers ft. Halsey' },
      { videoId: 'psuRGfAaju4', title: 'One Dance', author: 'Drake ft. Wizkid' },
      { videoId: 'ru0K8uYEZWw', title: 'Thunder', author: 'Imagine Dragons' },
      { videoId: 'kXYiU_JCYtU', title: 'Levitating', author: 'Dua Lipa' },
      { videoId: 'TUVcZfQe-Kw', title: 'Watermelon Sugar', author: 'Harry Styles' },
      { videoId: 'lY2yjAdbvdQ', title: 'Sunflower', author: 'Post Malone & Swae Lee' },
      { videoId: 'mRD0-GxKHVo', title: 'Night Changes', author: 'One Direction' },
      { videoId: 'VuNIsY6JdUw', title: 'Treat You Better', author: 'Shawn Mendes' },
      { videoId: 'Zi_XLOBDo_Y', title: 'Believer', author: 'Imagine Dragons' },
      { videoId: 'iPUmE-tne5U', title: 'Lose Yourself', author: 'Eminem' },
    ],
  },
  {
    id: 'lofi', emoji: '🌙', label: 'Lo-Fi & Chill',
    desc: 'Study / relax / work',
    songs: [
      { videoId: 'lTRiuFIWV54', title: 'Let Her Go', author: 'Passenger' },
      { videoId: 'WJ-wxX5a1qY', title: 'Khairiyat', author: 'Arijit Singh' },
      { videoId: 'eZR7CKVJ8Y0', title: 'Sahiba', author: 'Arijit Singh' },
      { videoId: '1GCf29FPM4k', title: 'Lo-Fi Hindi Mix', author: 'Various' },
      { videoId: 'UPb84NkF6dw', title: 'Sanam Re', author: 'Arijit Singh' },
      { videoId: 'a3ILbgo7rng', title: 'Aaoge Jab Tum', author: 'Ustad Rashid Khan' },
      { videoId: 'i8gRGBeiKHI', title: 'Kun Faya Kun', author: 'A.R. Rahman' },
      { videoId: 'y3xE3xXqHOk', title: 'Tujhe Dekha To', author: 'Kumar Sanu & Lata' },
      { videoId: 'wDjeBNv6ip0', title: 'Lo-Fi Bollywood', author: 'Chill Mix' },
      { videoId: 'Sp4yG96Lb1A', title: 'Sajni', author: 'Arijit Singh' },
    ],
  },
];

const DEFAULT_VOLUME = 20;
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.lunar.icu',
  'https://api.piped.victr.me',
  'https://pipedapi-libre.kavin.rocks',
];

const fmt = (s) => {
  if (!s || s <= 0) return '0:00';
  s = Math.floor(s);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
const fmtViews = (n) => {
  if (!n) return '';
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
};
const getThumb = (id) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

/* Extract YouTube video ID from various URL formats */
const extractVideoId = (input) => {
  if (!input) return null;
  const clean = input.trim();
  // Direct video ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  // youtube.com/watch?v=ID
  const m1 = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (m1) return m1[1];
  // youtu.be/ID
  const m2 = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m2) return m2[1];
  // youtube.com/embed/ID
  const m3 = clean.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (m3) return m3[1];
  // music.youtube.com/watch?v=ID
  const m4 = clean.match(/music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  if (m4) return m4[1];
  // youtube.com/shorts/ID
  const m5 = clean.match(/shorts\/([a-zA-Z0-9_-]{11})/);
  if (m5) return m5[1];
  return null;
};

export default function SpotifyPlayer() {
  // ─── Core ───
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('player'); // 'player' | 'search' | 'queue' | 'playlist' | 'browse'
  const [browseCollection, setBrowseCollection] = useState(null); // expanded collection id
  const [isPlaying, setIsPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(() => {
    const s = localStorage.getItem('ytm_vol');
    return s ? parseInt(s) : DEFAULT_VOLUME;
  });
  const [shuffle, setShuffle] = useState(false);

  // ─── Track ───
  const [track, setTrack] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ytm_last_track')) || null; } catch { return null; }
  });

  // ─── Queue (auto-play list) ───
  const [queue, setQueue] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ytm_queue')) || []; } catch { return []; }
  });
  const [queueIdx, setQueueIdx] = useState(() => {
    const s = localStorage.getItem('ytm_queue_idx');
    return s ? parseInt(s) : 0;
  });

  // ─── Saved Playlist (user's collection) ───
  const [playlist, setPlaylist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ytm_playlist')) || []; } catch { return []; }
  });

  // ─── Search ───
  const [searchQ, setSearchQ] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ytm_history')) || []; } catch { return []; }
  });

  // ─── Add song by link ───
  const [linkInput, setLinkInput] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkMsg, setLinkMsg] = useState('');

  // ─── Refs ───
  const playerRef = useRef(null);
  const panelRef = useRef(null);
  const timerRef = useRef(null);
  const apiReady = useRef(false);
  const started = useRef(false);
  const searchRef = useRef(null);
  const shuffleRef = useRef(false);

  // ─── Quick picks ───
  const PICKS = [
    '🔥 Trending Hindi 2025', '🎤 Arijit Singh', '💕 Romantic Bollywood',
    '🎧 AP Dhillon', '🌎 English Pop Hits', '📚 Lo-Fi Study',
    '🎸 Punjabi Songs', '🌙 Night Drive Mix', '💪 Workout Beats',
    '✨ KK Best Songs', '🎵 Diljit Dosanjh', '🕰️ 90s Hindi Classics',
  ];

  // ═══ YOUTUBE API ═══
  useEffect(() => {
    if (window.YT?.Player) { apiReady.current = true; return; }
    if (document.getElementById('yt-api-script')) return;
    const s = document.createElement('script');
    s.id = 'yt-api-script';
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    document.head.appendChild(s);
    window.onYouTubeIframeAPIReady = () => { apiReady.current = true; };
  }, []);

  // ═══ CREATE PLAYER ═══
  const createPlayer = useCallback(function initPlayer(videoId) {
    if (!apiReady.current || !window.YT?.Player) {
      setTimeout(() => initPlayer(videoId), 500);
      return;
    }
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch (error) { void error; }
      playerRef.current = null;
    }

    playerRef.current = new window.YT.Player('ytm-player-div', {
      height: '0', width: '0',
      videoId,
      playerVars: {
        autoplay: started.current ? 1 : 0,
        controls: 0, disablekb: 1, fs: 0,
        modestbranding: 1, rel: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: (e) => {
          e.target.setVolume(vol);
          syncTrackInfo();
        },
        onStateChange: (ev) => {
          const st = ev.data;
          if (st === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true); syncTrackInfo(); startTimer();
          } else if (st === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false); stopTimer();
          } else if (st === window.YT.PlayerState.ENDED) {
            setIsPlaying(false); stopTimer(); autoplayNext();
          } else if (st === window.YT.PlayerState.BUFFERING) {
            syncTrackInfo();
          }
        },
        onError: (e) => console.warn('YT error:', e.data),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vol]);

  // ═══ SYNC TRACK ═══
  const syncTrackInfo = () => {
    if (!playerRef.current?.getVideoData) return;
    try {
      const d = playerRef.current.getVideoData();
      if (d.title && d.video_id) {
        const t = { title: d.title, videoId: d.video_id, author: d.author || '' };
        setTrack(t);
        localStorage.setItem('ytm_last_track', JSON.stringify(t));
      }
      setDur(playerRef.current.getDuration?.() || 0);
    } catch (error) { void error; }
  };

  // ═══ TIMER ═══
  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setPos(playerRef.current.getCurrentTime() || 0);
        setDur(playerRef.current.getDuration() || 0);
      }
    }, 400);
  };
  const stopTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  useEffect(() => () => stopTimer(), []);

  // ═══ AUTOPLAY NEXT ═══
  const autoplayNext = () => {
    if (queue.length > 0 && queueIdx < queue.length - 1) {
      const ni = queueIdx + 1;
      setQueueIdx(ni);
      localStorage.setItem('ytm_queue_idx', ni);
      playSong(queue[ni], false);
    } else {
      // Autoplay similar songs from collections
      const currentId = track?.videoId;
      const allSongs = COLLECTIONS.flatMap(c => c.songs);
      const remaining = allSongs.filter(s => s.videoId !== currentId);
      if (remaining.length > 0) {
        const randomSong = remaining[Math.floor(Math.random() * remaining.length)];
        playSong(randomSong, true);
      }
    }
  };

  // ═══ PLAY SONG ═══
  const playSong = useCallback((song, addToQueue = true) => {
    if (!song?.videoId) return;
    started.current = true;
    setTrack(song);
    localStorage.setItem('ytm_last_track', JSON.stringify(song));

    if (addToQueue) {
      setQueue(prev => {
        const exists = prev.findIndex(q => q.videoId === song.videoId);
        let nq;
        if (exists >= 0) {
          nq = prev;
          setQueueIdx(exists);
          localStorage.setItem('ytm_queue_idx', exists);
        } else {
          nq = [...prev, song];
          const ni = nq.length - 1;
          setQueueIdx(ni);
          localStorage.setItem('ytm_queue_idx', ni);
        }
        localStorage.setItem('ytm_queue', JSON.stringify(nq.slice(-100)));
        return nq;
      });
    }

    createPlayer(song.videoId);
    setPos(0); setDur(0);
  }, [createPlayer]);

  // ═══ INIT ═══
  useEffect(() => {
    const timer = setInterval(() => {
      if (!apiReady.current) return;
      clearInterval(timer);
      if (track?.videoId) {
        createPlayer(track.videoId); // Don't autoplay on load
      }
    }, 300);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ═══ PERSIST ═══
  useEffect(() => { localStorage.setItem('ytm_vol', vol); }, [vol]);
  useEffect(() => { localStorage.setItem('ytm_playlist', JSON.stringify(playlist)); }, [playlist]);

  // ═══ OUTSIDE CLICK ═══
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  // ═══ SEARCH ═══
  const doSearch = async (q) => {
    if (!q.trim()) return;
    setSearching(true); setResults([]);
    setHistory(prev => {
      const up = [q.trim(), ...prev.filter(h => h.toLowerCase() !== q.trim().toLowerCase())].slice(0, 20);
      localStorage.setItem('ytm_history', JSON.stringify(up));
      return up;
    });
    for (const inst of PIPED_INSTANCES) {
      try {
        const r = await fetch(`${inst}/search?q=${encodeURIComponent(q.trim() + ' song')}&filter=videos`, { signal: AbortSignal.timeout(8000) });
        if (!r.ok) continue;
        const data = await r.json();
        if (!data.items) continue;
        const songs = data.items
          .filter(i => i.type === 'stream' && i.url && i.duration > 30 && i.duration < 600)
          .slice(0, 25)
          .map(i => ({ 
            videoId: i.url.split('v=')[1] || i.url.split('/').pop(), 
            title: i.title, 
            author: i.uploaderName || i.author, 
            duration: i.duration, 
            views: i.uploaderVerified ? 1000000 : 0 
          }));
        setResults(songs);
        setSearching(false);
        return;
      } catch { continue; }
    }
    setSearching(false);
  };

  // ═══ ADD BY YOUTUBE LINK ═══
  const addByLink = async () => {
    const id = extractVideoId(linkInput);
    if (!id) {
      setLinkMsg('❌ Invalid YouTube link. Paste a valid URL.');
      setTimeout(() => setLinkMsg(''), 3000);
      return;
    }
    // Check if already in playlist
    if (playlist.some(s => s.videoId === id)) {
      setLinkMsg('⚠️ Song already in your playlist.');
      setTimeout(() => setLinkMsg(''), 3000);
      return;
    }
    setLinkLoading(true);
    setLinkMsg('');
    // Fetch title via Piped
    let song = { videoId: id, title: 'Loading...', author: '' };
    for (const inst of PIPED_INSTANCES) {
      try {
        const r = await fetch(`${inst}/streams/${id}`, { signal: AbortSignal.timeout(6000) });
        if (!r.ok) continue;
        const d = await r.json();
        if (d.title) {
          song = { videoId: id, title: d.title, author: d.uploader || d.author || '', duration: d.duration || 0 };
        }
        break;
      } catch { continue; }
    }
    if (song.title === 'Loading...') {
      // Fallback — still add with video ID as title
      song.title = `YouTube Song (${id})`;
    }
    setPlaylist(prev => [...prev, song]);
    setLinkInput('');
    setLinkLoading(false);
    setLinkMsg(`✅ Added: ${song.title}`);
    setTimeout(() => setLinkMsg(''), 3000);
  };

  // ═══ PLAYLIST ACTIONS ═══
  const addToPlaylist = (song) => {
    if (playlist.some(s => s.videoId === song.videoId)) return;
    setPlaylist(prev => [...prev, song]);
  };
  const removeFromPlaylist = (idx) => {
    setPlaylist(prev => prev.filter((_, i) => i !== idx));
  };
  const playAllPlaylist = () => {
    if (playlist.length === 0) return;
    setQueue(playlist);
    localStorage.setItem('ytm_queue', JSON.stringify(playlist));
    setQueueIdx(0);
    localStorage.setItem('ytm_queue_idx', 0);
    playSong(playlist[0], false);
    setView('player');
  };

  // ═══ COLLECTION ACTIONS ═══
  const playCollection = (col) => {
    if (!col.songs.length) return;
    setQueue(col.songs);
    localStorage.setItem('ytm_queue', JSON.stringify(col.songs));
    setQueueIdx(0);
    localStorage.setItem('ytm_queue_idx', 0);
    playSong(col.songs[0], false);
    setView('player');
  };
  const addCollectionToPlaylist = (col) => {
    setPlaylist(prev => {
      const existing = new Set(prev.map(s => s.videoId));
      const newSongs = col.songs.filter(s => !existing.has(s.videoId));
      const updated = [...prev, ...newSongs];
      localStorage.setItem('ytm_playlist', JSON.stringify(updated));
      return updated;
    });
  };

  // ═══ QUEUE ACTIONS ═══
  const removeFromQueue = (idx) => {
    setQueue(prev => {
      const nq = prev.filter((_, i) => i !== idx);
      localStorage.setItem('ytm_queue', JSON.stringify(nq));
      if (idx < queueIdx) setQueueIdx(p => { localStorage.setItem('ytm_queue_idx', p - 1); return p - 1; });
      return nq;
    });
  };
  const clearQueue = () => { setQueue([]); setQueueIdx(0); localStorage.removeItem('ytm_queue'); localStorage.removeItem('ytm_queue_idx'); };
  const addToQueueNext = (song) => {
    setQueue(prev => {
      const nq = [...prev];
      nq.splice(queueIdx + 1, 0, song);
      localStorage.setItem('ytm_queue', JSON.stringify(nq));
      return nq;
    });
  };

  // ═══ CONTROLS ═══
  const togglePlay = () => {
    if (!playerRef.current) return;
    if (!started.current) { started.current = true; playerRef.current.playVideo(); return; }
    isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };
  const seek = (e) => {
    if (!dur || !playerRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    playerRef.current.seekTo(p * dur, true);
    setPos(p * dur);
  };
  const setVolFn = (v) => { setVol(v); playerRef.current?.setVolume?.(v); };
  const prev = () => {
    if (queue.length > 0 && queueIdx > 0) { const ni = queueIdx - 1; setQueueIdx(ni); localStorage.setItem('ytm_queue_idx', ni); playSong(queue[ni], false); }
  };
  const next = () => {
    if (queue.length > 0 && queueIdx < queue.length - 1) { const ni = queueIdx + 1; setQueueIdx(ni); localStorage.setItem('ytm_queue_idx', ni); playSong(queue[ni], false); }
  };
  const toggleShuffle = () => {
    setShuffle(p => { shuffleRef.current = !p; return !p; });
  };

  const progress = dur > 0 ? Math.min(pos / dur, 1) : 0;
  const displayTitle = track?.title || 'Ready to play';
  const displayArtist = track?.author || '';

  // ═══ RENDER ═══
  return (
    <div className="sp-widget" ref={panelRef}>
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div id="ytm-player-div" />
      </div>

      {/* ─── Topbar Pill ─── */}
      <button id="spotify-trigger-btn"
        className={`spotify-pill-btn ${open ? 'active' : ''} ${isPlaying ? 'sp-pill-playing' : ''}`}
        onClick={() => setOpen(!open)}>
        <span className={`spotify-bars ${isPlaying ? 'playing' : ''}`}><span /><span /><span /><span /></span>
        <span className="spotify-pill-label">{isPlaying ? `♫ ${displayTitle}` : 'YT Music'}</span>
        <YTIcon size={14} className="spotify-logo-icon" />
      </button>

      {/* ─── Panel ─── */}
      <div className="scw-panel" id="music-player-panel" style={{
        visibility: open ? 'visible' : 'hidden', opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.97)',
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.22s ease, transform 0.24s cubic-bezier(0.34,1.56,0.64,1)',
        width: view === 'search' ? '400px' : '310px',
      }}>

        {/* Header */}
        <div className="scw-header">
          <div className="scw-header-left">
            <YTIcon size={18} color="#FF0000" />
            <span className="scw-title">YT Music</span>
            {isPlaying && <span className="scw-live" />}
          </div>
          <div className="scw-header-right">
            {isPlaying && <span className="scw-playing-tag"><span className="material-symbols-outlined" style={{ fontSize: 12 }}>volume_up</span>Live</span>}
            <button className="scw-close" onClick={() => setOpen(false)}><span className="material-symbols-outlined">remove</span></button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { id: 'player', icon: 'music_note', label: 'Now' },
            { id: 'search', icon: 'search', label: 'Search' },
            { id: 'browse', icon: 'album', label: 'Browse' },
            { id: 'queue', icon: 'queue_music', label: `Queue${queue.length ? ` (${queue.length})` : ''}` },
            { id: 'playlist', icon: 'library_music', label: `My List${playlist.length ? ` (${playlist.length})` : ''}` },
          ].map(t => (
            <button key={t.id} onClick={() => { setView(t.id); if (t.id === 'search') setTimeout(() => searchRef.current?.focus(), 100); }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
                padding: '6px 1px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: view === t.id ? 'rgba(255,0,0,0.15)' : 'rgba(255,255,255,0.04)',
                color: view === t.id ? '#FF4444' : 'rgba(255,255,255,0.45)',
                fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, transition: 'all 0.15s',
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ════ NOW PLAYING ════ */}
        {view === 'player' && (
          <>
            {/* Track art + info */}
            <div style={{ padding: '12px 16px 8px', display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                background: 'rgba(255,255,255,0.06)',
                boxShadow: isPlaying ? '0 4px 20px rgba(255,0,0,0.25)' : 'none',
              }}>
                {track?.videoId ? (
                  <img src={getThumb(track.videoId)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'rgba(255,255,255,0.15)' }}>music_note</span>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayTitle}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayArtist}</div>
                {queue.length > 0 && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>Queue: {queueIdx + 1}/{queue.length}</div>}
              </div>
              {/* Save to playlist button */}
              {track?.videoId && (
                <button onClick={() => addToPlaylist(track)} title={playlist.some(s => s.videoId === track.videoId) ? 'Already saved' : 'Save to My List'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: playlist.some(s => s.videoId === track.videoId) ? '#FF4444' : 'rgba(255,255,255,0.2)', display: 'flex', padding: 4, transition: 'color 0.15s' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{playlist.some(s => s.videoId === track.videoId) ? 'favorite' : 'favorite_border'}</span>
                </button>
              )}
            </div>

            {/* Progress */}
            <div className="scw-progress">
              <span className="scw-time">{fmt(pos)}</span>
              <div className="scw-prog-track" onClick={seek}><div className="scw-prog-fill" style={{ width: `${progress * 100}%` }}><div className="scw-prog-thumb" /></div></div>
              <span className="scw-time">{fmt(dur)}</span>
            </div>

            {/* Controls */}
            <div className="scw-controls">
              <button className={`scw-btn-shuffle ${shuffle ? 'active' : ''}`} onClick={toggleShuffle}><span className="material-symbols-outlined">shuffle</span></button>
              <button className="scw-btn-skip" onClick={prev}><span className="material-symbols-outlined">skip_previous</span></button>
              <button className={`scw-btn-play ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}><span className="material-symbols-outlined">{isPlaying ? 'pause' : 'play_arrow'}</span></button>
              <button className="scw-btn-skip" onClick={next}><span className="material-symbols-outlined">skip_next</span></button>
              <div style={{ width: 24 }} />
            </div>

            {/* Volume */}
            <div className="scw-volume">
              <button className="scw-vol-icon" onClick={() => setVolFn(vol === 0 ? DEFAULT_VOLUME : 0)}>
                <span className="material-symbols-outlined">{vol === 0 ? 'volume_off' : vol < 30 ? 'volume_down' : 'volume_up'}</span>
              </button>
              <div className="scw-vol-track">
                <div className="scw-vol-fill" style={{ width: `${vol}%` }} />
                <input type="range" min="0" max="100" value={vol} onChange={e => setVolFn(+e.target.value)} className="scw-vol-slider" />
              </div>
              <span className="scw-vol-num">{vol}%</span>
            </div>
          </>
        )}

        {/* ════ SEARCH ════ */}
        {view === 'search' && (
          <div style={{ maxHeight: 400, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,0,0,0.3) transparent' }}>
            <form onSubmit={(e) => { e.preventDefault(); doSearch(searchQ); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 12px 8px', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '0 10px', transition: 'border-color 0.2s' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(255,255,255,0.35)' }}>search</span>
              <input ref={searchRef} value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Search any song, artist..."
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontFamily: 'var(--font-body)', fontSize: 13, padding: '10px 0' }} />
              {searchQ && (
                <button type="button" onClick={() => { setSearchQ(''); setResults([]); }}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', padding: 2 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                </button>
              )}
            </form>

            {/* Searching */}
            {searching && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '30px 16px', color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,0,0,0.2)', borderTopColor: '#FF0000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Searching...
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, padding: '4px 14px', color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>{results.length} SONGS</div>
                {results.map((r, i) => (
                  <div key={r.videoId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', transition: 'background 0.15s', animation: `fadeIn 0.2s ${i * 0.03}s ease both` }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    {/* Play button */}
                    <button onClick={() => { playSong(r); setView('player'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#fff', fontFamily: 'var(--font-body)', overflow: 'hidden' }}>
                      <div style={{ position: 'relative', width: 48, height: 36, borderRadius: 5, overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.06)' }}>
                        <img src={getThumb(r.videoId)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        <span style={{ position: 'absolute', bottom: 1, right: 1, background: 'rgba(0,0,0,0.85)', color: '#fff', fontSize: 8, fontWeight: 700, padding: '0 3px', borderRadius: 2, fontFamily: 'var(--font-mono)' }}>{fmt(r.duration)}</span>
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'rgba(255,255,255,0.9)' }}>{r.title}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', display: 'flex', gap: 4 }}>
                          <span>{r.author}</span>
                          {r.views > 0 && <span>• {fmtViews(r.views)} views</span>}
                        </div>
                      </div>
                    </button>
                    {/* Actions */}
                    <button onClick={() => addToQueueNext(r)} title="Play next"
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', padding: 2, transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#FF4444'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }} title="Add to queue">queue_music</span>
                    </button>
                    <button onClick={() => addToPlaylist(r)} title={playlist.some(s => s.videoId === r.videoId) ? 'Saved' : 'Save to My List'}
                      style={{ background: 'none', border: 'none', color: playlist.some(s => s.videoId === r.videoId) ? '#FF4444' : 'rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', padding: 2, transition: 'color 0.15s' }}
                      onMouseEnter={e => { if (!playlist.some(s => s.videoId === r.videoId)) e.currentTarget.style.color = '#FF4444'; }}
                      onMouseLeave={e => { if (!playlist.some(s => s.videoId === r.videoId)) e.currentTarget.style.color = 'rgba(255,255,255,0.2)'; }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{playlist.some(s => s.videoId === r.videoId) ? 'favorite' : 'favorite_border'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* No results */}
            {!searching && results.length === 0 && searchQ && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 16px', color: 'rgba(255,255,255,0.3)', fontSize: 12, gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, opacity: 0.3 }}>search_off</span>
                No songs found. Try another search.
              </div>
            )}

            {/* Quick picks & history */}
            {!searching && results.length === 0 && !searchQ && (
              <div style={{ padding: '4px 12px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5, marginBottom: 8 }}>QUICK PICKS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {PICKS.map((p, i) => (
                    <button key={i} onClick={() => { const q = p.replace(/^[^\s]+\s/, ''); setSearchQ(q); doSearch(q); }}
                      style={{ padding: '5px 11px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,0,0,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,0,0,0.35)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                      {p}
                    </button>
                  ))}
                </div>
                {history.length > 0 && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>RECENT</span>
                      <button onClick={() => { setHistory([]); localStorage.removeItem('ytm_history'); }}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 10, fontWeight: 600 }}>Clear</button>
                    </div>
                    {history.slice(0, 8).map((h, i) => (
                      <button key={i} onClick={() => { setSearchQ(h); doSearch(h); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '6px 4px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)', fontSize: 12, cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, opacity: 0.4 }}>history</span>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════ BROWSE ════ */}
        {view === 'browse' && (
          <div style={{ maxHeight: 400, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,0,0,0.3) transparent' }}>
            <div style={{ fontSize: 10, fontWeight: 700, padding: '8px 14px 4px', color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>CURATED COLLECTIONS</div>
            {COLLECTIONS.map(col => (
              <div key={col.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {/* Collection header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px 6px' }}>
                  <span style={{ fontSize: 24 }}>{col.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{col.label}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{col.songs.length} songs • {col.desc}</div>
                  </div>
                </div>
                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 6, padding: '0 14px 8px' }}>
                  <button onClick={() => playCollection(col)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(255,0,0,0.3)', background: 'rgba(255,0,0,0.12)', color: '#FF4444', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,0,0,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,0,0,0.12)'}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>play_arrow</span> Play All
                  </button>
                  <button onClick={() => addCollectionToPlaylist(col)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>library_add</span> Save All
                  </button>
                  <button onClick={() => setBrowseCollection(browseCollection === col.id ? null : col.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '5px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', background: browseCollection === col.id ? 'rgba(255,0,0,0.12)' : 'rgba(255,255,255,0.05)', color: browseCollection === col.id ? '#FF4444' : 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', marginLeft: 'auto' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{browseCollection === col.id ? 'expand_less' : 'expand_more'}</span>
                    {browseCollection === col.id ? 'Hide' : 'Songs'}
                  </button>
                </div>
                {/* Expanded song list */}
                {browseCollection === col.id && (
                  <div style={{ padding: '0 8px 8px' }}>
                    {col.songs.map((s, i) => (
                      <div key={s.videoId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px', borderRadius: 6, transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <button onClick={() => { playSong(s); setView('player'); }}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#fff', fontFamily: 'var(--font-body)', overflow: 'hidden' }}>
                          <span style={{ width: 16, fontSize: 10, color: track?.videoId === s.videoId ? '#FF4444' : 'rgba(255,255,255,0.3)', textAlign: 'center', flexShrink: 0 }}>
                            {track?.videoId === s.videoId && isPlaying ? '▶' : i + 1}
                          </span>
                          <img src={getThumb(s.videoId)} alt="" style={{ width: 36, height: 27, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: track?.videoId === s.videoId ? '#FF4444' : 'rgba(255,255,255,0.85)' }}>{s.title}</div>
                            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{s.author}</div>
                          </div>
                        </button>
                        <button onClick={() => addToPlaylist(s)} title="Save"
                          style={{ background: 'none', border: 'none', color: playlist.some(p => p.videoId === s.videoId) ? '#FF4444' : 'rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', padding: 2, transition: 'color 0.15s' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{playlist.some(p => p.videoId === s.videoId) ? 'favorite' : 'favorite_border'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ════ QUEUE ════ */}
        {view === 'queue' && (
          <div style={{ maxHeight: 360, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,0,0,0.3) transparent' }}>
            {queue.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 16px', color: 'rgba(255,255,255,0.3)', fontSize: 12, gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, opacity: 0.3 }}>queue_music</span>
                Queue is empty.<br/>Search and play songs to build it.
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px 4px' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>UP NEXT ({queue.length})</span>
                  <button onClick={clearQueue}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 10, fontWeight: 600 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#FF4444'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}>Clear all</button>
                </div>
                {queue.map((s, i) => (
                  <div key={i + s.videoId} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px',
                    background: i === queueIdx ? 'rgba(255,0,0,0.08)' : 'none',
                    borderLeft: i === queueIdx ? '3px solid #FF0000' : '3px solid transparent',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => { if (i !== queueIdx) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (i !== queueIdx) e.currentTarget.style.background = 'none'; }}>
                    <button onClick={() => { setQueueIdx(i); localStorage.setItem('ytm_queue_idx', i); playSong(s, false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#fff', fontFamily: 'var(--font-body)', overflow: 'hidden' }}>
                      <span style={{ width: 16, fontSize: 10, color: i === queueIdx ? '#FF4444' : 'rgba(255,255,255,0.3)', textAlign: 'center', flexShrink: 0 }}>
                        {i === queueIdx && isPlaying ? '▶' : i + 1}
                      </span>
                      <img src={getThumb(s.videoId)} alt="" style={{ width: 36, height: 27, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: i === queueIdx ? '#FF4444' : 'rgba(255,255,255,0.85)' }}>{s.title}</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{s.author}</div>
                      </div>
                    </button>
                    <button onClick={() => removeFromQueue(i)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', padding: 2, transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#FF4444'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.15)'}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ════ MY PLAYLIST ════ */}
        {view === 'playlist' && (
          <div style={{ maxHeight: 400, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,0,0,0.3) transparent' }}>

            {/* Add by YouTube link */}
            <div style={{ padding: '10px 12px 6px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5, marginBottom: 6 }}>ADD FROM YOUTUBE LINK</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input value={linkInput} onChange={e => setLinkInput(e.target.value)}
                  placeholder="Paste YouTube URL here..."
                  onKeyDown={e => e.key === 'Enter' && addByLink()}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 12px', color: '#fff', fontFamily: 'var(--font-body)', fontSize: 12, outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,0,0,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
                <button onClick={addByLink} disabled={linkLoading || !linkInput.trim()}
                  style={{
                    background: linkInput.trim() ? '#FF0000' : 'rgba(255,255,255,0.1)',
                    border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 10,
                    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, cursor: linkInput.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.15s', opacity: linkInput.trim() ? 1 : 0.5,
                  }}>
                  {linkLoading ? (
                    <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                  )}
                  Add
                </button>
              </div>
              {linkMsg && <div style={{ fontSize: 11, marginTop: 6, color: linkMsg.startsWith('✅') ? '#4CAF50' : linkMsg.startsWith('⚠') ? '#FFC107' : '#FF5252', fontWeight: 600 }}>{linkMsg}</div>}
            </div>

            {/* Play all + count */}
            {playlist.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 14px 4px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>MY SONGS ({playlist.length})</span>
                <button onClick={playAllPlaylist}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,0,0,0.15)', border: '1px solid rgba(255,0,0,0.3)', color: '#FF4444', padding: '4px 10px', borderRadius: 20, fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,0,0,0.25)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,0,0,0.15)'; }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>play_arrow</span>
                  Play All
                </button>
              </div>
            )}

            {/* Playlist items */}
            {playlist.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', color: 'rgba(255,255,255,0.3)', fontSize: 12, gap: 8, textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, opacity: 0.3 }}>library_music</span>
                Your playlist is empty.<br/>Search songs or paste YouTube links to add.
              </div>
            ) : (
              playlist.map((s, i) => (
                <div key={i + s.videoId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <button onClick={() => { playSong(s); setView('player'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#fff', fontFamily: 'var(--font-body)', overflow: 'hidden' }}>
                    <span style={{ width: 16, fontSize: 10, color: track?.videoId === s.videoId ? '#FF4444' : 'rgba(255,255,255,0.3)', textAlign: 'center', flexShrink: 0 }}>
                      {track?.videoId === s.videoId && isPlaying ? '▶' : i + 1}
                    </span>
                    <img src={getThumb(s.videoId)} alt="" style={{ width: 40, height: 30, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: track?.videoId === s.videoId ? '#FF4444' : 'rgba(255,255,255,0.85)' }}>{s.title}</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{s.author}</div>
                    </div>
                  </button>
                  <button onClick={() => removeFromPlaylist(i)} title="Remove from playlist"
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', padding: 2, transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#FF4444'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.15)'}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="scw-footer">
          <span className="scw-footer-note">{isPlaying ? '🎵 Music continues when minimised' : '🎵 Search songs or paste YouTube links'}</span>
          <a href="https://music.youtube.com" target="_blank" rel="noopener noreferrer" className="scw-footer-link">
            <YTIcon size={10} color="#FF0000" /> YT Music
          </a>
        </div>
      </div>
    </div>
  );
}

function YTIcon({ size = 16, color = '#FF0000', className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill={color} width={size} height={size} className={className} style={{ flexShrink: 0 }}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}
