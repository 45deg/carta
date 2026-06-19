import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "react-i18next"

type YamlEditorProps = {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function YamlEditor({
  value,
  onChange,
  label,
}: YamlEditorProps) {
  const { t } = useTranslation()
  const displayLabel = label ?? t("editor.defaultLabel")

  return (
    <label className="flex min-h-0 flex-1 flex-col gap-2">
      <span className="text-sm font-medium">{displayLabel}</span>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        className="min-h-[320px] flex-1 resize-none rounded-lg border bg-background p-3 font-mono text-xs leading-relaxed transition outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
      />
    </label>
  )
}

