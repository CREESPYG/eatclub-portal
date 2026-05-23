import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../firebase';
import { ref as dbRef, onValue, update } from 'firebase/database';
import NoticeBubble, { getDateSeparators } from '../components/NoticeBubble';

const FILTERS = [
  { value: 'all', label: 'All', icon: 'campaign' },
  { value: 'pinned', label: 'Pinned', icon: 'keep' },
  { value: 'unread', label: 'Unread', icon: 'mark_email_unread' },
];

export default function NoticeBoard({ user }) {
  const [notices, setNotices] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [scrollBtn, setScrollBtn] = useState(false);
  const feedRef = useRef(null);
  const prevLengthRef = useRef(0);

  const uid = user?.uid || localStorage.getItem('eatclub_uid');

  const [ackAnim, setAckAnim] = useState(null);
  const handleAcknowledge = useCallback((notice) => {
    if (!uid) return;
    const nid = notice.id;
    update(dbRef(db, `notices/${nid}/readBy/${uid}`), Date.now()).then(() => {
      setAckAnim(nid);
      setTimeout(() => setAckAnim(null), 400);
    }).catch((err) => {
      console.error("Acknowledge failed:", err);
    });
  }, [uid]);

  useEffect(() => {
    const r = dbRef(db, 'notices');
    const unsub = onValue(r, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, val]) => ({ id, ...val }))
          .sort((a, b) => ((b.pinnedBy && b.pinnedBy[uid]) ? 1 : 0) - ((a.pinnedBy && a.pinnedBy[uid]) ? 1 : 0) || (b.createdAt || 0) - (a.createdAt || 0));
        setNotices(list);
      } else {
        setNotices([]);
      }
    });
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    const r = dbRef(db, 'users');
    const unsub = onValue(r, (snap) => {
      const data = snap.val();
      if (data) setUsers(Object.entries(data).map(([id, val]) => ({ id, ...val })));
    });
    return () => unsub();
  }, []);

  const filtered = notices.filter((n) => {
    if (filter === 'pinned') return n.pinnedBy?.[uid] && n.active !== false;
    if (filter === 'unread') return uid && (!n.readBy || !n.readBy[uid]) && n.active !== false;
    return n.active !== false;
  });

  const seps = getDateSeparators(filtered);
  const sepSet = new Set(seps.map((s) => s.index));

  const isUnread = (n) => uid && (!n.readBy || !n.readBy[uid]);
  const unreadCount = notices.filter((n) => n.active !== false && isUnread(n)).length;

  const handlePin = useCallback((notice) => {
    const pinnedBy = { ...(notice.pinnedBy || {}) };
    if (pinnedBy[uid]) {
      delete pinnedBy[uid];
    } else {
      pinnedBy[uid] = Date.now();
    }
    update(dbRef(db, `notices/${notice.id}`), { pinnedBy, updatedAt: Date.now() });
  }, [uid]);

  const handleScroll = useCallback(() => {
    const el = feedRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAutoScroll(dist < 80);
    setScrollBtn(dist > 120);
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = feedRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (autoScroll && feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
    prevLengthRef.current = filtered.length;
  }, [filtered.length, autoScroll]);

  return (
    <div className="page-content nb-chat-page">
      <style>{`
        .nb-chat-page {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          height: auto;
          max-height: none;
          padding: 0;
          position: relative;
        }
        .nb-chat-header {
          padding: 16px 20px;
          background: var(--md-surface);
          border-bottom: 1px solid var(--md-outline);
          flex-shrink: 0;
        }
        .nb-chat-header h1 {
          font-size: 18px; font-weight: 900;
          color: var(--md-on-surface);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nb-chat-header h1 span { font-size: 20px; }
        .nb-chat-header p {
          font-size: 11px; color: var(--md-on-surface-var);
          margin: 2px 0 0;
          font-weight: 600;
        }
        .nb-chat-tabs {
          display: flex;
          gap: 4px;
          padding: 8px 20px 0;
          background: var(--md-surface);
          flex-shrink: 0;
          overflow-x: auto;
        }
        .nb-chat-tab {
          padding: 6px 14px;
          border-radius: 100px;
          border: none;
          background: transparent;
          color: var(--md-on-surface-var);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
        }
        .nb-chat-tab:hover { background: var(--md-surface-variant); color: var(--md-on-surface); }
        .nb-chat-tab.active { background: var(--md-primary); color: #fff; }
        .nb-chat-tab .badge {
          display: inline-block;
          margin-left: 4px;
          background: rgba(233,30,99,0.15);
          color: #E91E63;
          font-size: 9px;
          font-weight: 800;
          padding: 0 6px;
          border-radius: 100px;
        }
        .nb-chat-tab.active .badge { background: rgba(255,255,255,0.25); color: #fff; }

        .nb-chat-feed {
          flex: 1;
          overflow-y: auto;
          padding: 8px 16px 60px;
          scroll-behavior: smooth;
        }
        .nb-chat-feed::-webkit-scrollbar { width: 4px; }
        .nb-chat-feed::-webkit-scrollbar-track { background: transparent; }
        .nb-chat-feed::-webkit-scrollbar-thumb { background: var(--md-outline); border-radius: 4px; }

        .nb-date-sep {
          text-align: center;
          font-size: 10px;
          font-weight: 700;
          color: var(--md-on-surface-dim);
          padding: 12px 0 8px;
          position: sticky;
          top: 0;
          z-index: 2;
          background: var(--md-surface);
        }
        .nb-date-sep span {
          background: var(--md-surface-variant);
          padding: 3px 14px;
          border-radius: 100px;
          font-size: 10px;
        }

        .nb-scroll-btn {
          position: absolute;
          bottom: 20px;
          right: 24px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: var(--md-primary);
          color: #fff;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: transform 0.15s;
        }
        .nb-scroll-btn:hover { transform: scale(1.1); }
        .nb-scroll-btn .material-symbols-outlined { font-size: 18px; }

        .nb-empty-chat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          color: var(--md-on-surface-var);
          padding: 40px;
          text-align: center;
        }
        .nb-empty-chat .material-symbols-outlined {
          font-size: 48px;
          opacity: 0.12;
          margin-bottom: 12px;
        }
        .nb-empty-chat p { font-size: 14px; font-weight: 700; margin: 0 0 4px; }
        .nb-empty-chat span { font-size: 11px; opacity: 0.6; }

        .notice-ack-btn.anim-ack {
          animation: ackPop 0.4s ease;
        }
        @keyframes ackPop {
          0% { transform: scale(1); background: rgba(76,175,80,0); }
          50% { transform: scale(1.15); background: rgba(76,175,80,0.2); }
          100% { transform: scale(1); background: rgba(76,175,80,0); }
        }
        @media (max-width: 768px) {
          .nb-chat-page { flex: 1; min-height: 0; height: auto; max-height: none; }
          .nb-chat-header { padding: 12px 16px; }
          .nb-chat-header h1 { font-size: 16px; }
          .nb-chat-tabs { padding: 6px 16px 0; }
          .nb-chat-feed { padding: 6px 10px 50px; }
          .nb-chat-feed .notice-bubble-wrapper { padding: 0 4px; }
        }
      `}</style>

      <div className="nb-chat-header">
        <h1>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>campaign</span>
          Updates & Announcements
          {unreadCount > 0 && (
            <span style={{
              background: '#E91E63', color: '#fff', fontSize: 9, fontWeight: 800,
              padding: '1px 8px', borderRadius: 100, marginLeft: 4,
            }}>
              {unreadCount}
            </span>
          )}
        </h1>
        <p>Notice Board · {filtered.length} notice{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="nb-chat-tabs" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            role="tab"
            aria-selected={filter === f.value}
            className={'nb-chat-tab' + (filter === f.value ? ' active' : '')}
            onClick={() => setFilter(f.value)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 13, verticalAlign: 'middle', marginRight: 2 }}>{f.icon}</span>
            {f.label}
            {f.value === 'unread' && unreadCount > 0 && (
              <span className="badge">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="nb-empty-chat">
          <span className="material-symbols-outlined">
            {filter === 'pinned' ? 'keep' : filter === 'unread' ? 'mark_email_read' : 'campaign'}
          </span>
          <p>{filter === 'pinned' ? 'No pinned notices' : filter === 'unread' ? 'All caught up!' : 'No notices yet'}</p>
          <span>{filter === 'all' ? 'Check back later for updates from the team.' : ''}</span>
        </div>
      ) : (
        <div
          className="nb-chat-feed"
          ref={feedRef}
          onScroll={handleScroll}
          role="log"
          aria-live="polite"
          aria-label="Notice feed"
        >
          {filtered.map((notice, idx) => (
            <div key={notice.id}>
              {sepSet.has(idx) && (
                <div className="nb-date-sep" aria-hidden="true">
                  <span>{seps.find((s) => s.index === idx)?.label}</span>
                </div>
              )}
              <NoticeBubble
                notice={notice}
                users={users}
                isAdmin={false}
                currentUserId={uid}
                onPin={handlePin}
                onAcknowledge={handleAcknowledge}
                ackAnim={ackAnim}
              />
            </div>
          ))}
        </div>
      )}

      {scrollBtn && (
        <button className="nb-scroll-btn" onClick={scrollToBottom} aria-label="Scroll to latest">
          <span className="material-symbols-outlined">expand_circle_down</span>
        </button>
      )}
    </div>
  );
}
