import { tokenizeInline, parseBlocks, sanitizeUrl } from '../utils/whatsappFormat';

export default function NoticeContent({ body, className = '' }) {
  if (!body) return null;

  const blocks = parseBlocks(body);

  return (
    <div className={'notice-content ' + className}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'text':
            return renderTextBlock(block.content, i);
          case 'bullet-list':
            return (
              <ul key={i} className="notice-list notice-bullet-list">
                {block.items.map((item, j) => (
                  <li key={j} className="notice-list-item">{renderInline(item)}</li>
                ))}
              </ul>
            );
          case 'numbered-list':
            return (
              <ol key={i} className="notice-list notice-numbered-list">
                {block.items.map((item, j) => (
                  <li key={j} className="notice-list-item">{renderInline(item)}</li>
                ))}
              </ol>
            );
          case 'quote':
            return (
              <blockquote key={i} className="notice-quote">
                {renderTextBlock(block.content, i + '-q')}
              </blockquote>
            );
          case 'heading': {
            const H = 'h' + Math.min(block.level, 3);
            return <H key={i} className="notice-heading">{renderInline(block.content)}</H>;
          }
          case 'code-block':
            return (
              <pre key={i} className="notice-code-block">
                <code>{block.content}</code>
              </pre>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

/* Render a text line with inline formatting */
function renderTextBlock(content, key) {
  if (content === '') {
    return <div key={key} className="notice-spacer" aria-hidden="true" />;
  }
  return (
    <p key={key} className="notice-text-line">
      {renderInline(content)}
    </p>
  );
}

/* Parse and render inline tokens */
function renderInline(text) {
  const tokens = tokenizeInline(text);
  return tokens.map((t, i) => {
    const key = 't' + i;

    const safeHref = sanitizeUrl(t.link);
    if (t.link && safeHref) {
      return (
        <a key={key} href={safeHref} className="notice-link" target="_blank" rel="noopener noreferrer">
          {t.text}
        </a>
      );
    }
    if (t.code) {
      return <code key={key} className="notice-inline-code">{t.text}</code>;
    }

    let el = <span key={key}>{t.text}</span>;
    if (t.bold && t.italic) {
      el = <strong key={key}><em>{t.text}</em></strong>;
    } else if (t.bold) {
      el = <strong key={key}>{t.text}</strong>;
    } else if (t.italic) {
      el = <em key={key}>{t.text}</em>;
    }
    if (t.strikethrough) {
      el = <del key={key}>{t.text}</del>;
    }
    return el;
  });
}
