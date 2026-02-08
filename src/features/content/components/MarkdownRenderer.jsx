import { useState, useCallback, useMemo, memo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ExternalLink, ChevronRight, Copy, Check } from 'lucide-react';

/**
 * Markdown 渲染器组件
 * 基于 react-markdown，完整支持 GFM (GitHub Flavored Markdown)
 */

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
      title="复制代码"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

const MarkdownRendererInner = ({ content, basePath = '' }) => {
  const components = useMemo(() => {
    // 处理图片路径
    const resolveImageSrc = (src) => {
      if (!src) return src;
      if (src.startsWith('http')) return src;
      return basePath + src.replace('./', '');
    };

    return {
      // 标题
      h1: ({ children }) => (
        <h1 className="text-3xl md:text-4xl font-black text-white mt-12 mb-8 border-b border-slate-800 pb-4">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mt-8 mb-4 flex items-center gap-2">
          <ChevronRight className="w-5 h-5 shrink-0" />
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-lg md:text-xl font-bold text-cyan-200 mt-6 mb-3 pl-4 border-l-2 border-cyan-500/30">
          {children}
        </h4>
      ),
      h5: ({ children }) => (
        <h5 className="text-base md:text-lg font-bold text-slate-200 mt-4 mb-2">{children}</h5>
      ),
      h6: ({ children }) => (
        <h6 className="text-sm font-bold text-slate-300 mt-3 mb-1">{children}</h6>
      ),

      // 段落
      p: ({ children, node }) => {
        // 检测是否是纯图片段落
        const hasOnlyImages =
          node.children?.length > 0 &&
          node.children.every(
            (child) => child.tagName === 'img' || (child.type === 'text' && !child.value.trim())
          );
        if (hasOnlyImages) {
          return <div className="flex flex-wrap justify-center gap-2 my-6">{children}</div>;
        }
        return <p className="mb-4 text-slate-300 leading-7">{children}</p>;
      },

      // 链接
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 transition-colors inline-flex items-center gap-1"
        >
          {children} <ExternalLink className="w-3 h-3" />
        </a>
      ),

      // 图片
      img: ({ src, alt, width }) => (
        <span className="inline-flex m-1 align-middle">
          <img
            src={resolveImageSrc(src)}
            alt={alt || 'Image'}
            loading="lazy"
            className="rounded-lg max-w-full h-auto shadow-lg"
            style={{ maxHeight: '500px', width: width ? `${width}px` : 'auto' }}
          />
        </span>
      ),

      // 粗体
      strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,

      // 行内代码
      code: ({ children, className, node, ...props }) => {
        // 多行代码块 (由 pre > code 结构包裹时 className 会包含语言)
        const isCodeBlock = className || (node?.position && props.inline === undefined);
        if (isCodeBlock && className) {
          const lang = className?.replace('language-', '') || '';
          const codeText = String(children).replace(/\n$/, '');
          return (
            <div className="relative my-6 group">
              {lang && (
                <div className="absolute top-0 left-0 px-3 py-1 bg-slate-700 text-slate-400 text-xs font-mono rounded-tl-lg rounded-br-lg z-10">
                  {lang}
                </div>
              )}
              <CopyButton text={codeText} />
              <pre className="bg-slate-950 p-4 pt-8 rounded-lg font-mono text-sm border border-slate-800 text-green-400 overflow-x-auto shadow-inner">
                <code>{codeText}</code>
              </pre>
            </div>
          );
        }
        // 行内代码
        return (
          <code className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-700">
            {children}
          </code>
        );
      },

      // pre 标签（包裹代码块）
      pre: ({ children, node }) => {
        // 获取代码内容用于复制
        const codeNode = node?.children?.[0];
        const codeText = codeNode?.children?.[0]?.value || '';
        const lang = codeNode?.properties?.className?.[0]?.replace('language-', '') || '';

        return (
          <div className="relative my-6 group">
            {lang && (
              <div className="absolute top-0 left-0 px-3 py-1 bg-slate-700 text-slate-400 text-xs font-mono rounded-tl-lg rounded-br-lg z-10">
                {lang}
              </div>
            )}
            <CopyButton text={codeText} />
            <pre className="bg-slate-950 p-4 pt-8 rounded-lg font-mono text-sm border border-slate-800 text-green-400 overflow-x-auto shadow-inner">
              {children}
            </pre>
          </div>
        );
      },

      // 列表
      ul: ({ children }) => <ul className="ml-2 mb-4 space-y-1">{children}</ul>,
      ol: ({ children }) => <ol className="ml-2 mb-4 space-y-1 counter-reset-list">{children}</ol>,
      li: ({ children, ordered, index }) => {
        if (ordered) {
          return (
            <li className="ml-4 flex gap-3 mb-1">
              <span className="font-bold text-cyan-500 shrink-0 font-mono">
                {(index ?? 0) + 1}.
              </span>
              <div className="flex-1">{children}</div>
            </li>
          );
        }
        return (
          <li className="ml-4 flex items-start gap-3 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2.5 shrink-0"></div>
            <div className="flex-1">{children}</div>
          </li>
        );
      },

      // 引用
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-cyan-500/30 bg-slate-900/50 p-4 text-slate-400 rounded-r-lg my-4 text-base italic">
          {children}
        </blockquote>
      ),

      // 表格
      table: ({ children }) => (
        <div className="my-6 overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-sm">{children}</table>
        </div>
      ),
      thead: ({ children }) => <thead>{children}</thead>,
      tbody: ({ children }) => <tbody>{children}</tbody>,
      tr: ({ children, isHeader }) => (
        <tr className={isHeader ? 'bg-slate-800/80' : 'even:bg-slate-900/40 odd:bg-slate-900/20'}>
          {children}
        </tr>
      ),
      th: ({ children }) => (
        <th className="px-4 py-3 text-left text-slate-200 font-bold border-b border-slate-700">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="px-4 py-3 text-slate-300 border-b border-slate-800">{children}</td>
      ),

      // 水平线
      hr: () => <hr className="my-8 border-slate-800" />,

      // 分隔
      br: () => <br />,
    };
  }, [basePath]);

  return (
    <div className="font-sans text-base markdown-content">
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
        {content}
      </Markdown>
    </div>
  );
};

const MarkdownRenderer = memo(MarkdownRendererInner);
export default MarkdownRenderer;
