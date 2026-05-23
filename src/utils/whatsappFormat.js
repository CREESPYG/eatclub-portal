/**
 * WhatsApp-style text formatting utilities.
 *
 * Supported markers (matching WhatsApp Web):
 *   *text*       → bold
 *   _text_       → italic
 *   ~text~       → strikethrough
 *   `text`       → inline code
 *   ```text```   → monospace
 *   > text       → blockquote
 *   - / * / +    → bullet list (at line start)
 *   1. / a.      → numbered list (at line start)
 *   https://…    → auto-linked
 *   [text](url)  → markdown link
 *
 * On paste from rich sources, HTML formatting is mapped to these markers
 * so the stored body remains plain text with WhatsApp-compatible syntax.
 */

/* ──────────────────────────────────────────────
   Parts: tokenize inline text into { text, bold, italic, strikethrough, code, link }
   ────────────────────────────────────────────── */

export function tokenizeInline(text) {
  if (!text) return [{ text: '', bold: false, italic: false, strikethrough: false, code: false }];

  const tokens = [];
  let i = 0;
  let plainStart = 0;
  const len = text.length;

  const flushPlain = (end) => {
    if (end > plainStart) {
      tokens.push({ text: text.slice(plainStart, end), bold: false, italic: false, strikethrough: false, code: false });
    }
  };

  const findEnd = (delim, start) => {
    const idx = text.indexOf(delim, start);
    return idx;
  };

  const addToken = (token, end) => {
    flushPlain(i);
    tokens.push(token);
    i = end;
    plainStart = i;
  };

  while (i < len) {
    // *** bold+italic ***
    if (text.startsWith('***', i)) {
      const end = findEnd('***', i + 3);
      if (end !== -1 && end > i + 3) {
        addToken({ text: text.slice(i + 3, end), bold: true, italic: true, strikethrough: false, code: false }, end + 3);
        continue;
      }
    }

    // ** bold ** (only if not ***)
    if (text.startsWith('**', i) && !text.startsWith('***', i)) {
      const end = findEnd('**', i + 2);
      if (end !== -1 && end > i + 2) {
        addToken({ text: text.slice(i + 2, end), bold: true, italic: false, strikethrough: false, code: false }, end + 2);
        continue;
      }
    }

    // *bold* (single asterisk — bold; word boundary to avoid conflict with **)
    if (text[i] === '*' && !text.startsWith('**', i)) {
      const prev = i > 0 ? text[i - 1] : ' ';
      if (!/\w/.test(prev)) {
        const end = findEnd('*', i + 1);
        if (end !== -1 && end > i + 1) {
          const next = end + 1 < len ? text[end + 1] : ' ';
          if (!/\w/.test(next)) {
            addToken({ text: text.slice(i + 1, end), bold: true, italic: false, strikethrough: false, code: false }, end + 1);
            continue;
          }
        }
      }
    }

    // ~strike~
    if (text[i] === '~') {
      const end = findEnd('~', i + 1);
      if (end !== -1 && end > i + 1) {
        addToken({ text: text.slice(i + 1, end), bold: false, italic: false, strikethrough: true, code: false }, end + 1);
        continue;
      }
    }

    // ```monospace``` (triple backtick)
    if (text.startsWith('```', i)) {
      const end = findEnd('```', i + 3);
      if (end !== -1) {
        addToken({ text: text.slice(i + 3, end), bold: false, italic: false, strikethrough: false, code: true }, end + 3);
        continue;
      }
    }

    // ``code`` (double backtick)
    if (text.startsWith('``', i)) {
      const end = findEnd('``', i + 2);
      if (end !== -1) {
        addToken({ text: text.slice(i + 2, end), bold: false, italic: false, strikethrough: false, code: true }, end + 2);
        continue;
      }
    }

    // `code` (single backtick)
    if (text[i] === '`') {
      const end = findEnd('`', i + 1);
      if (end !== -1) {
        addToken({ text: text.slice(i + 1, end), bold: false, italic: false, strikethrough: false, code: true }, end + 1);
        continue;
      }
    }

    // _italic_ (word boundary check to avoid matching underscores in words)
    if (text[i] === '_') {
      const prev = i > 0 ? text[i - 1] : ' ';
      if (!/\w/.test(prev)) {
        const end = findEnd('_', i + 1);
        if (end !== -1 && end > i + 1) {
          const next = end + 1 < len ? text[end + 1] : ' ';
          if (!/\w/.test(next)) {
            addToken({ text: text.slice(i + 1, end), bold: false, italic: true, strikethrough: false, code: false }, end + 1);
            continue;
          }
        }
      }
    }

    // [text](url)
    if (text[i] === '[') {
      const closeBracket = findEnd(']', i + 1);
      if (closeBracket !== -1 && closeBracket + 1 < len && text[closeBracket + 1] === '(') {
        const closeParen = findEnd(')', closeBracket + 2);
        if (closeParen !== -1) {
          const linkText = text.slice(i + 1, closeBracket);
          const linkUrl = text.slice(closeBracket + 2, closeParen);
          if (linkText && linkUrl) {
            addToken({ text: linkText, bold: false, italic: false, strikethrough: false, code: false, link: linkUrl }, closeParen + 1);
            continue;
          }
        }
      }
    }

    // bare URL
    const urlMatch = text.slice(i).match(/^https?:\/\/[^\s<>"']+/);
    if (urlMatch) {
      addToken({ text: urlMatch[0], bold: false, italic: false, strikethrough: false, code: false, link: urlMatch[0] }, i + urlMatch[0].length);
      continue;
    }

    i++;
  }

  flushPlain(len);
  return tokens.length > 0 ? tokens : [{ text: text || '', bold: false, italic: false, strikethrough: false, code: false }];
}
/* ──────────────────────────────────────────────
   Block parser: splits text into paragraphs, lists, quotes, code blocks
   ────────────────────────────────────────────── */

export function parseBlocks(text) {
  if (!text) return [];

  const lines = text.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block (```...```)
    if (line.trim() === '```' || line.trim() === '````') {
      const codeLines = [];
      i++;
      while (i < lines.length && !(lines[i].trim() === '```' || lines[i].trim() === '````')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code-block', content: codeLines.join('\n') });
      i++; // skip closing ```
      continue;
    }

    // Blockquote
    if (line.trimStart().startsWith('> ')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trimStart().startsWith('> ')) {
        quoteLines.push(lines[i].trimStart().slice(2));
        i++;
      }
      blocks.push({ type: 'quote', content: quoteLines.join('\n') });
      continue;
    }

    // Bullet list (-, *, +)
    const bulletMatch = line.match(/^(\s*)[-*+]\s+/);
    if (bulletMatch) {
      const items = [];
      while (i < lines.length && lines[i].match(/^(\s*)[-*+]\s+/)) {
        items.push(lines[i].replace(/^(\s*)[-*+]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'bullet-list', items });
      continue;
    }

    // Numbered list (1., a., etc.)
    const numMatch = line.match(/^(\s*)(\d+|[a-zA-Z])[.)]\s+/);
    if (numMatch) {
      const items = [];
      while (i < lines.length && lines[i].match(/^(\s*)(\d+|[a-zA-Z])[.)]\s+/)) {
        items.push(lines[i].replace(/^(\s*)(\d+|[a-zA-Z])[.)]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'numbered-list', items });
      continue;
    }

    // Heading (# ## ###)
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push({ type: 'heading', level, content: headingMatch[2] });
      i++;
      continue;
    }

    // Regular text line (including blank lines)
    blocks.push({ type: 'text', content: line });
    i++;
  }

  return blocks;
}

/* ──────────────────────────────────────────────
   HTML → WhatsApp markers (for paste handling)
   ────────────────────────────────────────────── */

function getStyle(node, prop) {
  if (!node || !node.style) return null;
  return node.style[prop] || null;
}

function htmlToWhatsAppNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  const tag = node.tagName ? node.tagName.toLowerCase() : '';
  const children = Array.from(node.childNodes).map(htmlToWhatsAppNode).join('');

  // Detect formatting from inline styles (WhatsApp Web uses style attributes)
  const fw = getStyle(node, 'fontWeight');
  const fs = getStyle(node, 'fontStyle');
  const td = getStyle(node, 'textDecoration');
  const ff = getStyle(node, 'fontFamily');

  const isBold = fw === '700' || fw === 'bold' || tag === 'b' || tag === 'strong';
  const isItalic = fs === 'italic' || tag === 'i' || tag === 'em';
  const isStrike = (td && td.includes('line-through')) || tag === 's' || tag === 'strike' || tag === 'del';
  const isMono = (ff && (ff.includes('monospace') || ff.includes('Consolas') || ff.includes('courier'))) || tag === 'code' || tag === 'pre';

  // Apply detected formatting, handling combinations
  let result = children;
  if (isMono && (tag !== 'pre')) result = '```' + result + '```';
  if (isStrike) result = '~' + result + '~';
  if (isItalic && isBold) result = '***' + result + '***';
  else if (isBold) result = '*' + result + '*';
  else if (isItalic) result = '_' + result + '_';

  switch (tag) {
    case 'pre':
      return '```\n' + children + '\n```';
    case 'a': {
      const href = node.getAttribute('href');
      if (href && href !== children) return '[' + children + '](' + href + ')';
      return children;
    }
    case 'br':
      return '\n';
    case 'p':
      return result + '\n\n';
    case 'div':
      return result + '\n';
    case 'li': {
      const parent = node.parentElement;
      if (parent && /^[oO][lL]$/.test(parent.tagName)) {
        return '1. ' + result + '\n';
      }
      return '- ' + result + '\n';
    }
    case 'ul':
      return (result.match(/\n$/) ? result.slice(0, -1) : result) + '\n';
    case 'ol':
      return (result.match(/\n$/) ? result.slice(0, -1) : result) + '\n';
    case 'blockquote':
      return '> ' + result.trim().replace(/\n/g, '\n> ') + '\n';
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
      return '*' + result.trim() + '*\n\n';
    default:
      return result;
  }
}

export function htmlToWhatsApp(html) {
  if (!html) return '';

  if (typeof DOMParser === 'undefined') {
    return html.replace(/<[^>]+>/g, '').replace(/\n{3,}/g, '\n\n').trim();
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;

  let result = '';
  for (const child of Array.from(body.childNodes)) {
    result += htmlToWhatsAppNode(child);
  }

  // Collapse excessive blank lines (max 2)
  result = result.replace(/\n{3,}/g, '\n\n').trim();

  return result;
}

/* ──────────────────────────────────────────────
   Textarea cursor helpers: wrap selection with markers
   ────────────────────────────────────────────── */

export function wrapSelection(textarea, before, after) {
  if (!textarea) return '';
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const val = textarea.value;
  const selected = val.slice(start, end);
  const replacement = before + selected + after;
  const newVal = val.slice(0, start) + replacement + val.slice(end);
  const cursorPos = start + before.length + selected.length + after.length;
  return { value: newVal, selectionStart: start + before.length, selectionEnd: cursorPos - after.length };
}

export function insertAtCursor(textarea, text) {
  if (!textarea) return '';
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const val = textarea.value;
  return val.slice(0, start) + text + val.slice(end);
}

/* ──────────────────────────────────────────────
   Keyboard shortcut map
   ────────────────────────────────────────────── */

export const SHORTCUTS = [
  { key: 'b', ctrl: true, label: 'Bold', before: '*', after: '*' },
  { key: 'i', ctrl: true, label: 'Italic', before: '_', after: '_' },
  { key: 's', ctrl: true, label: 'Strikethrough', before: '~', after: '~' },
  { key: 'e', ctrl: true, label: 'Inline Code', before: '`', after: '`' },
  { key: 'm', ctrl: true, label: 'Monospace', before: '```', after: '```' },
  { key: 'k', ctrl: true, label: 'Link', before: '[', after: '](url)' },
];

export function handleKeyboardShortcut(e, textarea, onUpdate) {
  for (const s of SHORTCUTS) {
    if (e.key === s.key && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      const result = wrapSelection(textarea, s.before, s.after);
      if (result) onUpdate(result.value, result.selectionStart, result.selectionEnd);
      return true;
    }
  }
  return false;
}

/* ──────────────────────────────────────────────
   Paste handling: try HTML first, fallback to plain
   ────────────────────────────────────────────── */

const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];
const SAFE_URL_RE = /^(https?:\/\/|mailto:|tel:)[^\s"'<>]+/i;

export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  url = url.trim();
  if (SAFE_URL_RE.test(url)) return url;
  if (url.startsWith('/') || url.startsWith('#')) return url;
  return '';
}

const WA_MARKER_RE = /[*~`_[\]>#]|^\s*[-*+]\s|^\s*\d+[.)]\s/;

function hasWhatsAppMarkers(text) {
  if (!text) return false;
  return WA_MARKER_RE.test(text);
}

export function handlePaste(e, textarea, onUpdate) {
  e.preventDefault();

  const html = e.clipboardData.getData('text/html');
  const plain = e.clipboardData.getData('text/plain');

  let insertText = '';

  if (plain && hasWhatsAppMarkers(plain)) {
    // Plain text already contains WhatsApp markers (e.g. copied from WhatsApp Web)
    // — use it directly to preserve exact formatting
    insertText = plain;
  } else if (html) {
    // Convert HTML formatting (Word, Google Docs, web pages) to WhatsApp markers
    insertText = htmlToWhatsApp(html);
  } else if (plain) {
    insertText = plain;
  }

  if (!insertText) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const val = textarea.value;
  const newVal = val.slice(0, start) + insertText + val.slice(end);
  const cursorPos = start + insertText.length;

  onUpdate(newVal, cursorPos, cursorPos);
}
