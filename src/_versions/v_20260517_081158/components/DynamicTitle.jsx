import React from 'react';

export default function DynamicTitle({ text }) {
  if (!text) return null;
  
  const rawWords = text.split(' ').filter(Boolean);
  const elements = [];
  
  let idx = 0;
  // Naive check: if first word is just an emoji (e.g. 📦)
  if (rawWords[0] && Array.from(rawWords[0]).length <= 2 && /\p{Emoji}/u.test(rawWords[0])) {
    elements.push(<span key="emoji" className="dt-emoji">{rawWords[0]} </span>);
    idx = 1;
  }

  const words = rawWords.slice(idx);

  if (words.length === 0) return <>{text}</>;

  // 1st word: white/black (var(--md-on-surface))
  elements.push(<span key="w0" className="dt-first">{words[0]}</span>);

  if (words.length === 2) {
    // Center logic works for 2nd word
    elements.push(<span key="space1"> </span>);
    elements.push(<span key="w1" className="dt-center">{words[1]}</span>);
  } else if (words.length >= 3) {
    // Center: all words between first and last -> theme color
    elements.push(<span key="space1"> </span>);
    const middle = words.slice(1, -1).join(' ');
    elements.push(<span key="w-mid" className="dt-center">{middle}</span>);
    
    // Last word: little gradient type
    elements.push(<span key="space2"> </span>);
    elements.push(<span key="w-end" className="dt-last">{words[words.length - 1]}</span>);
  }

  return <>{elements}</>;
}
