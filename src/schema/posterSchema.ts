import { z } from "zod"
import yaml from "js-yaml"

export const posterColors = [
  "danger",
  "important",
  "default",
  "supplement",
  "procedure",
  "concept",
  "term",
  "context",
  "note",
] as const

export const diagramFormats = ["mermaid", "vega_lite"] as const
export const flowVariants = ["steps", "timeline"] as const
export const flowDirections = ["horizontal", "vertical"] as const
export const listVariants = ["bullets", "checklist", "definitions"] as const
export const layoutVariants = ["side_by_side", "aside"] as const

const vegaLiteBodySchema = z.union([z.string(), z.record(z.string(), z.unknown())]).refine((value) => value !== undefined, {
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

const mermaidDiagramBlockSchema = mermaidDiagramContentSchema.extend({
  title: z.string().optional(),
})

const vegaLiteDiagramBlockSchema = vegaLiteDiagramContentSchema.extend({
  title: z.string().optional(),
})

const diagramContentSchema = z.union([
  mermaidDiagramContentSchema,
  vegaLiteDiagramContentSchema,
])

const flowItemSchema = z.object({
  title: z.string().min(1, "flow.items.title is required"),
  body: z.string().min(1, "flow.items.body is required"),
})

const flowSchema = z.object({
  type: z.literal("flow"),
  title: z.string().optional(),
  variant: z.enum(flowVariants).optional(),
  direction: z.enum(flowDirections).optional(),
  items: z.array(flowItemSchema).min(2, "flow.items must have at least 2 items"),
})

const listItemSchema = z.object({
  term: z.string().optional(),
  body: z.string().min(1, "list.items.body is required"),
  checked: z.boolean().optional(),
})

const listSchema = z.object({
  type: z.literal("list"),
  title: z.string().optional(),
  variant: z.enum(listVariants).optional(),
  items: z.array(listItemSchema).min(1, "list.items must have at least 1 item"),
})

const cardContentSchema: z.ZodTypeAny = z.lazy(() =>
  z.union([
    markdownContentSchema,
    diagramContentSchema,
    flowSchema,
    listSchema,
    z.object({
      type: z.literal("layout"),
      variant: z.enum(layoutVariants),
      size: z.array(z.number().positive()).optional(),
      columns: z
        .array(z.array(cardContentSchema).min(1, "layout.columns item must have at least 1 item"))
        .min(2, "layout.columns must have at least 2 items")
        .max(3, "layout.columns must have at most 3 items"),
    }),
  ])
)

const blockSchema: z.ZodTypeAny = z.lazy(() =>
  z.union([
    z.object({
      type: z.literal("card"),
      title: z.string().min(1, "card.title is required"),
      emoji: z.string().optional(),
      icon: z.string().optional(),
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
    mermaidDiagramBlockSchema,
    vegaLiteDiagramBlockSchema,
    flowSchema,
    listSchema,
  ])
)

export const posterSchema: z.ZodType<Poster> = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  blocks: z.array(blockSchema as z.ZodType<Block>).min(1, "blocks must have at least 1 item"),
})

export type Poster = {
  title: string
  description: string
  blocks: Block[]
}
export type Block = CardBlock | ColumnsBlock | DiagramBlock | FlowBlock | ListBlock
export type CardBlock = {
  type: "card"
  title: string
  emoji?: string
  icon?: string
  color?: PosterColor
  body: string | CardContent[]
}
export type CardContent =
  | MarkdownContent
  | DiagramContent
  | FlowBlock
  | ListBlock
  | LayoutContent
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
export type FlowBlock = {
  type: "flow"
  title?: string
  variant?: FlowVariant
  direction?: FlowDirection
  items: FlowItem[]
}
export type FlowItem = {
  title: string
  body: string
}
export type ListBlock = {
  type: "list"
  title?: string
  variant?: ListVariant
  items: ListItem[]
}
export type ListItem = {
  term?: string
  body: string
  checked?: boolean
}
export type LayoutContent = {
  type: "layout"
  variant: LayoutVariant
  size?: number[]
  columns: CardContent[][]
}
export type PosterColor = (typeof posterColors)[number]
export type DiagramFormat = (typeof diagramFormats)[number]
export type FlowVariant = (typeof flowVariants)[number]
export type FlowDirection = (typeof flowDirections)[number]
export type ListVariant = (typeof listVariants)[number]
export type LayoutVariant = (typeof layoutVariants)[number]
export type VegaLiteBody = unknown

export type PosterValidationResult =
  | { ok: true; poster: Poster; message: string }
  | { ok: false; message: string; llmMessage: string }

export async function parsePosterYaml(
  source: string
): Promise<PosterValidationResult> {
  try {
    const value: unknown = yaml.load(source)
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
          "以下のYAML/JSONは学習用構造化ポスターのスキーマに合っていません。",
          "次の検証エラーをすべて修正し、有効なYAMLまたはJSONのみを出力してください。",
          "",
          message,
          "",
          "注意: blocks は1件以上、columns.columns は再帰的な Block 配列、card.body の layout.columns は content 配列、type/color/format/variant は定義済みの値だけを使ってください。",
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
          "以下のYAML/JSONにはMermaid図の構文エラーがあります。",
          "次の検証エラーをすべて修正し、有効なYAMLまたはJSONのみを出力してください。",
          "",
          message,
          "",
          "注意: MermaidのbodyにはMermaidコードのみを書き、Markdownコードフェンスや説明文を含めないでください。",
        ].join("\n"),
      }
    }

    return { ok: true, poster: parsed.data, message: "YAML/JSONは有効です。" }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid YAML/JSON"

    return {
      ok: false,
      message,
      llmMessage: [
        "以下のYAML/JSONは構文として読み取れません。",
        "構文エラーを修正し、学習用構造化ポスターのYAMLまたはJSONのみを出力してください。",
        "",
        `- YAML/JSON parse error: ${message}`,
      ].join("\n"),
    }
  }
}

async function validateMermaidDiagrams(poster: Poster): Promise<string[]> {
  const issues: string[] = []
  const diagrams: Array<{ body: string; path: string }> = []

  function visitBlock(block: Block, path: string) {
    if (block.type === "columns") {
      block.columns.forEach((column, index) =>
        visitBlock(column, `${path}.columns.${index}`)
      )
      return
    }

    if (block.type === "card" && Array.isArray(block.body)) {
      block.body.forEach((content, index) => {
        visitContent(content, `${path}.body.${index}`)
      })
      return
    }

    if (block.type === "diagram") {
      visitDiagram(block, path)
    }
  }

  function visitContent(content: CardContent, path: string) {
    if (content.type === "diagram") {
      visitDiagram(content, path)
      return
    }

    if (content.type === "layout") {
      content.columns.forEach((column, columnIndex) =>
        column.forEach((item, itemIndex) =>
          visitContent(item, `${path}.columns.${columnIndex}.${itemIndex}`)
        )
      )
    }
  }

  function visitDiagram(diagram: DiagramContent | DiagramBlock, path: string) {
    if (diagram.format !== "mermaid") {
      return
    }

    diagrams.push({ body: diagram.body, path })
  }

  poster.blocks.forEach((block, index) => visitBlock(block, `blocks.${index}`))

  if (diagrams.length === 0) {
    return issues
  }

  const { default: mermaid } = await import("mermaid")
  const checks = diagrams.map(({ body, path }) =>
    mermaid
      .parse(body)
      .then(() => undefined)
      .catch((caught) => {
        issues.push(`- ${path}.body: ${formatError(caught)}`)
      })
  )

  await Promise.all(checks)

  return issues
}

function formatError(caught: unknown): string {
  if (caught instanceof Error) {
    return caught.message
  }

  return "Mermaid syntax error"
}
