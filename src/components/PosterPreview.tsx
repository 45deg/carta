import { type CSSProperties, forwardRef } from "react"

import { BlockRenderer } from "@/components/BlockRenderer"
import { type Poster } from "@/schema/posterSchema"
import "@/styles/poster.css"

type PosterPreviewProps = {
  poster: Poster
  baseFontSize: number
  width: number
}

export const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(
  ({ poster, baseFontSize, width }, ref) => {
    return (
      <article
        ref={ref}
        className="poster-root"
        style={
          {
            "--poster-base-font-size": `${baseFontSize}px`,
            "--poster-page-width": `${width}px`,
          } as CSSProperties
        }
      >
        <header className="poster-header">
          <h1>{poster.title}</h1>
          <p>{poster.description}</p>
        </header>
        <div className="poster-blocks">
          {poster.blocks.map((block, index) => (
            <BlockRenderer key={index} block={block} />
          ))}
        </div>
      </article>
    )
  }
)

PosterPreview.displayName = "PosterPreview"
