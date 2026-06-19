import { CardBlock } from "@/components/CardBlock"
import { ColumnsBlock } from "@/components/ColumnsBlock"
import { DiagramBlock } from "@/components/DiagramBlock"
import { FlowBlock } from "@/components/FlowBlock"
import { ListBlock } from "@/components/ListBlock"
import { type Block } from "@/schema/posterSchema"

type BlockRendererProps = {
  block: Block
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case "card":
      return <CardBlock block={block} />
    case "columns":
      return <ColumnsBlock block={block} />
    case "diagram":
      return <DiagramBlock block={block} />
    case "flow":
      return <FlowBlock block={block} />
    case "list":
      return <ListBlock block={block} />
  }
}
