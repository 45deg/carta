import { type CSSProperties } from "react"

import { DiagramBlock } from "@/components/DiagramBlock"
import { FlowBlock } from "@/components/FlowBlock"
import { ListBlock } from "@/components/ListBlock"
import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import { type CardContent } from "@/schema/posterSchema"

type CardContentRendererProps = {
  content: CardContent
}

export function CardContentRenderer({ content }: CardContentRendererProps) {
  switch (content.type) {
    case "markdown":
      return <MarkdownRenderer text={content.text} />
    case "diagram":
      return <DiagramBlock block={content} embedded />
    case "flow":
      return <FlowBlock block={content} embedded />
    case "list":
      return <ListBlock block={content} embedded />
    case "layout":
      return <CardLayout content={content} />
  }
}

function CardLayout({ content }: { content: Extract<CardContent, { type: "layout" }> }) {
  const template = content.size?.length
    ? content.size.map((size) => `${size}fr`).join(" ")
    : `repeat(${content.columns.length}, minmax(0, 1fr))`

  return (
    <div
      className="poster-card-layout"
      data-variant={content.variant}
      style={{ "--poster-card-layout-template": template } as CSSProperties}
    >
      {content.columns.map((column, columnIndex) => (
        <div key={columnIndex} className="poster-card-layout-column">
          {column.map((item, itemIndex) => (
            <CardContentRenderer key={itemIndex} content={item} />
          ))}
        </div>
      ))}
    </div>
  )
}
