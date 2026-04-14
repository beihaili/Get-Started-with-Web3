import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrainCircuit, CheckCircle, X } from 'lucide-react';
import { QUIZ_BANK } from './quizData';

/**
 * 3棰樺叏閫氬叧娴嬮獙绯荤粺
 * 閿洏瀵艰埅鏀寔: Arrow Up/Down 鍒囨崲閫夐」, Enter/Space 纭
 */
const MultiQuiz = ({ lessonId, onPass }) => {
  const { t } = useTranslation();
  const [quizState, setQuizState] = useState('idle');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuiz = QUIZ_BANK[lessonId] || QUIZ_BANK['default'];

  const startQuiz = () => {
    setQuizState('active');
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setFocusedIndex(0);
    setShowFeedback(false);
    setScore(0);
  };

  const selectAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setFocusedIndex(answerIndex);
  };

  const submitAnswer = () => {
    const isCorrect = selectedAnswer === currentQuiz[currentQuestion].correctAnswer;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      selected: selectedAnswer,
      correct: isCorrect,
    };
    setAnswers(newAnswers);
    if (isCorrect) setScore((prev) => prev + 1);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuiz.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setFocusedIndex(0);
      setShowFeedback(false);
    } else {
      setQuizState('completed');
    }
  };

  const resetQuiz = () => {
    setQuizState('idle');
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setFocusedIndex(0);
    setShowFeedback(false);
    setScore(0);
  };

  const handleOptionKeyDown = (e, index) => {
    const optionCount = currentQuiz[currentQuestion].options.length;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (index + 1) % optionCount;
      setFocusedIndex(next);
      document.querySelector(`[data-quiz-option="${next}"]`)?.focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (index - 1 + optionCount) % optionCount;
      setFocusedIndex(prev);
      document.querySelector(`[data-quiz-option="${prev}"]`)?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectAnswer(index);
      // Auto-submit after selection if no feedback showing
      if (!showFeedback && selectedAnswer !== null) {
        // submit after selecting
        setTimeout(() => {
          const isCorrect = index === currentQuiz[currentQuestion].correctAnswer;
          const newAnswers = [...answers];
          newAnswers[currentQuestion] = { selected: index, correct: isCorrect };
          setAnswers(newAnswers);
          if (isCorrect) setScore((prev) => prev + 1);
          setShowFeedback(true);
        }, 0);
      }
    }
  };

  const isPerfectScore = score === currentQuiz.length;

  if (quizState === 'idle') {
    return (
      <div className="space-y-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
            <h4 className="text-white font-bold">{t('quiz.title')}</h4>
          </div>
          <p
            className="text-slate-300 mb-6"
            dangerouslySetInnerHTML={{
              __html: t('quiz.description', { count: currentQuiz.length }),
            }}
          />
          <button
            onClick={startQuiz}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/20"
          >
            {t('quiz.startChallenge')}
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
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-slate-400">
              {t('quiz.questionProgress', {
                current: currentQuestion + 1,
                total: currentQuiz.length,
              })}
            </span>
            <span className="text-sm text-cyan-400 font-mono">
              {t('quiz.score', { score, total: currentQuiz.length })}
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

              <div
                className="space-y-3 mb-6"
                role="radiogroup"
                aria-label={t('quiz.selectAnswer')}
              >
                {currentQ.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isFocused = focusedIndex === index;
                  return (
                    <button
                      key={index}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
                      tabIndex={isFocused ? 0 : -1}
                      data-quiz-option={index}
                      onClick={() => selectAnswer(index)}
                      onKeyDown={(e) => handleOptionKeyDown(e, index)}
                      onFocus={() => setFocusedIndex(index)}
                      className={[
                        'w-full text-left p-4 rounded-lg border transition-all',
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200 shadow-lg shadow-cyan-500/10'
                          : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700/80',
                        isFocused
                          ? 'outline-none ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900'
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-600 text-white text-sm font-mono mr-3">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {t('quiz.confirmAnswer')}
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
                    {answers[currentQuestion]?.correct ? t('quiz.correct') : t('quiz.wrong')}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{currentQ.explanation}</p>
              </div>

              <button
                onClick={nextQuestion}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {currentQuestion < currentQuiz.length - 1
                  ? t('quiz.nextQuestion')
                  : t('quiz.viewResult')}
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
              <div className="text-6xl mb-4">馃弳</div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">{t('quiz.perfectTitle')}</h3>
              <p className="text-green-300 mb-6">
                {t('quiz.perfectDesc', { count: currentQuiz.length })}
              </p>
              <button
                onClick={() => {
                  onPass(score, currentQuiz.length);
                  setQuizState('idle');
                }}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition-colors transform hover:scale-105 shadow-lg"
              >
                {t('quiz.unlockNext')}
              </button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">馃摎</div>
              <h3 className="text-2xl font-bold text-orange-400 mb-2">{t('quiz.needMoreTitle')}</h3>
              <p className="text-orange-300 mb-6">
                {t('quiz.needMoreDesc', { score, total: currentQuiz.length })}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {t('quiz.retry')}
                </button>
                {import.meta.env.DEV && (
                  <button
                    onClick={() => {
                      onPass(score, currentQuiz.length);
                      setQuizState('idle');
                    }}
                    className="bg-slate-600 hover:bg-slate-500 text-white py-3 px-6 rounded-lg transition-colors"
                  >
                    {t('quiz.skipDebug')}
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
