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

  // Clean content
  const cleanedContent = content
    .replace(/^([ \t]*[*-+] )[\r\n]+/gm, '$1')
    .replace(/\n{3,}/g, '\n\n');

  return (
    <div suppressHydrationWarning className="markdown-content break-words overflow-wrap-anywhere prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Table - Modern card-style with rounded corners
          table: ({ children }) => (
            <div className="my-5 overflow-hidden rounded-xl border border-[#E5E7EB] shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#E5E7EB]">
                  {children}
                </table>
              </div>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6]">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[#F3F4F6] bg-white">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="transition-colors hover:bg-[#FAFAFA]">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#6B7280] whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-[#374151] align-top">
              <div className="max-w-xs break-words leading-relaxed">{children}</div>
            </td>
          ),
          
          // Headings - Modern with subtle gradient accent
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-[#111827] mt-6 mb-4 first:mt-0 pb-2 border-b border-[#E5E7EB]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-[#111827] mt-6 mb-3 first:mt-0 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-[#9A8FEA] to-[#65B4FF]"></span>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-[#374151] mt-5 mb-2 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-semibold text-[#4B5563] mt-4 mb-2 first:mt-0">
              {children}
            </h4>
          ),
          
          // Lists - Clean with proper spacing
          ul: ({ children }) => (
            <ul className="my-3 space-y-2 text-[#374151]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 space-y-2 text-[#374151] list-decimal list-outside ml-5">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm leading-relaxed flex items-start gap-2">
              <span className="text-[#9A8FEA] mt-1.5 shrink-0">•</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          
          // Code - Syntax highlighting style
          pre: ({ children }) => (
            <div className="my-4 rounded-xl overflow-hidden border border-[#E5E7EB] shadow-sm">
              <div className="flex items-center gap-1.5 px-4 py-2 bg-[#1F2937] border-b border-[#374151]">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
              </div>
              <pre className="p-4 bg-[#111827] overflow-x-auto">
                <code className="text-sm font-mono text-[#E5E7EB] whitespace-pre-wrap break-words">
                  {children}
                </code>
              </pre>
            </div>
          ),
          code: ({ node, className, children, ...props }: any) => {
            const inline = !className;
            return inline ? (
              <code 
                className="px-1.5 py-0.5 bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] text-[#7C3AED] rounded-md text-sm font-mono font-medium" 
                {...props}
              >
                {children}
              </code>
            ) : (
              <code className="break-words text-[#E5E7EB]" {...props}>
                {children}
              </code>
            );
          },
          
          // Links - Branded gradient on hover
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7C3AED] font-medium underline decoration-[#7C3AED]/30 underline-offset-2 hover:decoration-[#7C3AED] transition-all cursor-pointer"
            >
              {children}
            </a>
          ),
          
          // Blockquote - Modern with gradient border
          blockquote: ({ children }) => (
            <blockquote className="my-4 pl-4 py-3 border-l-4 border-gradient-to-b from-[#9A8FEA] to-[#65B4FF] bg-gradient-to-r from-[#F9FAFB] to-transparent rounded-r-lg" style={{ borderImage: 'linear-gradient(to bottom, #9A8FEA, #65B4FF) 1' }}>
              <div className="text-sm text-[#6B7280] italic leading-relaxed">{children}</div>
            </blockquote>
          ),
          
          // Paragraph - Proper spacing and line height
          p: ({ children }) => (
            <p className="text-sm text-[#374151] leading-relaxed my-3 first:mt-0 last:mb-0">
              {children}
            </p>
          ),
          
          // Strong/Bold - Slightly darker
          strong: ({ children }) => (
            <strong className="font-semibold text-[#111827]">{children}</strong>
          ),
          
          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-[#6B7280]">{children}</em>
          ),
          
          // Horizontal rule - Gradient line
          hr: () => (
            <hr className="my-6 h-px border-0 bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />
          ),
          
          // Images - Rounded with shadow
          img: ({ src, alt }) => (
            <img 
              src={src} 
              alt={alt || ''} 
              className="my-4 rounded-xl shadow-md max-w-full h-auto"
            />
          ),
        }}
      >
        {cleanedContent}
      </ReactMarkdown>
    </div>
  );
}

export default memo(MarkdownMessage);
