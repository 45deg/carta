import { lazy, Suspense } from "react"

import type { MarkdownRendererProps } from "@/components/MarkdownRenderer"

let markdownRendererPromise:
  | Promise<typeof import("@/components/MarkdownRenderer")>
  | undefined

const loadMarkdownRenderer = () => {
  markdownRendererPromise ??= import("@/components/MarkdownRenderer")
  return markdownRendererPromise
}

const LazyMarkdownRenderer = lazy(() =>
  loadMarkdownRenderer().then((module) => ({
    default: module.MarkdownRenderer,
  })),
)

const LazyInlineMarkdownRenderer = lazy(() =>
  loadMarkdownRenderer().then((module) => ({
    default: module.InlineMarkdownRenderer,
  })),
)

export function MarkdownRenderer(props: MarkdownRendererProps) {
  return (
    <Suspense fallback={null}>
      <LazyMarkdownRenderer {...props} />
    </Suspense>
  )
}

export function InlineMarkdownRenderer(props: MarkdownRendererProps) {
  return (
    <Suspense fallback={null}>
      <LazyInlineMarkdownRenderer {...props} />
    </Suspense>
  )
}
