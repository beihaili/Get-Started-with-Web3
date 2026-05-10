import { readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { GLOSSARY_DATA } from '../src/config/glossaryData.js';
import { COURSE_DATA, GITHUB_BRANCH, GITHUB_REPO, GITHUB_USERNAME } from '../src/config/courseData.js';

export const AI_SCHEMA_VERSION = '2026-05-09';
export const LANGUAGES = ['zh', 'en'];
export const SITE_BASE_URL = 'https://beihaili.github.io/Get-Started-with-Web3';
export const GITHUB_BASE_URL = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}/blob/${GITHUB_BRANCH}`;
export const PUBLIC_AI_ENTRYPOINTS = {
  llmsTxt: `${SITE_BASE_URL}/llms.txt`,
  manifest: `${SITE_BASE_URL}/ai/manifest.json`,
  contentIndex: `${SITE_BASE_URL}/ai/content-index.json`,
};

const DEFAULT_PROJECT_ROOT = path.resolve(process.cwd());
const CONTENT_EXTENSIONS = ['README.md', 'README.MD'];

const TOOL_CATALOG = [
  {
    name: 'search_web3_content',
    title: 'Search Web3 Course Content',
    description: 'Search lesson titles, headings, excerpts, and glossary definitions.',
    x402: { enabled: false },
  },
  {
    name: 'read_web3_lesson',
    title: 'Read Web3 Lesson',
    description: 'Read a full lesson by language and lesson identifier.',
    x402: { enabled: false },
  },
  {
    name: 'get_learning_path',
    title: 'Get Learning Path',
    description: 'Return role-based learning paths for beginners, builders, researchers, and investors.',
    x402: { enabled: false },
  },
  {
    name: 'lookup_web3_glossary',
    title: 'Lookup Web3 Glossary',
    description: 'Search concise glossary entries for Web3 concepts.',
    x402: { enabled: false },
  },
  {
    name: 'compose_web3_context',
    title: 'Compose Web3 Context',
    description: 'Build a bounded context pack with citations for a topic.',
    x402: { enabled: false },
  },
  {
    name: 'list_monetizable_tools',
    title: 'List Monetizable Tools',
    description: 'List future x402-ready paid tool metadata. Local MCP does not enforce payment.',
    x402: { enabled: false },
  },
  {
    name: 'generate_personalized_web3_plan',
    title: 'Generate Personalized Web3 Plan',
    description:
      'Future paid remote tool that turns learner goals and background into a tailored Web3 study plan.',
    x402: {
      enabled: true,
      priceUsd: 0.25,
      network: 'base',
      route: '/mcp/tools/generate_personalized_web3_plan',
    },
  },
  {
    name: 'audit_learning_answer',
    title: 'Audit Learning Answer',
    description:
      'Future paid remote tool that reviews a learner answer against repository lessons with cited corrections.',
    x402: {
      enabled: true,
      priceUsd: 0.1,
      network: 'base',
      route: '/mcp/tools/audit_learning_answer',
    },
  },
];

const ROLE_PATHS = {
  beginner: ['module-1:1-1', 'module-1:1-2', 'module-1:1-3', 'module-1:1-6', 'module-2:2-1'],
  builder: [
    'module-1:1-1',
    'module-1:1-3',
    'module-7:7-1',
    'module-7:7-2',
    'module-7:7-3',
    'module-7:7-4',
    'module-4:4-2',
  ],
  researcher: [
    'module-2:2-1',
    'module-2:2-3',
    'module-3:3-2',
    'module-4:4-4',
    'module-8:8-5',
    'module-9:9-4',
    'module-10:10-5',
  ],
  investor: ['module-1:1-4', 'module-1:1-7', 'module-6:6-1', 'module-8:8-1', 'module-8:8-5'],
};

export async function buildAiIndex(options = {}) {
  const projectRoot = options.projectRoot || DEFAULT_PROJECT_ROOT;
  const generatedAt = options.generatedAt || new Date().toISOString();
  const modules = [];
  const lessons = [];

  for (const module of COURSE_DATA) {
    const indexedModule = {
      id: module.id,
      title: module.title,
      lessonCount: module.lessons.length,
      lessons: [],
    };

    for (const lesson of module.lessons) {
      const availability = {};

      for (const lang of LANGUAGES) {
        const readme = findLessonReadme(projectRoot, lang, lesson.path);
        availability[lang] = Boolean(readme);

        if (readme) {
          const content = await readFile(readme.absolutePath, 'utf8');
          const extracted = extractMarkdownSignals(content);
          const citation = buildCitation(lang, module.id, lesson.id, readme.relativePath);

          lessons.push({
            id: `${lang}/${module.id}/${lesson.id}`,
            lang,
            moduleId: module.id,
            moduleTitle: module.title,
            lessonId: lesson.id,
            title: lesson.title,
            path: lesson.path,
            labUrl: lesson.labUrl || null,
            sourcePath: readme.relativePath,
            citation,
            excerpt: extracted.excerpt,
            headings: extracted.headings,
            codeBlockCount: extracted.codeBlockCount,
            characterCount: content.length,
          });
        }
      }

      indexedModule.lessons.push({
        id: lesson.id,
        title: lesson.title,
        path: lesson.path,
        labUrl: lesson.labUrl || null,
        availability,
        siteUrls: Object.fromEntries(
          LANGUAGES.map((lang) => [lang, `${SITE_BASE_URL}/${lang}/learn/${module.id}/${lesson.id}`])
        ),
      });
    }

    modules.push(indexedModule);
  }

  return {
    schemaVersion: AI_SCHEMA_VERSION,
    generatedAt,
    repository: {
      name: GITHUB_REPO,
      owner: GITHUB_USERNAME,
      branch: GITHUB_BRANCH,
      homepage: `${SITE_BASE_URL}/`,
      sourceUrl: `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}`,
    },
    languages: LANGUAGES,
    modules,
    lessons,
    glossary: GLOSSARY_DATA.map((entry) => ({
      type: 'glossary',
      term: entry.term,
      definition: entry.definition,
      category: entry.category,
      citation: {
        file: 'src/config/glossaryData.js',
        githubUrl: `${GITHUB_BASE_URL}/src/config/glossaryData.js`,
        siteUrl: `${SITE_BASE_URL}/zh/glossary`,
      },
    })),
    tools: TOOL_CATALOG,
    artifacts: {
      manifest: 'ai/manifest.json',
      contentIndex: 'ai/content-index.json',
      llmsTxt: 'ai/llms.txt',
      public: PUBLIC_AI_ENTRYPOINTS,
    },
  };
}

export function searchContent(index, options = {}) {
  const query = String(options.query || '').trim();
  const lang = options.lang || 'zh';
  const limit = clampNumber(options.limit, 5, 1, 20);
  const includeGlossary = options.includeGlossary !== false;

  if (!query) {
    return { query, lang, results: [] };
  }

  const lessonResults = index.lessons
    .filter((lesson) => lesson.lang === lang)
    .map((lesson) => {
      const haystack = [
        lesson.title,
        lesson.moduleTitle,
        lesson.path,
        lesson.excerpt,
        ...lesson.headings.map((heading) => heading.text),
      ].join('\n');
      return {
        type: 'lesson',
        score: scoreText(query, haystack),
        lang: lesson.lang,
        moduleId: lesson.moduleId,
        lessonId: lesson.lessonId,
        moduleTitle: lesson.moduleTitle,
        title: lesson.title,
        path: lesson.path,
        excerpt: lesson.excerpt,
        headings: lesson.headings.slice(0, 8),
        citation: lesson.citation,
      };
    })
    .filter((item) => item.score > 0);

  const glossaryResults = includeGlossary
    ? index.glossary
        .map((entry) => ({
          ...entry,
          score: scoreText(query, `${entry.term}\n${entry.definition}\n${entry.category}`),
        }))
        .filter((item) => item.score > 0)
    : [];

  return {
    query,
    lang,
    results: [...lessonResults, ...glossaryResults]
      .sort((a, b) => b.score - a.score || a.title?.localeCompare(b.title || '') || 0)
      .slice(0, limit),
  };
}

export async function readLesson(index, options = {}) {
  const lang = options.lang || 'zh';
  const lesson = findIndexedLesson(index, { ...options, lang });

  if (!lesson) {
    throw new Error(`Lesson not found for lang=${lang}, moduleId=${options.moduleId || ''}, lessonId=${options.lessonId || ''}, path=${options.path || ''}`);
  }

  const absolutePath = path.join(index.projectRoot || DEFAULT_PROJECT_ROOT, lesson.sourcePath);
  const content = await readFile(absolutePath, 'utf8');

  return {
    ...lesson,
    content,
  };
}

export function lookupGlossary(index, options = {}) {
  const query = String(options.query || '').trim();
  const limit = clampNumber(options.limit, 5, 1, 20);
  const results = index.glossary
    .map((entry) => ({
      ...entry,
      score: query ? scoreText(query, `${entry.term}\n${entry.definition}\n${entry.category}`) : 1,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.term.localeCompare(b.term))
    .slice(0, limit);

  return { query, results };
}

export function getLearningPath(index, options = {}) {
  const role = ROLE_PATHS[options.role] ? options.role : 'beginner';
  const lang = options.lang || 'zh';
  const lessons = ROLE_PATHS[role]
    .map((selector) => {
      const [moduleId, lessonId] = selector.split(':');
      return findIndexedLesson(index, { lang, moduleId, lessonId });
    })
    .filter(Boolean)
    .map((lesson, order) => ({
      order: order + 1,
      moduleId: lesson.moduleId,
      lessonId: lesson.lessonId,
      title: lesson.title,
      moduleTitle: lesson.moduleTitle,
      path: lesson.path,
      citation: lesson.citation,
    }));

  return {
    role,
    lang,
    description: roleDescription(role),
    lessons,
  };
}

export async function composeContext(index, options = {}) {
  const topic = String(options.topic || '').trim();
  const lang = options.lang || 'zh';
  const limit = clampNumber(options.limit, 4, 1, 8);
  const maxChars = clampNumber(options.maxChars, 4000, 500, 12000);
  const search = searchContent(index, { query: topic, lang, limit, includeGlossary: true });

  const citations = [];
  const sections = [];
  let usedChars = 0;

  for (const result of search.results) {
    const title = result.type === 'lesson' ? `${result.moduleTitle} / ${result.title}` : result.term;
    const body = result.type === 'lesson' ? result.excerpt : result.definition;
    const citation = result.citation;
    const block = `## ${title}\n${body}\nCitation: ${citation.file}`;

    if (usedChars + block.length > maxChars && sections.length > 0) {
      break;
    }

    sections.push(block);
    citations.push(citation);
    usedChars += block.length;
  }

  return {
    topic,
    lang,
    context: sections.join('\n\n').slice(0, maxChars),
    citations,
    results: search.results,
  };
}

export function listMonetizableTools(index) {
  return index.tools.filter((tool) => tool.x402?.enabled);
}

export function createManifest(index) {
  return {
    schemaVersion: index.schemaVersion,
    generatedAt: index.generatedAt,
    repository: index.repository,
    languages: index.languages,
    counts: {
      modules: index.modules.length,
      lessons: index.lessons.length,
      glossaryEntries: index.glossary.length,
      tools: index.tools.length,
      futurePaidTools: listMonetizableTools(index).length,
    },
    artifacts: index.artifacts,
    mcp: {
      command: 'npm run mcp:web3',
      transport: 'stdio',
      readOnly: true,
    },
    tools: index.tools,
  };
}

export function createLlmsTxt(index) {
  const manifest = createManifest(index);
  return [
    '# Get Started With Web3 AI Index',
    '',
    'This repository exposes bilingual Web3 learning content for AI agents.',
    '',
    `Source: ${index.repository.sourceUrl}`,
    `Homepage: ${index.repository.homepage}`,
    `Generated: ${index.generatedAt}`,
    '',
    '## Artifacts',
    `- Manifest: ${manifest.artifacts.manifest}`,
    `- Content index: ${manifest.artifacts.contentIndex}`,
    '',
    '## Local MCP',
    '- Command: npm run mcp:web3',
    '- Transport: stdio',
    '- Mode: read-only',
    '',
    '## Tools',
    ...index.tools.map((tool) => {
      const price = tool.x402.enabled ? `future x402 $${tool.x402.priceUsd} on ${tool.x402.network}` : 'free';
      return `- ${tool.name}: ${tool.description} (${price})`;
    }),
    '',
    '## Public URLs',
    `- llms.txt: ${PUBLIC_AI_ENTRYPOINTS.llmsTxt}`,
    `- Manifest: ${PUBLIC_AI_ENTRYPOINTS.manifest}`,
    `- Content index: ${PUBLIC_AI_ENTRYPOINTS.contentIndex}`,
    '',
  ].join('\n');
}

function findLessonReadme(projectRoot, lang, lessonPath) {
  const lessonDir = path.join(projectRoot, lang, lessonPath);
  let entries;

  try {
    entries = readdirSync(lessonDir, { withFileTypes: true });
  } catch {
    return null;
  }

  for (const fileName of CONTENT_EXTENSIONS) {
    const entry = entries.find((candidate) => candidate.isFile() && candidate.name === fileName);
    if (entry) {
      const relativePath = path.join(lang, lessonPath, entry.name);
      return {
        absolutePath: path.join(projectRoot, relativePath),
        relativePath: normalizePath(relativePath),
      };
    }
  }

  return null;
}

function buildCitation(lang, moduleId, lessonId, relativePath) {
  const normalized = normalizePath(relativePath);
  return {
    file: normalized,
    githubUrl: `${GITHUB_BASE_URL}/${encodeURI(normalized).replace(/#/g, '%23')}`,
    siteUrl: `${SITE_BASE_URL}/${lang}/learn/${moduleId}/${lessonId}`,
  };
}

function extractMarkdownSignals(markdown) {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, ' ');
  const plain = withoutCode
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const headings = [];
  const headingPattern = /^(#{1,4})\s+(.+)$/gm;
  let match;
  while ((match = headingPattern.exec(markdown)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].replace(/[#`*_]/g, '').trim(),
    });
  }

  return {
    excerpt: plain.slice(0, 420),
    headings: headings.slice(0, 40),
    codeBlockCount: (markdown.match(/```/g) || []).length / 2,
  };
}

function findIndexedLesson(index, options) {
  return index.lessons.find((lesson) => {
    if (lesson.lang !== options.lang) return false;
    if (options.path && lesson.path === options.path) return true;
    return lesson.moduleId === options.moduleId && lesson.lessonId === options.lessonId;
  });
}

function scoreText(query, text) {
  const normalizedText = normalizeSearchText(text);
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery || !normalizedText) return 0;

  if (normalizedText.includes(normalizedQuery)) {
    return 100 + normalizedQuery.length;
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  const matchedTerms = terms.filter((term) => normalizedText.includes(term));
  if (matchedTerms.length === 0) return 0;

  return matchedTerms.length * 20 + matchedTerms.join('').length;
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePath(value) {
  return value.split(path.sep).join('/');
}

function clampNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(number)));
}

function roleDescription(role) {
  const descriptions = {
    beginner: '从钱包、交易和基础安全开始建立 Web3 操作直觉。',
    builder: '面向开发者，从身份、DApp、代币、区块浏览器和安全实践建立实战路径。',
    researcher: '面向技术研究者，覆盖比特币底层、脚本、DeFi 风险、跨链和 DAO 治理。',
    investor: '面向生态观察和投资研究，强调工具、DeFi、交易所和风险识别。',
  };
  return descriptions[role] || descriptions.beginner;
}
