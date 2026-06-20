let markdownRendererPromise:
  | Promise<typeof import("@/components/MarkdownRenderer")>
  | undefined

export function preloadMarkdownRenderer() {
  markdownRendererPromise ??= import("@/components/MarkdownRenderer")
  return markdownRendererPromise
}
