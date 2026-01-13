import React from 'react';
import { ExternalLink, ChevronRight, Home, UserPlus, FileInput } from 'lucide-react';

/**
 * Markdown渲染器组件
 * 从原App.jsx迁移并简化 (lines 2490-2652)
 * 支持标题、列表、引用、代码块、图片、链接等
 */
const MarkdownRenderer = ({ content, basePath = '' }) => {
  // 解析内联元素（链接、图片、粗体、代码等）
  const parseInline = (text) => {
    if (!text) return null;
    const regex =
      /(<img[^>]+>|<a\s+[^>]*href=["'][^"']+["'][^>]*>.*?<\/a>|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)|`.*?`|\*\*.*?\*\*)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;
      if (part.trim().match(/^<\/?div.*?>$/)) return null;

      // HTML img标签
      if (part.match(/^<img/)) {
        const srcMatch = part.match(/src=["']([^"']+)["']/);
        const widthMatch = part.match(/width\s*=\s*["']?(\d+)["']?/);
        if (srcMatch) {
          let src = srcMatch[1];
          if (src.startsWith('./') || src.startsWith('img/')) {
            src = basePath + src.replace('./', '');
          }
          const width = widthMatch ? widthMatch[1] : undefined;
          return (
            <span key={index} className="inline-flex m-1 align-middle">
              <img
                src={src}
                alt="Image"
                className="rounded-lg max-w-full h-auto"
                style={{ maxHeight: '500px', width: width ? `${width}px` : 'auto' }}
              />
            </span>
          );
        }
      }

      // HTML链接
      const htmlLinkMatch = part.match(/^<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>$/);
      if (htmlLinkMatch) {
        return (
          <a
            key={index}
            href={htmlLinkMatch[1]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 transition-colors inline-flex items-center gap-1 mx-1"
          >
            {htmlLinkMatch[2]} <ExternalLink className="w-3 h-3" />
          </a>
        );
      }

      // Markdown图片
      const mdImgMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
      if (mdImgMatch) {
        let src = mdImgMatch[2];
        if (!src.startsWith('http')) src = basePath + src.replace('./', '');
        return (
          <span key={index} className="inline-flex m-1 align-middle">
            <img
              src={src}
              alt={mdImgMatch[1]}
              className="rounded-lg max-w-full h-auto shadow-lg"
              style={{ maxHeight: '500px' }}
            />
          </span>
        );
      }

      // Markdown链接
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a
            key={index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 transition-colors inline-flex items-center gap-1"
          >
            {linkMatch[1]} <ExternalLink className="w-3 h-3" />
          </a>
        );
      }

      // 粗体
      const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
      if (boldMatch)
        return (
          <strong key={index} className="text-white font-bold">
            {boldMatch[1]}
          </strong>
        );

      // 行内代码
      const codeMatch = part.match(/^`(.*?)`$/);
      if (codeMatch)
        return (
          <code
            key={index}
            className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-700"
          >
            {codeMatch[1]}
          </code>
        );

      return part;
    });
  };

  const lines = content.split('\n');
  const elements = [];
  let textBuffer = [];
  let footerLinkBuffer = [];

  const flushFooterBuffer = () => {
    if (footerLinkBuffer.length > 0) {
      elements.push(
        <div
          key={`footer-${elements.length}`}
          className="flex flex-wrap gap-4 justify-center mt-8 pt-8 border-t border-slate-800"
        >
          {footerLinkBuffer.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 rounded-full text-white font-bold text-sm transition-all transform hover:scale-105 shadow-lg group"
            >
              {item.text.includes('🏠') && (
                <Home className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
              )}
              {item.text.includes('🐦') && (
                <UserPlus className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
              )}
              {item.text.includes('📝') && (
                <FileInput className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
              )}
              <span>{item.text.replace(/🏠|🐦|📝/g, '').trim()}</span>
            </a>
          ))}
        </div>
      );
      footerLinkBuffer = [];
    }
  };

  const flushTextBuffer = () => {
    if (textBuffer.length > 0) {
      const allImages = textBuffer.every((l) => l.match(/<img|!\[/));
      if (allImages) {
        elements.push(
          <div
            key={`badges-${elements.length}`}
            className="flex flex-wrap justify-center gap-2 my-6"
          >
            {textBuffer.map((line, i) => (
              <React.Fragment key={i}>{parseInline(line)}</React.Fragment>
            ))}
          </div>
        );
      } else {
        elements.push(
          <div key={`text-${elements.length}`} className="mb-4 text-slate-300 leading-7">
            {textBuffer.map((line, i) => (
              <React.Fragment key={i}>
                {parseInline(line)}
                {i < textBuffer.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        );
      }
      textBuffer = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed === '</div>' ||
      trimmed === '<div align="center">' ||
      trimmed.match(/^[-|]+$/)
    ) {
      flushTextBuffer();
      return;
    }

    // 检测页脚链接
    if (
      trimmed.includes('返回主页') ||
      trimmed.includes('关注作者') ||
      trimmed.includes('加入交流群')
    ) {
      flushTextBuffer();
      const mdMatch = trimmed.match(/\[(.*?)\]\((.*?)\)/);
      const htmlMatch = trimmed.match(/href=["'](.*?)["']>(.*?)<\/a>/);
      if (htmlMatch) footerLinkBuffer.push({ text: htmlMatch[2], url: htmlMatch[1] });
      else if (mdMatch) footerLinkBuffer.push({ text: mdMatch[1], url: mdMatch[2] });
      return;
    }

    const isHeader = trimmed.match(/^#{1,6}\s/);
    const isList = trimmed.match(/^(\*|-|\d\.)\s/);
    const isBlockquote = trimmed.startsWith('>');
    const isCodeBlockStart = trimmed.startsWith('```');
    const isPseudoCode =
      trimmed.startsWith('//') ||
      trimmed.startsWith('const') ||
      trimmed.startsWith('import') ||
      trimmed.startsWith('$') ||
      trimmed.startsWith('npm');

    if (isHeader || isList || isBlockquote || isCodeBlockStart || isPseudoCode) {
      flushTextBuffer();
      flushFooterBuffer();

      if (isHeader) {
        if (line.startsWith('# '))
          elements.push(
            <h1
              key={index}
              className="text-3xl md:text-4xl font-black text-white mt-12 mb-8 border-b border-slate-800 pb-4"
            >
              {parseInline(line.slice(2))}
            </h1>
          );
        else if (line.startsWith('## '))
          elements.push(
            <h2 key={index} className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">
              {parseInline(line.slice(3))}
            </h2>
          );
        else if (line.startsWith('### '))
          elements.push(
            <h3
              key={index}
              className="text-xl md:text-2xl font-bold text-cyan-400 mt-8 mb-4 flex items-center gap-2"
            >
              <ChevronRight className="w-5 h-5" />
              {parseInline(line.slice(4))}
            </h3>
          );
        else if (line.startsWith('#### '))
          elements.push(
            <h4
              key={index}
              className="text-lg md:text-xl font-bold text-cyan-200 mt-6 mb-3 pl-4 border-l-2 border-cyan-500/30"
            >
              {parseInline(line.slice(5))}
            </h4>
          );
      } else if (isList) {
        if (trimmed.match(/^(\*|-)\s/)) {
          elements.push(
            <div key={index} className="ml-4 flex items-start gap-3 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2.5 shrink-0"></div>
              <div className="flex-1">{parseInline(trimmed.substring(2))}</div>
            </div>
          );
        } else {
          const m = trimmed.match(/^(\d\.)\s(.*)/);
          if (m) {
            elements.push(
              <div key={index} className="ml-4 flex gap-3 mb-1">
                <span className="font-bold text-cyan-500 shrink-0 font-mono">{m[1]}</span>
                <div className="flex-1">{parseInline(m[2])}</div>
              </div>
            );
          }
        }
      } else if (isBlockquote) {
        elements.push(
          <blockquote
            key={index}
            className="border-l-4 border-cyan-500/30 bg-slate-900/50 p-4 text-slate-400 rounded-r-lg my-4 text-base italic"
          >
            {parseInline(trimmed.slice(2))}
          </blockquote>
        );
      } else if (isPseudoCode) {
        elements.push(
          <div
            key={index}
            className="bg-slate-950 p-4 rounded-lg font-mono text-sm border border-slate-800 my-4 text-green-400 overflow-x-auto shadow-inner whitespace-pre"
          >
            {line}
          </div>
        );
      }
      return;
    }

    textBuffer.push(line);
  });

  flushTextBuffer();
  flushFooterBuffer();

  return <div className="font-sans text-base">{elements}</div>;
};

export default MarkdownRenderer;
