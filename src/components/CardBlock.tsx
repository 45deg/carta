import { type CSSProperties } from "react"

import { DiagramBlock } from "@/components/DiagramBlock"
import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import {
  type CardBlock as CardBlockType,
  type PosterColor,
} from "@/schema/posterSchema"

type CardBlockProps = {
  block: CardBlockType
}

type PosterColorKind = "accent" | "neutral"

const posterColorMap: Record<
  PosterColor,
  { hex: string; kind: PosterColorKind }
> = {
  red: { hex: "#FF4B00", kind: "accent" },
  yellow: { hex: "#FFF100", kind: "accent" },
  green: { hex: "#03AF7A", kind: "accent" },
  blue: { hex: "#005AFF", kind: "accent" },
  sky: { hex: "#4DC4FF", kind: "accent" },
  pink: { hex: "#FF8082", kind: "accent" },
  orange: { hex: "#F6AA00", kind: "accent" },
  purple: { hex: "#990099", kind: "accent" },
  brown: { hex: "#804000", kind: "accent" },
  white: { hex: "#FFFFFF", kind: "neutral" },
  "light gray": { hex: "#F3F4F6", kind: "neutral" },
  gray: { hex: "#84919E", kind: "neutral" },
  black: { hex: "#000000", kind: "neutral" },
}

export function CardBlock({ block }: CardBlockProps) {
  const color = posterColorMap[block.color ?? "blue"]
  const style = {
    "--poster-card-color": color.hex,
    "--poster-card-kind": color.kind,
    "--poster-card-accent": color.hex,
    "--poster-card-accent-text": readableTextColor(color.hex),
    "--poster-card-border": color.hex,
    "--poster-card-surface": "#ffffff",
  } as CSSProperties

  return (
    <section
      className="poster-card"
      data-color={block.color ?? "blue"}
      style={style}
    >
      <div className="poster-card-heading">
        {block.emoji ? (
          <span className="poster-card-emoji">{block.emoji}</span>
        ) : null}
        <h2>{block.title}</h2>
      </div>
      <div className="poster-card-body">
        {typeof block.body === "string" ? (
          <MarkdownRenderer text={block.body} />
        ) : (
          block.body.map((content, index) =>
            content.type === "markdown" ? (
              <MarkdownRenderer key={index} text={content.text} />
            ) : (
              <DiagramBlock key={index} block={content} embedded />
            )
          )
        )}
      </div>
    </section>
  )
}

function readableTextColor(hex: string) {
  const normalized = hex.replace("#", "")
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.62 ? "#171717" : "#ffffff"
}
