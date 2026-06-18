import { type CSSProperties } from "react"

import { BlockRenderer } from "@/components/BlockRenderer"
import { type ColumnsBlock as ColumnsBlockType } from "@/schema/posterSchema"

type ColumnsBlockProps = {
  block: ColumnsBlockType
}

export function ColumnsBlock({ block }: ColumnsBlockProps) {
  const template = block.size?.length
    ? block.size.map((size) => `${size}fr`).join(" ")
    : `repeat(${block.columns.length}, minmax(0, 1fr))`

  return (
    <div
      className="poster-columns"
      style={{ "--poster-columns-template": template } as CSSProperties}
    >
      {block.columns.map((column, index) => (
        <BlockRenderer key={index} block={column} />
      ))}
    </div>
  )
}
