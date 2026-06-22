import {
  InlineMarkdownRenderer,
  MarkdownRenderer,
} from "@/components/PosterMarkdown"
import { type FlowBlock as FlowBlockType } from "@/schema/posterSchema"

type FlowBlockProps = {
  block: FlowBlockType
  embedded?: boolean
}

export function FlowBlock({ block, embedded = false }: FlowBlockProps) {
  const variant = block.variant ?? "steps"
  const direction =
    block.direction ?? (variant === "timeline" ? "vertical" : "horizontal")

  return (
    <section
      className="poster-flow"
      data-embedded={embedded ? "true" : "false"}
      data-variant={variant}
      data-direction={direction}
    >
      {block.title ? (
        <h3 className="poster-flow-title">
          <InlineMarkdownRenderer text={block.title} />
        </h3>
      ) : null}
      <ol className="poster-flow-items">
        {block.items.map((item, index) => (
          <li key={index} className="poster-flow-item">
            <span className="poster-flow-marker">{index + 1}</span>
            <div className="poster-flow-content">
              <h4>
                <InlineMarkdownRenderer text={item.title} />
              </h4>
              <MarkdownRenderer text={item.body} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
