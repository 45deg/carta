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

export function MarkdownRenderer({ text }: MarkdownRendererProps) {
  return (
    <div className="poster-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkCjkFriendly]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      >
        {text}
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
