"use client";

import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect } from "react";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="prose prose-invert max-w-none text-sm leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 mt-6">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-3 mt-5">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent mb-2 mt-4">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-gray-200 leading-relaxed mb-4 text-sm">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="space-y-2 mb-4 ml-4">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="space-y-2 mb-4 ml-4">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-200 text-sm flex items-start">
                <span className="text-purple-400 mr-2 mt-1">•</span>
                <span>{children}</span>
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gradient-to-b from-purple-500 to-blue-500 bg-gradient-to-r from-purple-900/20 to-blue-900/20 pl-4 py-2 my-4 rounded-r-lg">
                <div className="text-gray-300 italic">{children}</div>
              </blockquote>
            ),
            code({
              inline,
              className,
              children = null,
              node,
              ...props
            }: {
              inline?: boolean;
              className?: string;
              children?: React.ReactNode;
              node?: any;
            }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const codeString = String(children).replace(/\n$/, "");

              if (inline) {
                return (
                  <code
                    className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 px-2 py-1 rounded-md font-mono text-xs border border-purple-500/30 hover:border-purple-400/50 transition-colors duration-200"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <div className="relative group my-6 hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-4 py-3 rounded-t-lg border border-purple-500/20 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500"></div>
                      <span className="text-xs font-medium text-purple-300 uppercase tracking-wide ml-2">
                        {language || "code"}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(codeString)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-3 py-1.5 rounded-md font-medium shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                    >
                      {copiedCode === codeString ? "✓ Copied!" : "Copy"}
                    </button>
                  </div>

                  <div className="relative overflow-hidden rounded-b-lg border-x border-b border-purple-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none animate-pulse" />
                    <SyntaxHighlighter
                      style={{
                        ...oneDark,
                        'pre[class*="language-"]': {
                          ...oneDark['pre[class*="language-"]'],
                          background:
                            "linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #0f172a 70%, #1e293b 100%)",
                          margin: 0,
                          padding: "1.5rem",
                          fontSize: "0.875rem",
                          lineHeight: "1.6",
                        },
                        'code[class*="language-"]': {
                          ...oneDark['code[class*="language-"]'],
                          background: "transparent",
                          fontSize: "0.875rem",
                          lineHeight: "1.6",
                        },
                      }}
                      language={language}
                      PreTag="div"
                      showLineNumbers={codeString.split("\n").length > 3}
                      lineNumberStyle={{
                        color: "#6b7280",
                        fontSize: "0.75rem",
                        paddingRight: "1rem",
                        borderRight: "1px solid #374151",
                        marginRight: "1rem",
                        minWidth: "2rem",
                      }}
                      customStyle={{
                        background:
                          "linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #0f172a 70%, #1e293b 100%)",
                        border: "none",
                        borderRadius: "0",
                        margin: 0,
                        padding: "1.5rem",
                      }}
                      {...props}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownRenderer;
