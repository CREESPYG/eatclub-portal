import { useState, useCallback } from 'react';
import { PRIORITIES, useNotices } from '../../hooks/useNotices';
import NoticeFeed from './NoticeFeed';
import NoticeEditorModal from './NoticeEditorModal';

const EMPTY_FORM = { title: '', body: '', priority: 'normal', target: 'all', colorCard: '' };

export default function NoticeBoard({ user }) {
  const userEmail = user?.email || localStorage.getItem('eatclub_agent_email') || '';
  const uid = user?.uid || localStorage.getItem('eatclub_uid');
  const userName = user?.displayName || localStorage.getItem('eatclub_agent_name') || userEmail.split('@')[0] || 'Admin';
  const userPhotoURL = user?.photoURL || '';

  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [feedFilter, setFeedFilter] = useState('all');
  const [toast, setToast] = useState(null);

  const {
    notices, users,
    saveNotice, togglePin, toggleArchive, deleteNotice, getReadCount, filtered,
  } = useNotices(userEmail, uid, userName, userPhotoURL);

  const showToast = useCallback((msg, type) => {
    setToast({ msg, type: type || 'info' });
    setTimeout(() => setToast(null), 3000);
  }, []);

  function openEditor(notice) {
    if (notice) {
      setForm({ title: notice.title || '', body: notice.body || '', priority: notice.priority || 'normal', target: notice.target || 'all', colorCard: notice.colorCard || '' });
      setEditingId(notice.id);
    } else {
      setForm(EMPTY_FORM);
      setEditingId(null);
    }
    setShowEditor(true);
  }

  function closeEditor() {
    setShowEditor(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave() {
    try {
      setSending(true);
      await saveNotice(form, editingId);
      showToast(editingId ? 'Notice updated.' : 'Notice posted!', 'success');
      closeEditor();
    } catch (err) {
      if (err.message === 'Title is required.') {
        showToast('Title is required.', 'error');
      } else {
        showToast(err.message, 'error');
      }
    } finally {
      setSending(false);
    }
  }

  const feedNotices = filtered({ feedFilter });

  return (
    <div className="admin-noticeboard">
      <div className="admin-nb-header">
        <div className="admin-nb-title">
          <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)', fontSize: 18 }}>campaign</span>
          Notice Board
          <span className="admin-nb-badge">{notices.filter((n) => n.active !== false).length} active</span>
          <span style={{ fontSize: 10, color: 'var(--md-on-surface-var)', fontWeight: 600 }}>
            · {notices.filter((n) => n.pinnedBy && Object.keys(n.pinnedBy).length > 0).length} pinned
          </span>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => openEditor(null)}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
          New Notice
        </button>
      </div>

      <NoticeFeed
        notices={feedNotices}
        feedFilter={feedFilter}
        onFilterChange={setFeedFilter}
        users={users}
        uid={uid}
        onEdit={openEditor}
        onDelete={deleteNotice}
        onPin={togglePin}
        onArchive={toggleArchive}
        getReadCount={getReadCount}
      />

      {showEditor && (
        <NoticeEditorModal
          form={form}
          onChange={setForm}
          onClose={closeEditor}
          onSave={handleSave}
          editingId={editingId}
          sending={sending}
          priorities={PRIORITIES}
        />
      )}

      {toast && (
        <div className={`admin-toast ${toast.type === 'error' ? 'admin-toast-error' : toast.type === 'success' ? 'admin-toast-success' : ''}`} role="alert">
          {toast.msg}
        </div>
      )}
    </div>
  );
}
