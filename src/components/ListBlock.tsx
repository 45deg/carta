import { Check, Circle } from "lucide-react"

import {
  InlineMarkdownRenderer,
  MarkdownRenderer,
} from "@/components/PosterMarkdown"
import { type ListBlock as ListBlockType } from "@/schema/posterSchema"

type ListBlockProps = {
  block: ListBlockType
  embedded?: boolean
}

export function ListBlock({ block, embedded = false }: ListBlockProps) {
  const variant = block.variant ?? "bullets"

  return (
    <section
      className="poster-list"
      data-embedded={embedded ? "true" : "false"}
      data-variant={variant}
    >
      {block.title ? <h3 className="poster-list-title">{block.title}</h3> : null}
      <ul className="poster-list-items">
        {block.items.map((item, index) => (
          <li key={index} className="poster-list-item">
            {variant === "checklist" ? (
              <span className="poster-list-check" aria-hidden="true">
                {item.checked === false ? <Circle /> : <Check />}
              </span>
            ) : null}
            {variant === "definitions" ? (
              <div className="poster-list-definition">
                {item.term ? (
                  <span className="poster-list-term">
                    <InlineMarkdownRenderer text={item.term} />
                  </span>
                ) : null}
                <MarkdownRenderer text={item.body} />
              </div>
            ) : (
              <MarkdownRenderer text={item.body} />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
