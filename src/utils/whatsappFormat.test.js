import { describe, it, expect } from 'vitest';
import { tokenizeInline, parseBlocks, htmlToWhatsApp, wrapSelection, sanitizeUrl } from './whatsappFormat';

describe('sanitizeUrl', () => {
  it('allows https URLs', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
  });

  it('allows http URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
  });

  it('allows mailto: URLs', () => {
    expect(sanitizeUrl('mailto:test@example.com')).toBe('mailto:test@example.com');
  });

  it('allows tel: URLs', () => {
    expect(sanitizeUrl('tel:+1234567890')).toBe('tel:+1234567890');
  });

  it('rejects javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('');
  });

  it('rejects data: URLs', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
  });

  it('returns empty string for null/undefined', () => {
    expect(sanitizeUrl(null)).toBe('');
    expect(sanitizeUrl(undefined)).toBe('');
    expect(sanitizeUrl('')).toBe('');
  });
});

describe('tokenizeInline', () => {
  it('returns plain segment for plain text', () => {
    const result = tokenizeInline('hello world');
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('hello world');
  });

  it('parses **bold** text', () => {
    const result = tokenizeInline('hello **world**');
    expect(result).toHaveLength(2);
    expect(result[0].text).toBe('hello ');
    expect(result[1].text).toBe('world');
    expect(result[1].bold).toBe(true);
  });

  it('parses *bold* with single asterisk', () => {
    const result = tokenizeInline('hello *world*');
    expect(result).toHaveLength(2);
    expect(result[1].text).toBe('world');
    expect(result[1].bold).toBe(true);
  });

  it('parses _italic_ with underscore', () => {
    const result = tokenizeInline('hello _world_');
    expect(result).toHaveLength(2);
    expect(result[1].text).toBe('world');
    expect(result[1].italic).toBe(true);
  });

  it('does not match underscores inside words', () => {
    const result = tokenizeInline('hello_world test');
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('hello_world test');
  });

  it('parses ~strikethrough~', () => {
    const result = tokenizeInline('hello ~world~');
    expect(result).toHaveLength(2);
    expect(result[1].text).toBe('world');
    expect(result[1].strikethrough).toBe(true);
  });

  it('parses `code` (single backtick)', () => {
    const result = tokenizeInline('hello `world`');
    expect(result).toHaveLength(2);
    expect(result[1].text).toBe('world');
    expect(result[1].code).toBe(true);
  });

  it('parses ```monospace``` (triple backtick inline)', () => {
    const result = tokenizeInline('hello ```world```');
    expect(result).toHaveLength(2);
    expect(result[1].text).toBe('world');
    expect(result[1].code).toBe(true);
  });

  it('parses triple backtick mid-text', () => {
    const result = tokenizeInline('before ```mono``` after');
    expect(result).toHaveLength(3);
    expect(result[0].text).toBe('before ');
    expect(result[1].text).toBe('mono');
    expect(result[1].code).toBe(true);
    expect(result[2].text).toBe(' after');
  });

  it('parses ***bold italic***', () => {
    const result = tokenizeInline('hello ***world***');
    expect(result).toHaveLength(2);
    expect(result[1].text).toBe('world');
    expect(result[1].bold).toBe(true);
    expect(result[1].italic).toBe(true);
  });

  it('parses [text](url) links', () => {
    const result = tokenizeInline('hello [world](https://example.com)');
    expect(result).toHaveLength(2);
    expect(result[1].text).toBe('world');
    expect(result[1].link).toBe('https://example.com');
  });

  it('parses bare URLs', () => {
    const result = tokenizeInline('visit https://example.com now');
    expect(result).toHaveLength(3);
    expect(result[1].text).toBe('https://example.com');
    expect(result[1].link).toBe('https://example.com');
  });

  it('returns empty token for empty string', () => {
    const result = tokenizeInline('');
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('');
  });

  it('handles adjacent formatting', () => {
    const result = tokenizeInline('**bold** `code`');
    expect(result).toHaveLength(3);
    expect(result[0].bold).toBe(true);
    expect(result[0].text).toBe('bold');
    expect(result[1].text).toBe(' ');
    expect(result[2].code).toBe(true);
    expect(result[2].text).toBe('code');
  });

  it('handles mixed formatting on same text', () => {
    const result = tokenizeInline('***bold+italic***');
    expect(result).toHaveLength(1);
    expect(result[0].bold).toBe(true);
    expect(result[0].italic).toBe(true);
  });
});

describe('parseBlocks', () => {
  it('parses text blocks', () => {
    const result = parseBlocks('hello\nworld');
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('text');
    expect(result[1].type).toBe('text');
  });

  it('parses bullet list', () => {
    const result = parseBlocks('- item 1\n- item 2');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('bullet-list');
    expect(result[0].items).toHaveLength(2);
  });

  it('parses numbered list', () => {
    const result = parseBlocks('1. item 1\n2. item 2');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('numbered-list');
    expect(result[0].items).toHaveLength(2);
  });

  it('parses blockquote', () => {
    const result = parseBlocks('> quoted text');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('quote');
    expect(result[0].content).toBe('quoted text');
  });

  it('parses code block', () => {
    const result = parseBlocks('```\ncode here\n```');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('code-block');
    expect(result[0].content).toBe('code here');
  });

  it('parses heading #', () => {
    const result = parseBlocks('# Heading 1');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('heading');
    expect(result[0].level).toBe(1);
    expect(result[0].content).toBe('Heading 1');
  });

  it('parses heading ##', () => {
    const result = parseBlocks('## Heading 2');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('heading');
    expect(result[0].level).toBe(2);
  });

  it('parses heading ###', () => {
    const result = parseBlocks('### Heading 3');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('heading');
    expect(result[0].level).toBe(3);
  });

  it('handles empty text', () => {
    expect(parseBlocks('')).toEqual([]);
    expect(parseBlocks(null)).toEqual([]);
  });
});

const hasDOMParser = typeof DOMParser !== 'undefined';
(hasDOMParser ? describe : describe.skip)('htmlToWhatsApp', () => {
  it('converts <b> to *bold*', () => {
    expect(htmlToWhatsApp('<b>bold</b>')).toBe('*bold*');
  });

  it('converts <i> to _italic_', () => {
    expect(htmlToWhatsApp('<i>italic</i>')).toBe('_italic_');
  });

  it('converts <a> to [text](url)', () => {
    expect(htmlToWhatsApp('<a href="https://x.com">click</a>')).toBe('[click](https://x.com)');
  });

  it('converts <ul><li> to bullet list', () => {
    const result = htmlToWhatsApp('<ul><li>a</li><li>b</li></ul>');
    expect(result).toContain('- a');
    expect(result).toContain('- b');
  });

  it('converts <ol><li> to numbered list', () => {
    const result = htmlToWhatsApp('<ol><li>a</li><li>b</li></ol>');
    expect(result).toContain('1. a');
    expect(result).toContain('1. b');
  });

  it('collapses excessive blank lines', () => {
    const result = htmlToWhatsApp('<p>a</p><p>b</p>');
    expect(result).not.toContain('\n\n\n');
  });

  it('handles empty input', () => {
    expect(htmlToWhatsApp('')).toBe('');
    expect(htmlToWhatsApp(null)).toBe('');
  });

  it('converts WhatsApp-style span with font-weight:700 to *bold*', () => {
    expect(htmlToWhatsApp('<span style="font-weight: 700">bold</span>')).toBe('*bold*');
  });

  it('converts WhatsApp-style span with font-style:italic to _italic_', () => {
    expect(htmlToWhatsApp('<span style="font-style: italic">italic</span>')).toBe('_italic_');
  });

  it('converts WhatsApp-style span with line-through to ~strike~', () => {
    expect(htmlToWhatsApp('<span style="text-decoration: line-through">strike</span>')).toBe('~strike~');
  });

  it('converts WhatsApp-style span with monospace font-family', () => {
    expect(htmlToWhatsApp('<span style="font-family: monospace">code</span>')).toBe('```code```');
  });

  it('handles nested WhatsApp inline style formatting', () => {
    const html = '<span style="font-weight: 700">bold</span> normal <span style="font-style: italic">italic</span>';
    const result = htmlToWhatsApp(html);
    expect(result).toBe('*bold* normal _italic_');
  });

  it('prefers semantic tags over style attributes', () => {
    expect(htmlToWhatsApp('<b style="font-weight: 400">bold</b>')).toBe('*bold*');
  });
});

describe('wrapSelection', () => {
  function mockTextarea(value, start, end) {
    return { value, selectionStart: start, selectionEnd: end };
  }

  it('wraps selected text with markers', () => {
    const ta = mockTextarea('hello world', 6, 11);
    const result = wrapSelection(ta, '*', '*');
    expect(result.value).toBe('hello *world*');
    expect(result.selectionStart).toBe(7);
    expect(result.selectionEnd).toBe(12);
  });

  it('handles empty selection', () => {
    const ta = mockTextarea('hello ', 6, 6);
    const result = wrapSelection(ta, '*', '*');
    expect(result.value).toBe('hello **');
  });

  it('handles null textarea', () => {
    expect(wrapSelection(null, '*', '*')).toBe('');
  });
});
