import { wrapSelection } from '../../utils/whatsappFormat';

const FORMAT_ACTIONS = [
  { id: 'bold', icon: 'format_bold', label: 'Bold', before: '*', after: '*', shortcut: 'Ctrl+B', group: 'inline' },
  { id: 'italic', icon: 'format_italic', label: 'Italic', before: '_', after: '_', shortcut: 'Ctrl+I', group: 'inline' },
  { id: 'strike', icon: 'strikethrough_s', label: 'Strikethrough', before: '~', after: '~', shortcut: 'Ctrl+S', group: 'inline' },
  { id: 'inlinecode', icon: 'code', label: 'Inline Code', before: '`', after: '`', shortcut: 'Ctrl+E', group: 'inline' },
  { id: 'mono', icon: 'data_object', label: 'Monospace', before: '```', after: '```', shortcut: 'Ctrl+M', group: 'inline' },
  { id: 'link', icon: 'link', label: 'Link', before: '[', after: '](url)', shortcut: 'Ctrl+K', group: 'inline' },
  { type: 'divider' },
  { id: 'bullet', icon: 'format_list_bulleted', label: 'Bullet list', before: '- ', after: '', insertAtStart: true, group: 'block' },
  { id: 'numbered', icon: 'format_list_numbered', label: 'Numbered list', before: '1. ', after: '', insertAtStart: true, group: 'block' },
  { id: 'quote', icon: 'format_quote', label: 'Quote', before: '> ', after: '', insertAtStart: true, group: 'block' },
];

export default function FormattingToolbar({ textareaRef, onUpdate, value }) {
  function handleAction(action) {
    const ta = textareaRef.current;
    if (!ta) return;

    if (action.insertAtStart) {
      const start = ta.selectionStart;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const line = value.slice(lineStart);

      // Toggle: if line already starts with marker, remove it
      if (line.startsWith(action.before)) {
        const newVal = value.slice(0, lineStart) + line.slice(action.before.length);
        onUpdate(newVal, lineStart, lineStart);
      } else {
        const newVal = value.slice(0, lineStart) + action.before + line;
        onUpdate(newVal, lineStart + action.before.length, lineStart + action.before.length);
      }
      ta.focus();
    } else {
      const result = wrapSelection(ta, action.before, action.after);
      if (result) {
        onUpdate(result.value, result.selectionStart, result.selectionEnd);
        ta.focus();
      }
    }
  }

  return (
    <div className="fmt-toolbar" role="toolbar" aria-label="Text formatting">
      {FORMAT_ACTIONS.map((action, i) => {
        if (action.type === 'divider') {
          return <div key={'d' + i} className="fmt-divider" aria-hidden="true" />;
        }
        return (
          <button
            key={action.id}
            className="fmt-btn"
            onClick={() => handleAction(action)}
            title={action.label + (action.shortcut ? ' (' + action.shortcut + ')' : '')}
            aria-label={action.label}
            tabIndex={0}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{action.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
