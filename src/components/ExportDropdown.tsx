import { type ReactNode } from "react"
import { ChevronDown, FileCode2, FileImage, Printer } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type ExportFormat = "png" | "svg" | "pdf" | "html"

type ExportDropdownProps = {
  disabled: boolean
  isSaving: boolean
  onExport: (format: ExportFormat) => void
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
  icon?: ReactNode
  className?: string
}

export function ExportDropdown({
  disabled,
  isSaving,
  onExport,
  variant = "default",
  size = "default",
  icon,
  className,
}: ExportDropdownProps) {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        disabled={disabled}
        variant={variant}
        size={size}
        className={cn(className)}
      >
        {icon}
        {isSaving ? t("export.saving") : t("export.export")}
        <ChevronDown className="size-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t("export.formatTitle")}</DropdownMenuLabel>
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
          {t("export.optionPdf")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void onExport("html")}>
          <FileCode2 />
          {t("export.optionHtml")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

