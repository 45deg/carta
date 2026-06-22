import { lazy, Suspense, type CSSProperties } from "react"

import { CardContentRenderer } from "@/components/CardContentRenderer"
import {
  InlineMarkdownRenderer,
  MarkdownRenderer,
} from "@/components/PosterMarkdown"
import {
  type CardBlock as CardBlockType,
  type PosterColor,
} from "@/schema/posterSchema"

type CardBlockProps = {
  block: CardBlockType
}

type PosterColorKind = "accent" | "neutral"

const LucideCardIcon = lazy(() =>
  import("@/components/LucideCardIcon").then((module) => ({
    default: module.LucideCardIcon,
  }))
)

const posterColorMap: Record<
  PosterColor,
  { hex: string; kind: PosterColorKind }
> = {
  danger: { hex: "#C92A2A", kind: "accent" },
  important: { hex: "#C2410C", kind: "accent" },
  default: { hex: "#171717", kind: "neutral" },
  supplement: { hex: "#4B5563", kind: "neutral" },
  procedure: { hex: "#15803D", kind: "accent" },
  concept: { hex: "#1D4ED8", kind: "accent" },
  term: { hex: "#6B21A8", kind: "accent" },
  context: { hex: "#5C2D16", kind: "accent" },
  note: { hex: "#4B5563", kind: "neutral" },
}

export function CardBlock({ block }: CardBlockProps) {
  const color =
    block.color && posterColorMap[block.color]
      ? posterColorMap[block.color]
      : posterColorMap["default"]
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
      data-color={
        block.color && posterColorMap[block.color] ? block.color : "default"
      }
      style={style}
    >
      <div className="poster-card-heading">
        {block.icon ? (
          <Suspense fallback={null}>
            <LucideCardIcon name={block.icon} fallbackEmoji={block.emoji} />
          </Suspense>
        ) : block.emoji ? (
          <span className="poster-card-emoji">{block.emoji}</span>
        ) : null}
        <h2>
          <InlineMarkdownRenderer text={block.title} />
        </h2>
      </div>
      <div className="poster-card-body">
        {typeof block.body === "string" ? (
          <MarkdownRenderer text={block.body} />
        ) : (
          block.body.map((content, index) => (
            <CardContentRenderer key={index} content={content} />
          ))
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
