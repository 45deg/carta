import { type CSSProperties, useEffect, useId, useRef, useState } from "react"
import yaml from "js-yaml"
import { useTranslation } from "react-i18next"

import { type DiagramBlock as DiagramBlockType } from "@/schema/posterSchema"

type VisualizationSpec = Record<string, unknown>

type DiagramBlockProps = {
  block: DiagramBlockType
  embedded?: boolean
}

export function DiagramBlock({ block, embedded = false }: DiagramBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reactId = useId()
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()
  const style = {
    "--poster-diagram-width": formatDiagramWidth(block.width),
  } as CSSProperties

  useEffect(() => {
    const container = containerRef.current
    let cancelled = false

    if (!container) {
      return
    }

    container.innerHTML = ""
    const target = container
    setError(null)

    async function renderDiagram() {
      try {
        if (block.format === "mermaid") {
          const { default: mermaid } = await import("mermaid")

          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: "base",
          })

          const id = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`
          const result = await mermaid.render(id, block.body)

          if (!cancelled && container) {
            container.innerHTML = result.svg
          }
          return
        }

        const rawSpec =
          typeof block.body === "string"
            ? (yaml.load(block.body) as VisualizationSpec)
            : (block.body as VisualizationSpec)
        const spec =
          block.format === "vega_lite"
            ? withResponsiveVegaLiteSize(rawSpec, embedded)
            : rawSpec
        const { default: embed } = await import("vega-embed")

        await embed(target, spec, {
          actions: false,
          renderer: "svg",
        })
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : t("diagram.renderErrorDefault"))
        }
      }
    }

    void renderDiagram()

    return () => {
      cancelled = true
    }
  }, [block.body, block.format, reactId, embedded, t])

  return (
    <figure
      className="poster-diagram"
      data-embedded={embedded ? "true" : undefined}
      data-format={block.format}
      style={style}
    >
      {block.title ? <h3 className="poster-diagram-title">{block.title}</h3> : null}
      {error ? (
        <div className="poster-diagram-error">
          <strong>{t("diagram.renderErrorTitle")}</strong>
          <p>{error}</p>
          <pre>{formatDiagramBody(block.body)}</pre>
        </div>
      ) : (
        <div className="poster-diagram-frame">
          <div ref={containerRef} className="poster-diagram-canvas" />
        </div>
      )}
      <figcaption>{block.caption}</figcaption>
    </figure>
  )
}


function formatDiagramBody(body: unknown): string {
  if (typeof body === "string") {
    return body
  }

  return yaml.dump(body)
}

function formatDiagramWidth(width: number | undefined) {
  return typeof width === "number" ? `${width}%` : "100%"
}

function withResponsiveVegaLiteSize(
  spec: VisualizationSpec,
  embedded: boolean
): VisualizationSpec {
  if (!isRecord(spec)) {
    return spec
  }

  return {
    autosize: { type: "fit", contains: "padding", resize: true },
    width: "container",
    height: embedded ? 180 : 240,
    ...spec,
  } as VisualizationSpec
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
