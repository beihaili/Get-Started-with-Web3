import { describe, it, expect } from 'vitest';
import { GLOSSARY_DATA } from '../config/glossaryData';

// New terms added in #88
const NEW_TERMS = [
  'MEV（最大可提取值）',
  'EIP-4844 / Blob',
  'Intents（意图）',
  '账户抽象 / ERC-4337',
  '隐秘地址（Stealth Address）',
  'Rollup（对比侧链）',
  '数据可用性（DA）',
  '再质押 / EigenLayer',
  '流动性质押代币（LST）',
  '空投耕种（Airdrop Farming）',
];

describe('Glossary data completeness', () => {
  it('should have all 10 new glossary entries from issue #88', () => {
    NEW_TERMS.forEach((term) => {
      const entry = GLOSSARY_DATA.find((e) => e.term === term);
      expect(entry, `Term "${term}" should exist in GLOSSARY_DATA`).toBeDefined();
    });
  });

  it('should have both en and zh fields for all new entries', () => {
    NEW_TERMS.forEach((term) => {
      const entry = GLOSSARY_DATA.find((e) => e.term === term);
      expect(entry.term).toBeTruthy();
      expect(entry.definition).toBeTruthy();
      expect(entry.category).toBeTruthy();
    });
  });

  it('should include MEV definition mentioning maximal extractable value', () => {
    const entry = GLOSSARY_DATA.find((e) => e.term === 'MEV（最大可提取值）');
    expect(entry.definition).toContain('Maximal Extractable Value');
  });
});
