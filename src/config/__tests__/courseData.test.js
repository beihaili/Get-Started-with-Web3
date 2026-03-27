import { describe, it, expect } from 'vitest';
import { COURSE_DATA } from '../courseData';

describe('courseData', () => {
  it('should have 9 modules', () => {
    expect(COURSE_DATA).toHaveLength(9);
  });

  it('module-7 should have correct structure', () => {
    const mod7 = COURSE_DATA.find((m) => m.id === 'module-7');
    expect(mod7).toBeDefined();
    expect(mod7.title).toBe('Web3 Builder 实战');
    expect(mod7.lessons.length).toBeGreaterThanOrEqual(3);
    mod7.lessons.forEach((lesson) => {
      expect(lesson).toHaveProperty('id');
      expect(lesson).toHaveProperty('title');
      expect(lesson).toHaveProperty('path');
      expect(lesson.path).toMatch(/^Web3BuilderLab\//);
    });
  });

  it('all module IDs should be unique', () => {
    const ids = COURSE_DATA.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all lesson IDs within modules should be unique', () => {
    COURSE_DATA.forEach((module) => {
      const ids = module.lessons.map((l) => l.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  it('lessons with labUrl should have valid GitHub URLs', () => {
    const lessonsWithLab = COURSE_DATA.flatMap((m) => m.lessons).filter((l) => l.labUrl);
    expect(lessonsWithLab.length).toBeGreaterThanOrEqual(2);
    lessonsWithLab.forEach((lesson) => {
      expect(lesson.labUrl).toMatch(/^https:\/\/github\.com\/beihaili\//);
    });
  });
});
