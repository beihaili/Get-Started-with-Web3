import { describe, it, expect } from 'vitest';
import { QUIZ_BANK } from '../quizData';
import { COURSE_DATA } from '../../../config/courseData';

// Collect all lesson IDs from course data
const allLessonIds = COURSE_DATA.flatMap((m) => m.lessons.map((l) => l.id));

describe('Quiz data completeness', () => {
  it('has quizzes for every lesson', () => {
    for (const lessonId of allLessonIds) {
      expect(QUIZ_BANK[lessonId], `Missing quiz for lesson ${lessonId}`).toBeDefined();
    }
  });

  it('each lesson quiz has at least 5 questions', () => {
    for (const lessonId of allLessonIds) {
      const quiz = QUIZ_BANK[lessonId];
      if (quiz) {
        expect(
          quiz.length,
          `Lesson ${lessonId} should have at least 5 questions`
        ).toBeGreaterThanOrEqual(5);
      }
    }
  });
});

describe('Quiz data structure', () => {
  const allQuizEntries = Object.entries(QUIZ_BANK).filter(([key]) => key !== 'default');

  it.each(allQuizEntries)('quiz "%s" has valid question structure', (lessonId, questions) => {
    for (const q of questions) {
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('correctAnswer');
      expect(q).toHaveProperty('explanation');

      expect(typeof q.question).toBe('string');
      expect(q.question.length).toBeGreaterThan(0);

      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options.length).toBe(4);

      expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(q.correctAnswer).toBeLessThan(q.options.length);

      expect(typeof q.explanation).toBe('string');
      expect(q.explanation.length).toBeGreaterThan(0);
    }
  });

  it('default quiz exists with 5 questions', () => {
    expect(QUIZ_BANK.default).toBeDefined();
    expect(QUIZ_BANK.default.length).toBe(5);
  });

  it('DeFi DEX quiz has English copy for every question', () => {
    const dexQuiz = QUIZ_BANK['8-2'];

    for (const question of dexQuiz) {
      expect(question.translations?.en).toEqual({
        question: expect.any(String),
        options: expect.any(Array),
        explanation: expect.any(String),
      });
      expect(question.translations.en.question.length).toBeGreaterThan(0);
      expect(question.translations.en.options).toHaveLength(4);
      expect(question.translations.en.explanation.length).toBeGreaterThan(0);
    }
  });

  it('DeFi DEX quiz covers AMM invariant, slippage, and impermanent loss scenario', () => {
    const dexQuiz = QUIZ_BANK['8-2'];
    const firstQuestion = `${dexQuiz[0].question} ${dexQuiz[0].translations?.en?.question ?? ''}`;
    const allCopy = JSON.stringify(dexQuiz);

    expect(firstQuestion).toMatch(/AMM/);
    expect(firstQuestion).toMatch(/x\s*[·*]\s*y\s*=\s*k/i);
    expect(allCopy).toMatch(/滑点|slippage/i);
    expect(allCopy).toMatch(/无常损失|impermanent loss/i);
    expect(allCopy).toMatch(/相对持有|holding/i);
  });
});

describe('Updated Web3 QuickStart quiz coverage', () => {
  it.each(['1-2', '1-4', '1-6'])('lesson "%s" keeps exactly 5 questions', (lessonId) => {
    expect(QUIZ_BANK[lessonId]).toHaveLength(5);
  });

  it('first transaction quiz covers nonce ordering, gas, L2 networks, and simulation', () => {
    const allCopy = JSON.stringify(QUIZ_BANK['1-2']);

    expect(allCopy).toMatch(/nonce/i);
    expect(allCopy).toMatch(/gas limit|max fee|priority fee/i);
    expect(allCopy).toMatch(/Reverted|执行 Gas/i);
    expect(allCopy).toMatch(/L2|Arbitrum|Base|Optimism/i);
    expect(allCopy).toMatch(/仿真|模拟/);
  });

  it('useful sites quiz covers the 2026 Web3 tool map', () => {
    const allCopy = JSON.stringify(QUIZ_BANK['1-4']);

    expect(allCopy).toMatch(/Rabby/);
    expect(allCopy).toMatch(/Tenderly/);
    expect(allCopy).toMatch(/Revoke\.cash/);
    expect(allCopy).toMatch(/DeBank/);
    expect(allCopy).toMatch(/L2BEAT/);
    expect(allCopy).toMatch(/Foundry|Hardhat|OpenZeppelin/);
  });

  it('security quiz covers Permit2, blind signing, EIP-7702 phishing, and simulation limits', () => {
    const allCopy = JSON.stringify(QUIZ_BANK['1-6']);

    expect(allCopy).toMatch(/Permit2/);
    expect(allCopy).toMatch(/blind signing|盲签/i);
    expect(allCopy).toMatch(/EIP-7702/);
    expect(allCopy).toMatch(/钓鱼|空投|Gas 补贴/);
    expect(allCopy).toMatch(/交易模拟|Rabby|Tenderly/);
    expect(allCopy).toMatch(/地址投毒|剪贴板/);
  });
});

describe('Quiz data uniqueness', () => {
  it('has no duplicate questions within a lesson', () => {
    for (const [lessonId, questions] of Object.entries(QUIZ_BANK)) {
      const questionTexts = questions.map((q) => q.question);
      const unique = new Set(questionTexts);
      expect(unique.size, `Lesson ${lessonId} has duplicate questions`).toBe(questionTexts.length);
    }
  });
});
