import { z } from "zod"
import mermaid from "mermaid"

export const posterColors = [
  "red",
  "yellow",
  "green",
  "blue",
  "sky",
  "pink",
  "orange",
  "purple",
  "brown",
  "white",
  "light gray",
  "gray",
  "black",
] as const

export const diagramFormats = ["mermaid", "vega_lite"] as const

const vegaLiteBodySchema = z.any().refine((value) => value !== undefined, {
  message: "diagram.body is required",
})

const markdownContentSchema = z.object({
  type: z.literal("markdown"),
  text: z.string().min(1, "markdown.text is required"),
})

const mermaidDiagramContentSchema = z.object({
  type: z.literal("diagram"),
  format: z.literal("mermaid"),
  width: z.number().min(1).max(100).optional(),
  body: z.string().min(1, "diagram.body is required"),
  caption: z.string().min(1, "diagram.caption is required"),
})

const vegaLiteDiagramContentSchema = z.object({
  type: z.literal("diagram"),
  format: z.literal("vega_lite"),
  width: z.number().min(1).max(100).optional(),
  body: vegaLiteBodySchema,
  caption: z.string().min(1, "diagram.caption is required"),
})

const diagramContentSchema = z.union([
  mermaidDiagramContentSchema,
  vegaLiteDiagramContentSchema,
])

const cardContentSchema = z.union([
  markdownContentSchema,
  diagramContentSchema,
])

type BlockSchema = z.ZodType<CardBlock | ColumnsBlock | DiagramBlock>

const blockSchema: BlockSchema = z.lazy(() =>
  z.union([
    z.object({
      type: z.literal("card"),
      title: z.string().min(1, "card.title is required"),
      emoji: z.string().optional(),
      color: z.enum(posterColors).optional(),
      body: z.union([
        z.string().min(1, "card.body is required"),
        z
          .array(cardContentSchema)
          .min(1, "card.body must have at least 1 item"),
      ]),
    }),
    z.object({
      type: z.literal("columns"),
      size: z.array(z.number().positive()).optional(),
      columns: z
        .array(blockSchema)
        .min(1, "columns.columns must have at least 1 item"),
    }),
    z.object({
      type: z.literal("diagram"),
      format: z.literal("mermaid"),
      title: z.string().optional(),
      width: z.number().min(1).max(100).optional(),
      body: z.string().min(1, "diagram.body is required"),
      caption: z.string().min(1, "diagram.caption is required"),
    }),
    z.object({
      type: z.literal("diagram"),
      format: z.literal("vega_lite"),
      title: z.string().optional(),
      width: z.number().min(1).max(100).optional(),
      body: vegaLiteBodySchema,
      caption: z.string().min(1, "diagram.caption is required"),
    }),
  ])
)

export const posterSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  blocks: z.array(blockSchema).min(1, "blocks must have at least 1 item"),
})

export type Poster = z.infer<typeof posterSchema>
export type Block = Poster["blocks"][number]
export type CardBlock = {
  type: "card"
  title: string
  emoji?: string
  color?: PosterColor
  body: string | CardContent[]
}
export type CardContent = MarkdownContent | DiagramContent
export type MarkdownContent = {
  type: "markdown"
  text: string
}
export type DiagramContent = MermaidDiagramContent | VegaLiteDiagramContent
export type MermaidDiagramContent = {
  type: "diagram"
  format: "mermaid"
  width?: number
  body: string
  caption: string
}
export type VegaLiteDiagramContent = {
  type: "diagram"
  format: "vega_lite"
  width?: number
  body: VegaLiteBody
  caption: string
}
export type ColumnsBlock = {
  type: "columns"
  size?: number[]
  columns: Block[]
}
export type DiagramBlock = MermaidDiagramBlock | VegaLiteDiagramBlock
export type MermaidDiagramBlock = {
  type: "diagram"
  format: "mermaid"
  title?: string
  width?: number
  body: string
  caption: string
}
export type VegaLiteDiagramBlock = {
  type: "diagram"
  format: "vega_lite"
  title?: string
  width?: number
  body: VegaLiteBody
  caption: string
}
export type PosterColor = (typeof posterColors)[number]
export type DiagramFormat = (typeof diagramFormats)[number]
export type VegaLiteBody = unknown

export type PosterValidationResult =
  | { ok: true; poster: Poster; message: string }
  | { ok: false; message: string; llmMessage: string }

export async function parsePosterJson(
  source: string
): Promise<PosterValidationResult> {
  try {
    const value: unknown = JSON.parse(source)
    const parsed = posterSchema.safeParse(value)

    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join(".") : "(root)"
        return `- ${path}: ${issue.message}`
      })
      const message = issues.join("\n")

      return {
        ok: false,
        message,
        llmMessage: [
          "以下のJSONは学習用構造化ポスターのスキーマに合っていません。",
          "次の検証エラーをすべて修正し、JSONのみを出力してください。",
          "",
          message,
          "",
          "注意: blocks は1件以上、columns.columns は再帰的な Block 配列、type/color/format は定義済みの値だけを使ってください。",
        ].join("\n"),
      }
    }

    const mermaidIssues = await validateMermaidDiagrams(parsed.data)

    if (mermaidIssues.length > 0) {
      const message = mermaidIssues.join("\n")

      return {
        ok: false,
        message,
        llmMessage: [
          "以下のJSONにはMermaid図の構文エラーがあります。",
          "次の検証エラーをすべて修正し、JSONのみを出力してください。",
          "",
          message,
          "",
          "注意: MermaidのbodyにはMermaidコードのみを書き、Markdownコードフェンスや説明文を含めないでください。",
        ].join("\n"),
      }
    }

    return { ok: true, poster: parsed.data, message: "JSONは有効です。" }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON"

    return {
      ok: false,
      message,
      llmMessage: [
        "以下のJSONはJSON構文として読み取れません。",
        "構文エラーを修正し、学習用構造化ポスターのJSONのみを出力してください。",
        "",
        `- JSON parse error: ${message}`,
      ].join("\n"),
    }
  }
}

async function validateMermaidDiagrams(poster: Poster): Promise<string[]> {
  const issues: string[] = []
  const checks: Promise<void>[] = []

  function visitBlock(block: Block, path: string) {
    if (block.type === "columns") {
      block.columns.forEach((column, index) =>
        visitBlock(column, `${path}.columns.${index}`)
      )
      return
    }

    if (block.type === "card" && Array.isArray(block.body)) {
      block.body.forEach((content, index) => {
        if (content.type === "diagram") {
          visitDiagram(content, `${path}.body.${index}`)
        }
      })
      return
    }

    if (block.type === "diagram") {
      visitDiagram(block, path)
    }
  }

  function visitDiagram(diagram: DiagramContent | DiagramBlock, path: string) {
    if (diagram.format !== "mermaid") {
      return
    }

    checks.push(
      mermaid
        .parse(diagram.body)
        .then(() => undefined)
        .catch((caught) => {
          issues.push(`- ${path}.body: ${formatError(caught)}`)
        })
    )
  }

  poster.blocks.forEach((block, index) => visitBlock(block, `blocks.${index}`))
  await Promise.all(checks)

  return issues
}

function formatError(caught: unknown): string {
  if (caught instanceof Error) {
    return caught.message
  }

  return "Mermaid syntax error"
}
