import * as React from "react"
import { Toggle } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      className={cn(
        "inline-flex items-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

const toggleGroupItemVariants = cva(
  "inline-flex h-7 min-w-8 items-center justify-center rounded-md px-2.5 text-sm font-medium whitespace-nowrap transition outline-none select-none hover:bg-background/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-xs",
  {
    variants: {
      size: {
        default: "h-7 min-w-8 px-2.5 text-sm",
        sm: "h-6 min-w-7 px-2 text-xs",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function ToggleGroupItem({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof Toggle> &
  VariantProps<typeof toggleGroupItemVariants>) {
  return (
    <Toggle
      data-slot="toggle-group-item"
      className={cn(toggleGroupItemVariants({ size, className }))}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
