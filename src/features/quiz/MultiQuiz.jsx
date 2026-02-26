import { useState } from 'react';
import { BrainCircuit, CheckCircle, X } from 'lucide-react';
import { QUIZ_BANK } from './quizData';

/**
 * 3道题全对通关测验系统
 * 从原App.jsx迁移 (lines 1973-2325)
 */
const MultiQuiz = ({ lessonId, onPass }) => {
  const [quizState, setQuizState] = useState('idle'); // idle, active, completed
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuiz = QUIZ_BANK[lessonId] || QUIZ_BANK['default'];

  const startQuiz = () => {
    setQuizState('active');
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
  };

  const selectAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    const isCorrect = selectedAnswer === currentQuiz[currentQuestion].correctAnswer;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      selected: selectedAnswer,
      correct: isCorrect,
    };
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuiz.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // 测验结束
      setQuizState('completed');
    }
  };

  const resetQuiz = () => {
    setQuizState('idle');
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
  };

  // 检查是否全对
  const isPerfectScore = score === currentQuiz.length;

  if (quizState === 'idle') {
    return (
      <div className="space-y-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
            <h4 className="text-white font-bold">闯关测验</h4>
          </div>
          <p className="text-slate-300 mb-6">
            完成 <span className="text-cyan-400 font-bold">{currentQuiz.length} 道题目</span>，需要
            <span className="text-green-400 font-bold"> 全部答对 </span>才能通关下一章节
          </p>
          <button
            onClick={startQuiz}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/20"
          >
            🚀 开始挑战
          </button>
        </div>
      </div>
    );
  }

  if (quizState === 'active') {
    const currentQ = currentQuiz[currentQuestion];

    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          {/* 进度条 */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-slate-400">
              题目 {currentQuestion + 1} / {currentQuiz.length}
            </span>
            <span className="text-sm text-cyan-400 font-mono">
              得分: {score}/{currentQuiz.length}
            </span>
          </div>

          <div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestion + 1) / currentQuiz.length) * 100}%` }}
            />
          </div>

          {!showFeedback ? (
            <>
              <h5 className="text-lg font-semibold text-white mb-6">{currentQ.question}</h5>

              <div className="space-y-3 mb-6" role="radiogroup" aria-label="选择答案">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    role="radio"
                    aria-checked={selectedAnswer === index}
                    onClick={() => selectAnswer(index)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedAnswer === index
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200 shadow-lg shadow-cyan-500/10'
                        : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700/80'
                    }`}
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-600 text-white text-sm font-mono mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>

              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                确认答案
              </button>
            </>
          ) : (
            <>
              <div
                className={`p-4 rounded-xl border mb-6 ${
                  answers[currentQuestion]?.correct
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {answers[currentQuestion]?.correct ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                  <span className="font-bold">
                    {answers[currentQuestion]?.correct ? '回答正确！' : '回答错误'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{currentQ.explanation}</p>
              </div>

              <button
                onClick={nextQuestion}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {currentQuestion < currentQuiz.length - 1 ? '下一题' : '查看结果'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (quizState === 'completed') {
    return (
      <div className="space-y-6">
        <div
          className={`p-8 rounded-xl border text-center ${
            isPerfectScore
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-orange-500/10 border-orange-500/20'
          }`}
        >
          {isPerfectScore ? (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">完美通关！</h3>
              <p className="text-green-300 mb-6">
                恭喜你全部答对 {currentQuiz.length} 道题目！你已经掌握了本章节的核心知识。
              </p>
              <button
                onClick={() => {
                  onPass();
                  setQuizState('idle');
                }}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition-colors transform hover:scale-105 shadow-lg"
              >
                ✅ 解锁下一章节
              </button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-orange-400 mb-2">还需努力</h3>
              <p className="text-orange-300 mb-6">
                你答对了 {score}/{currentQuiz.length} 题。需要全部答对才能进入下一章节，再试一次吧！
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  🔄 重新挑战
                </button>
                {import.meta.env.DEV && (
                  <button
                    onClick={() => {
                      onPass();
                      setQuizState('idle');
                    }}
                    className="bg-slate-600 hover:bg-slate-500 text-white py-3 px-6 rounded-lg transition-colors"
                  >
                    跳过 (调试用)
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default MultiQuiz;
