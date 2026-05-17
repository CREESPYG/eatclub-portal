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
  const [filterCat, setFilterCat] = useLocalStorage('ec_quiz_cat', 'All');
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
    <div className="flex-1 p-6 md:p-8 animate-[fadeIn_0.18s_ease]">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
        <DynamicTitle text="Knowledge Quiz" />
      </h1>
      <p className="text-base text-on-surface-var mb-8 leading-relaxed">
        {QUIZ_BANK.length} question bank · {QUIZ_COUNT} questions per attempt · 80% to pass
      </p>

      <div className="max-w-3xl mx-auto">

        {/* ── START SCREEN ── */}
        {phase === 'start' && (
          <div className="text-center p-12 md:p-16 bg-surface-variant rounded-3xl border border-outline animate-[springPop_0.5s_ease_both]">
            <div className="text-7xl mb-4">🧠</div>
            <div className="text-3xl font-bold mb-2 tracking-tight">Ready to Test Your Knowledge?</div>

            <div className="text-on-surface-var mt-3 mb-6 text-sm leading-relaxed">
              {QUIZ_COUNT} questions drawn randomly · Score <strong className="text-primary">80% ({Math.ceil(QUIZ_COUNT * 0.8)}/{QUIZ_COUNT})</strong> to pass.
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto mb-6">
              {[
                [QUIZ_BANK.length, 'Question Bank'],
                [QUIZ_COUNT, 'Per Attempt'],
                ['80%', 'Pass Mark'],
                ['∞', 'Retakes'],
              ].map(([n, l]) => (
                <div key={l} className="bg-surface-variant rounded-2xl p-5 text-center border border-outline animate-[gravityDrop_0.3s_ease_both] hover:shadow-lg hover:border-primary/30 transition-all">
                  <div className="text-3xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">{n}</div>
                  <div className="text-xs text-on-surface-var mt-1 font-medium">{l}</div>
                </div>
              ))}
            </div>

            {/* Category filter */}
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-on-surface-var mb-3">Filter by Category (optional)</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setFilterCat(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border border-outline transition-all ${
                      filterCat === cat
                        ? 'bg-primary text-white'
                        : 'bg-surface-variant text-on-surface-var hover:border-primary'
                    }`}>
                    {cat} {cat !== 'All' && `(${QUIZ_BANK.filter(q => q.cat === cat).length})`}
                  </button>
                ))}
              </div>
            </div>

            <button className="inline-flex items-center gap-2 px-10 py-3 bg-primary text-white font-semibold rounded-full hover:scale-105 hover:shadow-[0_4px_16px_rgba(var(--md-primary-rgb),0.4)] transition-all text-lg" onClick={startQuiz}>
              <span className="material-symbols-outlined">play_arrow</span>
              {filterCat === 'All' ? `Start Quiz (${QUIZ_COUNT} Questions)` : `Start: ${filterCat}`}
            </button>
          </div>
        )}

        {/* ── QUIZ SCREEN ── */}
        {phase === 'quiz' && q && (
          <div>
            {/* Progress */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-on-surface-var font-medium">Question {idx + 1} of {total}</span>
                <span className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">{q.cat}</span>
                  <span className="text-sm font-bold text-primary">Score: {score}/{idx}</span>
                </span>
              </div>
              <div className="h-1 bg-outline rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" style={{ width: `${((idx + 1) / total) * 100}%` }} />
              </div>
            </div>

            <div className="text-xl font-semibold leading-relaxed mb-7 text-on-surface tracking-tight">{q.q}</div>
            <div className="flex flex-col gap-2.5">
              {q.opts.map((opt, i) => (
                <button
                  key={i}
                  className={`p-4 bg-surface-2 border border-outline rounded-xl text-on-surface font-body text-base text-left leading-relaxed cursor-pointer transition-all flex items-center gap-3 ${
                    answered && i === q.ans ? 'bg-success/15 border-tertiary text-tertiary' : ''
                  } ${answered && i === selected && i !== q.ans ? 'bg-error/15 border-error text-error' : ''} ${
                    answered ? 'cursor-not-allowed' : 'hover:border-primary hover:bg-[rgba(var(--md-primary-rgb),0.08)]'
                  }`}
                  onClick={() => answer(i)}
                  disabled={answered}
                >
                  <span className="w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {['A', 'B', 'C', 'D'][i]}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {answered && (
              <>
                <div className="mt-4 p-4 bg-primary/8 rounded-xl border-l-[3px] border-primary text-sm text-on-surface-var leading-relaxed">
                  {selected === q.ans
                    ? <span className="text-success font-bold">✅ Correct! </span>
                    : <span className="text-error font-bold">❌ Wrong! </span>
                  }
                  💡 {q.expl}
                </div>
                <div className="mt-5">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-full hover:scale-105 hover:shadow-[0_4px_16px_rgba(var(--md-primary-rgb),0.4)] transition-all" onClick={next}>
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
          <div className="text-center p-12 md:p-16 bg-surface-variant rounded-3xl border border-outline animate-[springPop_0.5s_ease_both]">
            <div className="text-7xl mb-4">{pass ? '🎉' : '📚'}</div>
            <div className="text-3xl font-bold mb-2 tracking-tight">{pass ? 'Excellent Work!' : 'Keep Practicing!'}</div>
            <div className={`inline-block px-6 py-1.5 rounded-full font-bold text-sm mb-6 ${
              pass ? 'bg-success/15 text-tertiary' : 'bg-error/15 text-error'
            }`}>{pass ? '✅ PASSED' : '❌ NEEDS IMPROVEMENT'}</div>
            <div className="text-7xl font-bold text-primary leading-none my-5 tracking-tighter">{score}/{total}</div>
            <div className="text-2xl text-on-surface-var mb-4">{pct}%</div>
            <div className="text-base text-on-surface-var max-w-md mx-auto leading-relaxed">
              {pass
                ? "You've passed! You're ready to handle customer queries confidently."
                : `You need 80% (${Math.ceil(total * 0.8)}/${total}) to pass. Review the modules below and try again!`}
            </div>

            {/* Category breakdown */}
            {wrongList.length > 0 && (
              <div className="mt-6 text-left w-full max-w-xl mx-auto">
                <div className="text-sm font-bold mb-3 text-on-surface">
                  ❌ Questions You Missed ({wrongList.length}):
                </div>
                <div className="flex flex-col gap-2">
                  {wrongList.map((w, i) => (
                    <div key={i} className="p-3 rounded-xl bg-error/6 border border-error/20 text-xs leading-relaxed">
                      <div className="font-bold mb-1 text-on-surface">{w.q}</div>
                      <div className="text-success font-medium">✅ {w.opts[w.ans]}</div>
                      <div className="text-on-surface-var mt-1 text-[10px]">💡 {w.expl}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center flex-wrap mt-7">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-full hover:scale-105 hover:shadow-[0_4px_16px_rgba(var(--md-primary-rgb),0.4)] transition-all" onClick={startQuiz}>
                <span className="material-symbols-outlined">refresh</span> Retake Quiz
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-variant text-on-surface font-semibold rounded-full border border-outline hover:border-primary transition-all" onClick={() => setPhase('start')}>
                <span className="material-symbols-outlined">settings</span> Change Category
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
