import { ChevronDown, FileCode2, FileImage, Printer } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type ExportFormat = "png" | "svg" | "pdf" | "html"

type ExportDropdownProps = {
  disabled: boolean
  isSaving: boolean
  onExport: (format: ExportFormat) => void
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
}

export function ExportDropdown({
  disabled,
  isSaving,
  onExport,
  variant = "default",
  size = "default",
}: ExportDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger type="button" disabled={disabled} variant={variant} size={size}>
        {isSaving ? "保存中" : "出力"}
        <ChevronDown className="size-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>保存形式</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => void onExport("png")}>
          <FileImage />
          PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void onExport("svg")}>
          <FileImage />
          SVG
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void onExport("pdf")}>
          <Printer />
          PDF印刷
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void onExport("html")}>
          <FileCode2 />
          Single HTML
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
