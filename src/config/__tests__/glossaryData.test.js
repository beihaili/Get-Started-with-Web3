import { describe, it, expect } from 'vitest';
import { GLOSSARY_DATA } from '../glossaryData';

const plannedExpansionTerms = [
  {
    term: 'EIP-4844',
    englishQuery: 'proto-danksharding',
    chineseQuery: '临时数据',
  },
  {
    term: 'Stealth Address',
    englishQuery: 'stealth',
    chineseQuery: '隐身地址',
  },
  {
    term: 'Rollup',
    englishQuery: 'rollup',
    chineseQuery: '侧链',
  },
  {
    term: 'Sidechain',
    englishQuery: 'sidechain',
    chineseQuery: '独立共识',
  },
  {
    term: 'LST',
    englishQuery: 'liquid staking',
    chineseQuery: '流动性质押',
  },
  {
    term: 'Airdrop Farming',
    englishQuery: 'airdrop',
    chineseQuery: '空投农场',
  },
  {
    term: 'Solver',
    englishQuery: 'solver',
    chineseQuery: '求解器',
  },
  {
    term: 'Slashing',
    englishQuery: 'slashing',
    chineseQuery: '罚没',
  },
  {
    term: 'Bridge',
    englishQuery: 'bridge',
    chineseQuery: '跨链桥',
  },
  {
    term: 'Oracle',
    englishQuery: 'oracle',
    chineseQuery: '预言机',
  },
];

const accountAbstractionPracticalTerms = ['EntryPoint', 'Factory', 'ERC-7562'];
const l2RiskPracticalTerms = ['Finality', 'Canonical Bridge', 'Cross-chain Messaging'];

const findByQuery = (query) => {
  const normalizedQuery = query.toLowerCase();
  return GLOSSARY_DATA.filter(
    (item) =>
      item.term.toLowerCase().includes(normalizedQuery) ||
      item.definition.toLowerCase().includes(normalizedQuery)
  );
};

describe('glossaryData', () => {
  it('should have at least 40 terms', () => {
    expect(GLOSSARY_DATA.length).toBeGreaterThanOrEqual(40);
  });

  it('each term should have required fields', () => {
    GLOSSARY_DATA.forEach((term) => {
      expect(term).toHaveProperty('term');
      expect(term).toHaveProperty('definition');
      expect(term).toHaveProperty('category');
      expect(typeof term.term).toBe('string');
      expect(typeof term.definition).toBe('string');
    });
  });

  it('categories should be from allowed set', () => {
    const allowed = [
      '基础概念',
      '密码学',
      '比特币',
      '以太坊',
      'DeFi',
      'Layer 2',
      '账户抽象',
      '稳定币',
      '安全',
      '工具',
    ];
    GLOSSARY_DATA.forEach((term) => {
      expect(allowed).toContain(term.category);
    });
  });

  it('covers modern Web3 categories', () => {
    const categories = new Set(GLOSSARY_DATA.map((term) => term.category));
    expect(categories).toContain('账户抽象');
    expect(categories).toContain('Layer 2');
    expect(categories).toContain('稳定币');
    expect(categories).toContain('安全');
  });

  it('includes the planned Web3 glossary expansion terms', () => {
    plannedExpansionTerms.forEach(({ term }) => {
      expect(GLOSSARY_DATA.some((item) => item.term.includes(term))).toBe(true);
    });
  });

  it('finds each planned expansion term by English and Chinese keywords', () => {
    plannedExpansionTerms.forEach(({ term, englishQuery, chineseQuery }) => {
      expect(findByQuery(englishQuery).some((item) => item.term.includes(term))).toBe(true);
      expect(findByQuery(chineseQuery).some((item) => item.term.includes(term))).toBe(true);
    });
  });

  it('includes practical account abstraction simulator terms', () => {
    accountAbstractionPracticalTerms.forEach((term) => {
      const glossaryTerm = GLOSSARY_DATA.find((item) => item.term.includes(term));
      expect(glossaryTerm).toBeDefined();
      expect(glossaryTerm.category).toBe('账户抽象');
    });
  });

  it('includes practical L2 risk simulator terms', () => {
    l2RiskPracticalTerms.forEach((term) => {
      const glossaryTerm = GLOSSARY_DATA.find((item) => item.term.includes(term));
      expect(glossaryTerm).toBeDefined();
      expect(glossaryTerm.category).toBe('Layer 2');
    });
  });
});
