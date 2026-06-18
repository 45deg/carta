import "katex/dist/katex.min.css"

import ReactMarkdown from "react-markdown"
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
        rehypePlugins={[rehypeKatex]}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}

