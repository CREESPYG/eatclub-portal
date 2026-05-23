import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../../firebase';
import { ref as dbRef, onValue, push, set, remove, update } from 'firebase/database';
import DOMPurify from 'dompurify';

const SECTIONS = [
  { key: 'home-hero', label: 'Home Page Hero' },
  { key: 'about-intro', label: 'About Introduction' },
  { key: 'training-intro', label: 'Training Overview' },
  { key: 'announcement-bar', label: 'Announcement Bar' },
];

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function ContentEditor({ user }) {
  const [contentList, setContentList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editKey, setEditKey] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [toast, setToast] = useState(null);
  const editorRef = useRef(null);

  const uid = user?.uid || localStorage.getItem('eatclub_uid');
  const userEmail = user?.email || localStorage.getItem('eatclub_agent_email') || '';

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    const ref = dbRef(db, 'siteContent');
    const unsub = onValue(ref, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        setContentList(list);
      } else {
        setContentList([]);
      }
    });
    return () => unsub();
  }, []);

  function execFormat(cmd, val) {
    document.execCommand(cmd, false, val);
    if (editorRef.current) editorRef.current.focus();
  }

  function handleNew() {
    const key = prompt('Enter a unique content key (e.g. home-hero):');
    if (!key) return;
    if (contentList.some((c) => c.key === key)) {
      showToast('A content entry with this key already exists.');
      return;
    }
    const id = push(dbRef(db, 'siteContent')).key;
    const entry = {
      key,
      title: 'New Content',
      body: '<p>Start editing...</p>',
      section: 'custom',
      published: false,
      lastEditedBy: userEmail,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    };
    set(dbRef(db, 'siteContent/' + id), entry).then(() => {
      setEditingId(id);
      setEditKey(key);
      setEditTitle('New Content');
      setEditBody('<p>Start editing...</p>');
      showToast('Content created. Edit and publish below.');
    });
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditKey(item.key);
    setEditTitle(item.title);
    setEditBody(item.body);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditKey('');
    setEditTitle('');
    setEditBody('');
  }

  function onPaste(e) {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    const cleaned = DOMPurify.sanitize(html || text, {
      ALLOWED_TAGS: ['b','i','em','strong','a','ul','ol','li','p','br','h1','h2','h3','h4','h5','h6','blockquote','pre','code','img','span','div','sub','sup'],
      ALLOWED_ATTR: ['href','src','alt','target','class','id','title'],
    });
    document.execCommand('insertHTML', false, cleaned);
  }

  function saveContent() {
    if (!editingId) return;
    const rawHtml = editorRef.current ? editorRef.current.innerHTML : editBody;
    const html = DOMPurify.sanitize(rawHtml);
    update(dbRef(db, 'siteContent/' + editingId), {
      title: editTitle,
      body: html,
      lastEditedBy: userEmail,
      updatedAt: Date.now(),
      version: contentList.find((c) => c.id === editingId)?.version + 1 || 1,
    }).then(() => {
      showToast('Content saved successfully.');
      cancelEdit();
    }).catch((err) => {
      showToast('Error saving: ' + err.message);
    });
  }

  function togglePublished(item) {
    update(dbRef(db, 'siteContent/' + item.id), {
      published: !item.published,
      updatedAt: Date.now(),
    });
  }

  function deleteContent(id) {
    if (!confirm('Delete this content entry permanently?')) return;
    remove(dbRef(db, 'siteContent/' + id)).then(() => {
      if (editingId === id) cancelEdit();
      showToast('Content deleted.');
    });
  }

  function insertSample(key) {
    if (!editorRef.current) return;
    editorRef.current.focus();
    if (key === 'heading') execFormat('formatBlock', '<h3>');
    else if (key === 'bold') execFormat('bold');
    else if (key === 'italic') execFormat('italic');
    else if (key === 'ul') execFormat('insertUnorderedList');
    else if (key === 'ol') execFormat('insertOrderedList');
    else if (key === 'link') {
      const url = prompt('Enter URL:', 'https://');
      if (url) execFormat('createLink', url);
    }
    else if (key === 'image') {
      const url = prompt('Enter image URL:');
      if (url) execFormat('insertImage', url);
    }
  }

  return (
    <div>
      <div className="admin-flex-row" style={{ marginBottom: 16, justifyContent: 'space-between' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--md-on-surface)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)', fontSize: 18 }}>edit_note</span>
          Site Content Manager
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleNew}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
          New Content
        </button>
      </div>

      <div className="admin-grid-2">
        <div className="admin-section">
          <div className="admin-section-header">
            <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)', fontSize: 16 }}>content_paste</span>
            Content Entries ({contentList.length})
          </div>
          {contentList.length === 0 ? (
            <div className="admin-empty-state">No content entries yet. Click "New Content" to begin.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {contentList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => startEdit(item)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: editingId === item.id ? 'rgba(var(--md-primary-rgb), 0.08)' : 'var(--md-surface)',
                    border: '1px solid ' + (editingId === item.id ? 'var(--md-primary)' : 'var(--md-outline)'),
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--md-on-surface-var)' }}>description</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--md-on-surface)', flex: 1 }}>{item.title}</span>
                    {item.published ? (
                      <span className="admin-badge" style={{ background: 'rgba(76,175,80,0.12)', color: '#4CAF50' }}>Published</span>
                    ) : (
                      <span className="admin-badge" style={{ background: 'rgba(158,158,158,0.12)', color: '#9E9E9E' }}>Draft</span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--md-on-surface-var)' }}>
                    <span style={{ fontWeight: 600 }}>{item.key}</span>
                    {' \u00B7 '}v{item.version || 1}
                    {' \u00B7 '}{formatTime(item.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)', fontSize: 16 }}>edit</span>
            {editingId ? 'Editing: ' + editKey : 'Select or create content'}
          </div>
          {editingId ? (
            <div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--md-on-surface-var)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Title</label>
                <input
                  className="admin-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Content title"
                  aria-label="Content title"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--md-on-surface-var)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Content Key</label>
                <input
                  className="admin-input"
                  value={editKey}
                  onChange={(e) => setEditKey(e.target.value)}
                  placeholder="unique-key-name"
                  aria-label="Content key"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--md-on-surface-var)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Body (Rich Text)</label>
                <div className="admin-toolbar" role="toolbar" aria-label="Text formatting">
                  <button onClick={() => insertSample('bold')} title="Bold" aria-label="Bold"><strong>B</strong></button>
                  <button onClick={() => insertSample('italic')} title="Italic" aria-label="Italic"><em>I</em></button>
                  <button onClick={() => insertSample('heading')} title="Heading" aria-label="Heading">H</button>
                  <button onClick={() => insertSample('ul')} title="Bullet list" aria-label="Bullet list">&#8226; List</button>
                  <button onClick={() => insertSample('ol')} title="Numbered list" aria-label="Numbered list">1. List</button>
                  <button onClick={() => insertSample('link')} title="Insert link" aria-label="Insert link">Link</button>
                  <button onClick={() => insertSample('image')} title="Insert image" aria-label="Insert image">Img</button>
                </div>
                <div
                  ref={editorRef}
                  className="admin-editor"
                  contentEditable
                  suppressContentEditableWarning
                  dangerouslySetInnerHTML={{ __html: editBody }}
                  onInput={() => {}}
                  onPaste={onPaste}
                  role="textbox"
                  aria-multiline="true"
                  aria-label="Rich text editor"
                />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="admin-btn admin-btn-outline" onClick={cancelEdit}>Cancel</button>
                <button className="admin-btn admin-btn-primary" onClick={saveContent}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>save</span>
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--md-on-surface-var)', fontSize: 12, textAlign: 'center', padding: 40 }}>
              Click a content entry to edit, or create new content.
            </div>
          )}
        </div>
      </div>

      {!editingId && contentList.length > 0 && (
        <div className="admin-section">
          <div className="admin-section-header">
            <span className="material-symbols-outlined" style={{ color: 'var(--md-on-surface-var)', fontSize: 16 }}>settings</span>
            Quick Actions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {contentList.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '4px 10px', borderRadius: 8, background: 'var(--md-surface)', border: '1px solid var(--md-outline)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--md-on-surface)' }}>{item.key}</span>
                <button
                  className="admin-btn admin-btn-outline"
                  style={{ padding: '2px 8px', fontSize: 10 }}
                  onClick={() => togglePublished(item)}
                >
                  {item.published ? 'Unpublish' : 'Publish'}
                </button>
                {!SECTIONS.some((s) => s.key === item.key) && (
                  <button
                    className="admin-btn admin-btn-danger"
                    style={{ padding: '2px 8px', fontSize: 10 }}
                    onClick={() => deleteContent(item.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && <div className="admin-toast" role="alert">{toast}</div>}
    </div>
  );
}
