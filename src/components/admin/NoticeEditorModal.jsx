import { useRef, useEffect } from 'react';
import FormattingToolbar from '../ui/FormattingToolbar';
import NoticeContent from '../NoticeContent';
import ColorPalette from '../ui/ColorPalette';
import { handleKeyboardShortcut, handlePaste } from '../../utils/whatsappFormat';

export default function NoticeEditorModal({
  form,
  onChange,
  onClose,
  onSave,
  editingId,
  sending,
  priorities,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (form._cursorPos && textareaRef.current) {
      textareaRef.current.selectionStart = form._cursorPos.start;
      textareaRef.current.selectionEnd = form._cursorPos.end;
    }
  }, [form.body, form._cursorPos]);

  function updateBody(val, selStart, selEnd) {
    onChange({
      ...form,
      body: val,
      _cursorPos: selStart !== undefined
        ? { start: selStart, end: selEnd !== undefined ? selEnd : selStart }
        : undefined,
    });
  }

  function onKeyDown(e) {
    handleKeyboardShortcut(e, textareaRef.current, updateBody);
  }

  function onPaste(e) {
    handlePaste(e, textareaRef.current, updateBody);
  }

  return (
    <div className="nb-editor-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="nb-editor-modal" onClick={(e) => e.stopPropagation()}>
        <h2>
          <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)' }}>
            {editingId ? 'edit' : 'add_alert'}
          </span>
          {editingId ? 'Edit Notice' : 'Post New Notice'}
        </h2>

        <div className="nb-editor-section">
          <label className="admin-field-label">
            Title <span style={{ color: '#E91E63' }}>*</span>
          </label>
          <input
            className="admin-input"
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
            placeholder="e.g. System Maintenance Tonight"
            aria-label="Notice title"
            style={{ fontSize: 17, fontWeight: 700, padding: '14px 18px' }}
          />
        </div>

        <div className="nb-editor-section">
          <label className="admin-field-label">Body</label>
          <FormattingToolbar textareaRef={textareaRef} onUpdate={updateBody} value={form.body} />
          <div style={{ position: 'relative' }}>
            <textarea
              ref={textareaRef}
              className="admin-textarea fmt-textarea"
              value={form.body}
              onChange={(e) => onChange({ ...form, body: e.target.value })}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              placeholder={"Write your notice here… Use the toolbar or format reference below for styling."}
              aria-label="Notice body"
              rows={10}
              style={{ minHeight: 220 }}
            />
            <div className="fmt-cursor-hint">
              <span className="material-symbols-outlined" style={{ fontSize: 11, marginRight: 4 }}>keyboard</span>
              Ctrl+B Bold · Ctrl+I Italic · Ctrl+S Strike · Ctrl+E Inline Code · Ctrl+M Monospace · Ctrl+K Link
            </div>
            <div className="fmt-reference">
              <span className="fmt-ref-item"><strong>*bold*</strong></span>
              <span className="fmt-ref-item"><em>_italic_</em></span>
              <span className="fmt-ref-item"><del>~strike~</del></span>
              <span className="fmt-ref-item"><code>`code`</code></span>
              <span className="fmt-ref-item"><code>```mono```</code></span>
              <span className="fmt-ref-item">[link](url)</span>
              <span className="fmt-ref-item">- list</span>
              <span className="fmt-ref-item">1. list</span>
              <span className="fmt-ref-item">&gt; quote</span>
            </div>
          </div>
        </div>

        {form.body && (
          <div className="nb-editor-section">
            <label className="admin-field-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>visibility</span>
                Live Preview
              </span>
            </label>
            <div className="fmt-preview">
              <NoticeContent body={form.body} />
            </div>
          </div>
        )}

        <div className="nb-editor-section">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label className="admin-field-label">Priority</label>
              <select
                className="admin-dropdown"
                value={form.priority}
                onChange={(e) => onChange({ ...form, priority: e.target.value })}
                aria-label="Priority level"
                style={{ fontSize: 13, padding: '10px 12px' }}
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label className="admin-field-label">Target Audience</label>
              <select
                className="admin-dropdown"
                value={form.target}
                onChange={(e) => onChange({ ...form, target: e.target.value })}
                aria-label="Target audience"
                style={{ fontSize: 13, padding: '10px 12px' }}
              >
                <option value="all">All Users</option>
                <option value="agents">Agents Only</option>
                <option value="managers">Managers Only</option>
                <option value="admins">Admins Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="nb-editor-section">
          <label className="admin-field-label">Accent Color</label>
          <ColorPalette
            selected={form.colorCard}
            onChange={(hex) => onChange({ ...form, colorCard: hex })}
          />
        </div>

        <div className="nb-editor-actions">
          <button className="admin-btn admin-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="admin-btn admin-btn-primary" onClick={onSave} disabled={sending}>
            <span className="material-symbols-outlined">
              {editingId ? 'save' : 'send'}
            </span>
            {sending ? 'Saving…' : editingId ? 'Update Notice' : 'Post Notice'}
          </button>
        </div>
      </div>
    </div>
  );
}
