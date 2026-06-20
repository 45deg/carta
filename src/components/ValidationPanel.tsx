import { useState } from "react"
import { CheckCircle2, Clipboard, TriangleAlert } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { type PosterValidationResult } from "@/schema/posterSchema"

type ValidationPanelProps = {
  validation: PosterValidationResult
}

export function ValidationPanel({ validation }: ValidationPanelProps) {
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()

  async function handleCopy() {
    if (validation.ok) {
      return
    }
    try {
      await navigator.clipboard.writeText(validation.llmMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  if (validation.ok) {
    return (
      <Alert className="mt-3 bg-emerald-50 border-emerald-200/60 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400 [&_svg]:text-emerald-600 dark:[&_svg]:text-emerald-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          <AlertTitle>{validation.message}</AlertTitle>
        </div>
      </Alert>
    )
  }

  return (
    <Alert className="mt-3" variant="destructive">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TriangleAlert className="size-4" />
          <AlertTitle>
            {t("validation.errorTitle")}
          </AlertTitle>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleCopy}
        >
          {copied ? <CheckCircle2 className="size-4" /> : <Clipboard className="size-4" />}
          {copied ? t("validation.copiedError") : t("validation.copyError")}
        </Button>
      </div>
      <AlertDescription>
        <pre className="max-h-48 overflow-auto rounded-md bg-background/80 p-2 font-mono text-xs whitespace-pre-wrap text-foreground">
          {validation.llmMessage}
        </pre>
      </AlertDescription>
    </Alert>
  )
}

