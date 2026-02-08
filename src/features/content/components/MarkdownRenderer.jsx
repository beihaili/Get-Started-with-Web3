import React from 'react';
import { ExternalLink, ChevronRight, Home, UserPlus, FileInput, Copy, Check } from 'lucide-react';
import { useState, useCallback } from 'react';

/**
 * Markdown 渲染器组件
 * 支持标题、列表、引用、多行代码块、表格、图片、链接等
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
      className="absolute top-3 right-3 p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
      title="复制代码"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

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
  let inCodeBlock = false;
  let codeBlockLines = [];
  let codeBlockLang = '';

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

  // 渲染 Markdown 表格
  const renderTable = (tableLines, startIndex) => {
    // 第一行是表头，第二行是分隔符，其余是数据行
    const headerLine = tableLines[0];
    const dataLines = tableLines.slice(2); // skip separator

    const parseTableCells = (line) =>
      line
        .split('|')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

    const headers = parseTableCells(headerLine);
    const rows = dataLines.map(parseTableCells);

    return (
      <div
        key={`table-${startIndex}`}
        className="my-6 overflow-x-auto rounded-lg border border-slate-700"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/80">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-slate-200 font-bold border-b border-slate-700"
                >
                  {parseInline(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/20'}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-3 text-slate-300 border-b border-slate-800">
                    {parseInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Pre-process: collect table regions and code block regions
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Handle code blocks
    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        flushTextBuffer();
        flushFooterBuffer();
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
        codeBlockLines = [];
        i++;
        continue;
      } else {
        // End of code block
        inCodeBlock = false;
        const codeText = codeBlockLines.join('\n');
        elements.push(
          <div key={`code-${i}`} className="relative my-6 group">
            {codeBlockLang && (
              <div className="absolute top-0 left-0 px-3 py-1 bg-slate-700 text-slate-400 text-xs font-mono rounded-tl-lg rounded-br-lg">
                {codeBlockLang}
              </div>
            )}
            <CopyButton text={codeText} />
            <pre className="bg-slate-950 p-4 pt-8 rounded-lg font-mono text-sm border border-slate-800 text-green-400 overflow-x-auto shadow-inner">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        codeBlockLines = [];
        codeBlockLang = '';
        i++;
        continue;
      }
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      i++;
      continue;
    }

    // Handle tables: detect table start (line with |, followed by separator line)
    if (trimmed.includes('|') && i + 1 < lines.length) {
      const nextTrimmed = lines[i + 1].trim();
      if (nextTrimmed.match(/^[\s|:-]+$/) && nextTrimmed.includes('|')) {
        flushTextBuffer();
        flushFooterBuffer();
        // Collect all table lines
        const tableLines = [trimmed];
        let j = i + 1;
        while (j < lines.length && lines[j].trim().includes('|')) {
          tableLines.push(lines[j].trim());
          j++;
        }
        elements.push(renderTable(tableLines, i));
        i = j;
        continue;
      }
    }

    // Skip empty lines and div tags
    if (
      !trimmed ||
      trimmed === '</div>' ||
      trimmed === '<div align="center">' ||
      trimmed.match(/^[-]+$/)
    ) {
      flushTextBuffer();
      i++;
      continue;
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
      i++;
      continue;
    }

    const isHeader = trimmed.match(/^#{1,6}\s/);
    const isList = trimmed.match(/^(\*|-|\d+\.)\s/);
    const isBlockquote = trimmed.startsWith('>');
    const isHr = trimmed.match(/^(-{3,}|\*{3,}|_{3,})$/);

    if (isHr) {
      flushTextBuffer();
      flushFooterBuffer();
      elements.push(<hr key={`hr-${i}`} className="my-8 border-slate-800" />);
      i++;
      continue;
    }

    if (isHeader || isList || isBlockquote) {
      flushTextBuffer();
      flushFooterBuffer();

      if (isHeader) {
        if (line.startsWith('# '))
          elements.push(
            <h1
              key={i}
              className="text-3xl md:text-4xl font-black text-white mt-12 mb-8 border-b border-slate-800 pb-4"
            >
              {parseInline(line.slice(2))}
            </h1>
          );
        else if (line.startsWith('## '))
          elements.push(
            <h2 key={i} className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">
              {parseInline(line.slice(3))}
            </h2>
          );
        else if (line.startsWith('### '))
          elements.push(
            <h3
              key={i}
              className="text-xl md:text-2xl font-bold text-cyan-400 mt-8 mb-4 flex items-center gap-2"
            >
              <ChevronRight className="w-5 h-5" />
              {parseInline(line.slice(4))}
            </h3>
          );
        else if (line.startsWith('#### '))
          elements.push(
            <h4
              key={i}
              className="text-lg md:text-xl font-bold text-cyan-200 mt-6 mb-3 pl-4 border-l-2 border-cyan-500/30"
            >
              {parseInline(line.slice(5))}
            </h4>
          );
        else if (line.startsWith('##### '))
          elements.push(
            <h5 key={i} className="text-base md:text-lg font-bold text-slate-200 mt-4 mb-2">
              {parseInline(line.slice(6))}
            </h5>
          );
      } else if (isList) {
        if (trimmed.match(/^(\*|-)\s/)) {
          elements.push(
            <div key={i} className="ml-4 flex items-start gap-3 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2.5 shrink-0"></div>
              <div className="flex-1">{parseInline(trimmed.substring(2))}</div>
            </div>
          );
        } else {
          const m = trimmed.match(/^(\d+\.)\s(.*)/);
          if (m) {
            elements.push(
              <div key={i} className="ml-4 flex gap-3 mb-1">
                <span className="font-bold text-cyan-500 shrink-0 font-mono">{m[1]}</span>
                <div className="flex-1">{parseInline(m[2])}</div>
              </div>
            );
          }
        }
      } else if (isBlockquote) {
        elements.push(
          <blockquote
            key={i}
            className="border-l-4 border-cyan-500/30 bg-slate-900/50 p-4 text-slate-400 rounded-r-lg my-4 text-base italic"
          >
            {parseInline(trimmed.slice(2))}
          </blockquote>
        );
      }
      i++;
      continue;
    }

    textBuffer.push(line);
    i++;
  }

  // Handle unclosed code block
  if (inCodeBlock && codeBlockLines.length > 0) {
    const codeText = codeBlockLines.join('\n');
    elements.push(
      <div key={`code-unclosed`} className="relative my-6">
        <pre className="bg-slate-950 p-4 rounded-lg font-mono text-sm border border-slate-800 text-green-400 overflow-x-auto shadow-inner">
          <code>{codeText}</code>
        </pre>
      </div>
    );
  }

  flushTextBuffer();
  flushFooterBuffer();

  return <div className="font-sans text-base">{elements}</div>;
};

export default MarkdownRenderer;
