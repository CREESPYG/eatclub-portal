import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../firebase';
import { ref as dbRef, onValue } from 'firebase/database';
import {
  getConversationId, ensureConversation,
  sendDirectMessage, listenDirectMessages,
  listenConversationMeta, markConversationRead,
  setTypingIndicator, listenTyping, clearAllTyping,
} from '../services/messaging';
import UserAvatar from './UserAvatar';
import { getUserColor } from '../hooks/useAvatar';

export default function DirectChat({ otherUser, myId, myName, myRole, myPhotoURL, onBack, onUnreadChange }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [online, setOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const convIdRef = useRef(null);
  const myIdRef = useRef(myId);
  myIdRef.current = myId;

  const convId = getConversationId(myId, otherUser.id);
  convIdRef.current = convId;

  useEffect(() => {
    ensureConversation(convId,
      { id: myId, name: myName, role: myRole || '', photoURL: myPhotoURL || '' },
      { id: otherUser.id, name: otherUser.name, role: otherUser.role || '', photoURL: otherUser.photoURL || '' }
    );
  }, [convId, myId, myName, myRole, myPhotoURL, otherUser]);

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    const unsubMsgs = listenDirectMessages(convId, list => {
      setMessages(list);
      setLoading(false);
    });

    const unsubMeta = listenConversationMeta(convId, meta => {
      // Just listen to meta for unread counts or other data if needed
    });

    const presenceRef = dbRef(db, `presence/${otherUser.id}`);
    const unsubPresence = onValue(presenceRef, snap => {
      const data = snap.val();
      setOnline(data?.status === 'online' || data?.status === 'idle');
    });

    const unsubTyping = listenTyping(convId, otherUser.id, isTyping => {
      setOtherTyping(isTyping);
    });

    markConversationRead(convId, myId);

    return () => {
      unsubMsgs();
      unsubMeta();
      unsubPresence();
      unsubTyping();
      clearAllTyping(convId, myId);
    };
  }, [convId, myId, otherUser.id]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, otherTyping]);

  const sendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    clearAllTyping(convId, myId);
    const msgText = text.trim();
    const optimisticMsg = {
      fbId: 'opt_' + Date.now(),
      text: msgText,
      from: myId,
      name: myName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      status: 'sent',
      readBy: {},
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setText('');
    try {
      await sendDirectMessage({ convId, text: msgText, senderId: myId, senderName: myName });
    } catch (err) {
      console.error('Send failed:', err);
      setMessages(prev => prev.filter(m => m.fbId !== optimisticMsg.fbId));
    }
    setSending(false);
  }, [text, sending, convId, myId, myName]);

  const handleInputChange = (e) => {
    setText(e.target.value);
    setTypingIndicator(convId, myId, e.target.value.trim().length > 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--md-outline)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'var(--md-surface-variant)',
        borderRadius: '24px 24px 0 0',
      }}>
        <button onClick={onBack}
          style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'var(--md-surface)', color: 'var(--md-on-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
        </button>
        <UserAvatar
          size={32}
          name={otherUser.name}
          photoURL={otherUser.photoURL}
          showStatus
          status={online ? 'online' : 'offline'}
          statusColor={online ? '#4CAF50' : undefined}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--md-on-surface)' }}>{otherUser.name}</div>
          <div style={{ fontSize: 10, color: 'var(--md-on-surface-var)', display: 'flex', alignItems: 'center', gap: 4 }}>
            {otherTyping ? (
              <span style={{ color: 'var(--md-primary)', fontWeight: 600 }}>typing...</span>
            ) : (
              <>{otherUser.role || 'Member'} · {online ? 'Online' : 'Offline'}</>
            )}
          </div>
        </div>
      </div>

      <div ref={messagesContainerRef} style={{
        flex: 1, overflowY: 'auto', padding: '12px 16px',
        display: 'flex', flexDirection: 'column', gap: 6,
        scrollbarWidth: 'thin',
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--md-on-surface-var)', fontSize: 12 }}>Loading messages...</div>
        ) : messages.length === 0 && !otherTyping ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--md-on-surface-var)', fontSize: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36, opacity: 0.3, display: 'block', marginBottom: 8 }}>chat_bubble_outline</span>
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.from === myId;
            const userColor = getUserColor(msg.name);
            const prevMsg = messages[idx - 1];
            const nextMsg = messages[idx + 1];
            const isLastInSeq = !nextMsg || nextMsg.from !== msg.from;
            const isNewDay = !prevMsg || (
              prevMsg.timestamp && msg.timestamp &&
              new Date(prevMsg.timestamp).toDateString() !== new Date(msg.timestamp).toDateString()
            );
            const showStatus = isMe && isLastInSeq;
            return (
              <div key={msg.fbId || msg.timestamp + '_' + idx}>
                {isNewDay && msg.timestamp && (
                  <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--md-on-surface-dim)', padding: '8px 0', fontWeight: 600 }}>
                    {new Date(msg.timestamp).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2, padding: isMe ? '0 4px 0 0' : '0 0 0 4px' }}>
                    {!isMe && (
                      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: userColor, flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: 9, fontWeight: 700, color: isMe ? 'var(--md-on-surface-dim)' : userColor }}>
                      {isMe ? 'You' : msg.name}
                    </span>
                  </div>
                  <div style={{
                    maxWidth: '82%',
                    padding: '8px 14px',
                    borderRadius: 14,
                    fontSize: 13,
                    lineHeight: 1.45,
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    background: isMe ? 'linear-gradient(135deg, var(--md-primary), rgba(var(--md-primary-rgb), 0.85))' : 'var(--md-surface-variant)',
                    color: isMe ? '#fff' : 'var(--md-on-surface)',
                    borderBottomRightRadius: isMe ? 4 : 14,
                    borderBottomLeftRadius: isMe ? 14 : 4,
                    border: isMe ? 'none' : '1px solid var(--md-outline)',
                  }}>
                    {msg.text}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 3 }}>
                      <span style={{ fontSize: 8, opacity: 0.5 }}>{msg.time}</span>
                      {showStatus && (
                        <span style={{ fontSize: 10, opacity: 0.6 }}>
                          {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {otherTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 4px' }}>
            <div style={{ display: 'flex', gap: 3 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--md-primary)', animation: 'typingBounce 1.4s infinite', animationDelay: '0s' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--md-primary)', animation: 'typingBounce 1.4s infinite', animationDelay: '0.2s' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--md-primary)', animation: 'typingBounce 1.4s infinite', animationDelay: '0.4s' }} />
            </div>
            <span style={{ fontSize: 10, color: 'var(--md-on-surface-dim)' }}>{otherUser.name} is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{
        padding: '10px 16px',
        borderTop: '1px solid var(--md-outline)',
        display: 'flex',
        gap: 8,
      }}>
        <input type="text" value={text} onChange={handleInputChange} onKeyDown={handleKeyDown}
          placeholder={`Message ${otherUser.name}...`}
          style={{
            flex: 1, padding: '9px 16px', borderRadius: 20,
            border: '1px solid var(--md-outline)',
            background: 'var(--md-surface-variant)',
            color: 'var(--md-on-surface)', fontSize: 12, outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--md-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--md-outline)'} />
        <button type="submit" disabled={sending || !text.trim()} style={{
          width: 38, height: 38, borderRadius: '50%', border: 'none',
          background: sending || !text.trim() ? 'var(--md-on-surface-dim)' : 'linear-gradient(135deg, var(--md-primary), rgba(var(--md-primary-rgb), 0.85))',
          color: '#fff', cursor: sending || !text.trim() ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'all 0.2s',
        }}>
          {sending ? (
            <span className="material-symbols-outlined" style={{ fontSize: 16, animation: 'spin 1s linear infinite' }}>sync</span>
          ) : (
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>send</span>
          )}
        </button>
      </form>
    </div>
  );
}
