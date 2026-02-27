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

  it('each lesson quiz has exactly 5 questions', () => {
    for (const lessonId of allLessonIds) {
      const quiz = QUIZ_BANK[lessonId];
      if (quiz) {
        expect(quiz.length, `Lesson ${lessonId} should have 5 questions`).toBe(5);
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
