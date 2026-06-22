import { type CSSProperties, forwardRef } from "react"

import { BlockRenderer } from "@/components/BlockRenderer"
import { InlineMarkdownRenderer } from "@/components/PosterMarkdown"
import { type Poster } from "@/schema/posterSchema"
import "@/styles/poster.css"

type PosterPreviewProps = {
  poster: Poster
  baseFontSize: number
  width: number | "fit"
  columnCount?: number
}

export const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(
  ({ poster, baseFontSize, width, columnCount }, ref) => {
    return (
      <article
        ref={ref}
        className="poster-root"
        style={
          {
            "--poster-base-font-size": `${baseFontSize}px`,
            "--poster-page-width":
              width === "fit" ? "100%" : `${width * (columnCount ?? 1)}px`,
            "--poster-column-count": columnCount ?? 1,
          } as CSSProperties
        }
      >
        <div className="poster-blocks" data-column-count={columnCount ?? 1}>
          <header className="poster-header">
            <h1>
              <InlineMarkdownRenderer text={poster.title} />
            </h1>
            <p>{poster.description}</p>
          </header>
          {poster.blocks.map((block, index) => (
            <BlockRenderer key={index} block={block} />
          ))}
        </div>
      </article>
    )
  }
)

PosterPreview.displayName = "PosterPreview"
