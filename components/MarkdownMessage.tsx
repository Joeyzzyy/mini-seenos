'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownMessageProps {
  content: string;
}

function MarkdownMessage({ content }: MarkdownMessageProps) {
  // Detect if content is todo/task tracker related
  const isTodoContent = content.includes('# Conversation Task Tracker') ||
    content.includes('conversation-tracker-') ||
    content.toLowerCase().includes('task list') ||
    content.toLowerCase().includes('# task') ||
    /## task #\d+/i.test(content) ||
    content.toLowerCase().includes('todo') ||
    /- \[[ x]\]/i.test(content) ||
    /\*\*status:\*\*.*?🟡|🟢|🔴/i.test(content) ||
    content.includes('### Execution Plan') ||
    content.includes('### Progress Log');

  // Don't render todo content in chat - it's shown in Latest Task sidebar
  if (isTodoContent) {
    return null;
  }

  // Clean content: 
  // 1. Remove empty lines immediately following a bullet point to prevent "empty bullets"
  // 2. Collapse 3+ newlines into 2 to avoid excessive spacing
  const cleanedContent = content
    .replace(/^([ \t]*[*-+] )[\r\n]+/gm, '$1')
    .replace(/\n{3,}/g, '\n\n');

  return (
    <div suppressHydrationWarning className="markdown-content break-words overflow-wrap-anywhere">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Table
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto">
            <table className="min-w-full border-collapse border border-[#E5E5E5]">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-[#FAFAFA]">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="bg-white">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="border-b border-[#E5E5E5]">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left text-sm font-semibold text-[#111827] border-r border-[#E5E5E5] last:border-r-0">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-sm text-[#374151] border-r border-[#E5E5E5] last:border-r-0">
            {children}
          </td>
        ),
        // Headings
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-[#111827] mt-6 mb-4 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-[#111827] mt-5 mb-3 first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-[#111827] mt-4 mb-2 first:mt-0">
            {children}
          </h3>
        ),
        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-5 my-3 space-y-1 text-[#374151]">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-5 my-3 space-y-1 text-[#374151]">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-sm leading-relaxed mb-1 last:mb-0">{children}</li>
        ),
        // Code
        pre: ({ children }) => (
          <div className="bg-[#F3F4F6] rounded-lg p-3 my-3 overflow-hidden">
            <pre className="whitespace-pre-wrap break-words text-sm font-mono text-[#374151]">
              {children}
            </pre>
          </div>
        ),
        code: ({ node, className, children, ...props }: any) => {
          const inline = !className;
          return inline ? (
            <code className="px-1.5 py-0.5 bg-[#F3F4F6] text-[#374151] rounded text-sm font-mono break-words" {...props}>
              {children}
            </code>
          ) : (
            <code className="break-words" {...props}>
              {children}
            </code>
          );
        },
        // Links
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#374151] underline hover:text-[#111827] transition-colors"
          >
            {children}
          </a>
        ),
        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-[#E5E5E5] pl-4 py-2 my-3 text-[#6B7280] italic">
            {children}
          </blockquote>
        ),
        // Paragraph
        p: ({ children }) => (
          <p className="text-sm leading-relaxed my-2 first:mt-0 last:mb-0">{children}</p>
        ),
        // Strong/Bold
        strong: ({ children }) => (
          <strong className="font-semibold text-[#111827]">{children}</strong>
        ),
        // Emphasis/Italic
        em: ({ children }) => <em className="italic">{children}</em>,
        // Horizontal rule
        hr: () => <hr className="my-4 border-t border-[#E5E5E5]" />,
      }}
      >
        {cleanedContent}
      </ReactMarkdown>
    </div>
  );
}

export default memo(MarkdownMessage);

