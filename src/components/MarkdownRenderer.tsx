import "katex/dist/katex.min.css"
import "highlight.js/styles/github.css"

import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import remarkCjkFriendly from "remark-cjk-friendly"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

type MarkdownRendererProps = {
  text: string
}

function normalizeDisplayMath(text: string) {
  return text.replace(
    /^([ \t]*)\$\$([^\n]*\S[^\n]*)\$\$[ \t]*$/gm,
    (_match, indent: string, formula: string) =>
      `${indent}$$\n${indent}${formula}\n${indent}$$`
  )
}

export function MarkdownRenderer({ text }: MarkdownRendererProps) {
  const normalizedText = normalizeDisplayMath(text)

  return (
    <div className="poster-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkCjkFriendly]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      >
        {normalizedText}
      </ReactMarkdown>
    </div>
  )
}

export function InlineMarkdownRenderer({ text }: MarkdownRendererProps) {
  return (
    <span className="poster-inline-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkCjkFriendly]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          p: ({ children }) => <>{children}</>,
        }}
      >
        {text}
      </ReactMarkdown>
    </span>
  )
}
