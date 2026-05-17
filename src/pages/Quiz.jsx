import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import DynamicTitle from '../components/DynamicTitle';
import { QUIZ_BANK } from '../data/quiz.js';

function shuffle(arr) {
  return [...arr].sort(() => 0.5 - Math.random());
}

const CATEGORIES = ['All', ...new Set(QUIZ_BANK.map(q => q.cat))];
const QUIZ_COUNT = 30;

export default function Quiz() {
  const [phase, setPhase] = useState('start');
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [filterCat, setFilterCat] = useLocalStorage('ec_quiz_cat', 'All'); // persisted
  const [wrongList, setWrongList] = useState([]);


  const startQuiz = () => {
    const pool = filterCat === 'All' ? QUIZ_BANK : QUIZ_BANK.filter(q => q.cat === filterCat);
    const picked = shuffle(pool).slice(0, Math.min(QUIZ_COUNT, pool.length));
    setQuestions(picked);
    setIdx(0); setScore(0); setSelected(null); setAnswered(false); setWrongList([]);
    setPhase('quiz');
  };

  const answer = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === questions[idx].ans) {
      setScore(s => s + 1);
    } else {
      setWrongList(w => [...w, questions[idx]]);
    }
  };

  const next = () => {
    if (idx + 1 >= questions.length) { setPhase('result'); return; }
    setIdx(i => i + 1); setSelected(null); setAnswered(false);
  };

  const q = phase === 'quiz' ? questions[idx] : null;
  const total = questions.length || QUIZ_COUNT;
  const pct = Math.round((score / total) * 100);
  const pass = pct >= 80;

  return (
    <div className="page-content">
      <h1 className="page-title"><DynamicTitle text="Knowledge Quiz" /></h1>
      <p className="page-subtitle">{QUIZ_BANK.length} question bank · {QUIZ_COUNT} questions per attempt · 80% to pass</p>

      <div className="quiz-container">

        {/* ── START SCREEN ── */}
        {phase === 'start' && (
          <div className="result-card" style={{ animation: 'springPop 0.5s ease both' }}>
            <div className="result-emoji">🧠</div>
            <div className="result-title">Ready to Test Your Knowledge?</div>

            <div style={{ color: 'var(--md-on-surface-var)', marginTop: 12, marginBottom: 24, fontSize: 13, lineHeight: 1.7 }}>
              {QUIZ_COUNT} questions drawn randomly · Score <strong style={{ color: 'var(--md-primary)' }}>80% ({Math.ceil(QUIZ_COUNT * 0.8)}/{QUIZ_COUNT})</strong> to pass.
            </div>

            {/* Stats */}
            <div className="grid-4 mb-24" style={{ maxWidth: 480, margin: '0 auto 24px' }}>
              {[
                [QUIZ_BANK.length, 'Question Bank'],
                [QUIZ_COUNT, 'Per Attempt'],
                ['80%', 'Pass Mark'],
                ['∞', 'Retakes'],
              ].map(([n, l]) => (
                <div key={l} className="stat-card">
                  <div className="stat-num">{n}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>

            {/* Category filter */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--md-on-surface-var)', marginBottom: 10 }}>Filter by Category (optional)</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setFilterCat(cat)}
                    style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--md-outline)',
                      background: filterCat === cat ? 'var(--md-primary)' : 'var(--md-surface-variant)',
                      color: filterCat === cat ? 'white' : 'var(--md-on-surface-var)',
                      transition: 'all .2s'
                    }}>
                    {cat} {cat !== 'All' && `(${QUIZ_BANK.filter(q => q.cat === cat).length})`}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" style={{ fontSize: 16, padding: '12px 40px' }} onClick={startQuiz}>
              <span className="material-symbols-outlined">play_arrow</span>
              {filterCat === 'All' ? `Start Quiz (${QUIZ_COUNT} Questions)` : `Start: ${filterCat}`}
            </button>
          </div>
        )}

        {/* ── QUIZ SCREEN ── */}
        {phase === 'quiz' && q && (
          <div>
            {/* Progress */}
            <div className="q-progress">
              <div className="q-header">
                <span className="q-num">Question {idx + 1} of {total}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(255,87,34,.1)', color: 'var(--md-primary)', fontWeight: 700 }}>{q.cat}</span>
                  <span className="q-score">Score: {score}/{idx}</span>
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((idx + 1) / total) * 100}%` }} />
              </div>
            </div>

            <div className="q-text">{q.q}</div>
            <div className="q-opts">
              {q.opts.map((opt, i) => (
                <button
                  key={i}
                  className={`q-opt ${answered && i === q.ans ? 'correct' : ''} ${answered && i === selected && i !== q.ans ? 'wrong' : ''}`}
                  onClick={() => answer(i)}
                  disabled={answered}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--md-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {['A', 'B', 'C', 'D'][i]}
                    </span>
                    {opt}
                  </span>
                </button>
              ))}
            </div>

            {answered && (
              <>
                <div className="q-expl">
                  {selected === q.ans
                    ? <span style={{ color: '#4CAF50', fontWeight: 700 }}>✅ Correct! </span>
                    : <span style={{ color: '#F44336', fontWeight: 700 }}>❌ Wrong! </span>
                  }
                  💡 {q.expl}
                </div>
                <div className="q-next">
                  <button className="btn btn-primary" onClick={next}>
                    {idx + 1 >= total ? 'See Results' : 'Next Question'}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── RESULTS SCREEN ── */}
        {phase === 'result' && (
          <div className="result-card">
            <div className="result-emoji">{pass ? '🎉' : '📚'}</div>
            <div className="result-title">{pass ? 'Excellent Work!' : 'Keep Practicing!'}</div>
            <div className={pass ? 'pass-badge' : 'fail-badge'}>{pass ? '✅ PASSED' : '❌ NEEDS IMPROVEMENT'}</div>
            <div className="result-score">{score}/{total}</div>
            <div className="result-pct">{pct}%</div>
            <div className="result-msg">
              {pass
                ? "You've passed! You're ready to handle customer queries confidently."
                : `You need 80% (${Math.ceil(total * 0.8)}/${total}) to pass. Review the modules below and try again!`}
            </div>

            {/* Category breakdown */}
            {wrongList.length > 0 && (
              <div style={{ marginTop: 24, textAlign: 'left', width: '100%', maxWidth: 520, margin: '24px auto 0' }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12, color: 'var(--md-on-surface)' }}>
                  ❌ Questions You Missed ({wrongList.length}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {wrongList.map((w, i) => (
                    <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(244,67,54,.06)', border: '1px solid rgba(244,67,54,.2)', fontSize: 11, lineHeight: 1.6 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--md-on-surface)' }}>{w.q}</div>
                      <div style={{ color: '#4CAF50', fontWeight: 600 }}>✅ {w.opts[w.ans]}</div>
                      <div style={{ color: 'var(--md-on-surface-var)', marginTop: 3, fontSize: 10 }}>💡 {w.expl}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
              <button className="btn btn-primary" onClick={startQuiz}>
                <span className="material-symbols-outlined">refresh</span> Retake Quiz
              </button>
              <button className="btn" onClick={() => setPhase('start')} style={{ background: 'var(--md-surface-variant)', color: 'var(--md-on-surface)', border: '1px solid var(--md-outline)' }}>
                <span className="material-symbols-outlined">settings</span> Change Category
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
