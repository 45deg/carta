import {
  CheckCircle2,
  Clipboard,
  Eye,
  GlobeOff,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { YamlEditor } from "@/components/YamlEditor"
import { StepNumber } from "@/components/StepNumber"
import { ValidationPanel } from "@/components/ValidationPanel"
import { Github } from "@/assets/Github"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { type PosterValidationResult } from "@/schema/posterSchema"

interface WorkflowViewProps {
  yamlText: string
  handleYamlChange: (value: string) => void
  validation: PosterValidationResult
  handleOutput: () => void
  activePrompt: string
  handleCopyPrompt: () => void
  copiedPrompt: boolean
  handleLanguageChange: (lang: string) => void
}

export function WorkflowView({
  yamlText,
  handleYamlChange,
  validation,
  handleOutput,
  activePrompt,
  handleCopyPrompt,
  copiedPrompt,
  handleLanguageChange,
}: WorkflowViewProps) {
  const { t, i18n } = useTranslation()

  return (
    <main className="min-h-svh bg-muted/40 text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col gap-6 p-6 sm:p-8">
        <header className="app-chrome flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-base font-medium text-muted-foreground">
              {t("app.title")}
            </p>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
              <svg
                className="size-8 text-primary"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3.5"
                  y="4.5"
                  width="18"
                  height="23"
                  rx="3"
                  transform="rotate(-12 12.5 16)"
                  fill="currentColor"
                  opacity="0.4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="10.5"
                  y="4.5"
                  width="18"
                  height="23"
                  rx="3"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <line
                  x1="14.5"
                  y1="10.5"
                  x2="24.5"
                  y2="10.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="14.5"
                  y1="16.5"
                  x2="20.5"
                  y2="16.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="14.5"
                  y1="22.5"
                  x2="22.5"
                  y2="22.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Carta
            </h1>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 md:mt-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-2xs dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
              <GlobeOff className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              {t("app.localOnly")}
            </span>
            <ToggleGroup
              value={[i18n.resolvedLanguage || i18n.language || "ja"]}
              onValueChange={(val) => {
                const nextLang = val[0]
                if (nextLang) handleLanguageChange(nextLang)
              }}
              className="h-8 rounded-lg border bg-background p-0.5"
            >
              <ToggleGroupItem
                value="ja"
                className="h-6 rounded-md px-2.5 text-xs"
              >
                日本語
              </ToggleGroupItem>
              <ToggleGroupItem
                value="en"
                className="h-6 rounded-md px-2.5 text-xs"
              >
                English
              </ToggleGroupItem>
            </ToggleGroup>
            <a
              href="https://github.com/45deg/carta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-8 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-2xs transition-colors hover:bg-muted hover:text-foreground"
              aria-label="GitHub Repository"
              title="GitHub"
            >
              <Github className="size-4" />
            </a>
          </div>
        </header>

        <section className="grid flex-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="flex flex-col border-muted/60 shadow-xs">
            <CardHeader className="p-6 pb-4 sm:p-8">
              <div className="flex items-center gap-4">
                <StepNumber value="1" />
                <CardTitle className="text-xl font-bold">
                  {t("step1.title")}
                </CardTitle>
              </div>
              <CardDescription className="mt-3 text-base leading-relaxed">
                {t("step1.desc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col px-6 pb-6 sm:px-8">
              <label className="flex flex-1 flex-col gap-3">
                <span className="text-base font-medium">
                  {t("step1.prompt")}
                </span>
                <Textarea
                  value={activePrompt}
                  readOnly
                  className="min-h-96 resize-none rounded-xl border-muted/80 bg-muted/50 p-4 font-mono text-sm leading-relaxed"
                />
              </label>
            </CardContent>
            <CardFooter className="px-6 pb-6 sm:px-8 sm:pb-8">
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 px-4 text-sm"
                onClick={handleCopyPrompt}
              >
                {copiedPrompt ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Clipboard className="size-4" />
                )}
                {copiedPrompt ? t("step1.copied") : t("step1.copy")}
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex min-h-[600px] flex-col border-muted/60 shadow-xs">
            <CardHeader className="p-6 pb-4 sm:p-8">
              <div className="flex items-center gap-4">
                <StepNumber value="2" />
                <CardTitle className="text-xl font-bold">
                  {t("step2.title")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-4 px-6 pb-6 sm:px-8">
              <YamlEditor value={yamlText} onChange={handleYamlChange} />
              <ValidationPanel validation={validation} />
            </CardContent>
            <CardFooter className="justify-end px-6 pb-6 sm:px-8 sm:pb-8">
              <Button
                type="button"
                size="lg"
                className="h-12 gap-2 px-6 text-base"
                disabled={!validation.ok}
                onClick={handleOutput}
              >
                <Eye className="size-5" />
                {t("step2.render")}
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  )
}
