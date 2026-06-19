import { lazy, Suspense, useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  Eye,
  FileDown,
  GlobeOff,
  TriangleAlert,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import yaml from "js-yaml"
import { YamlEditor } from "@/components/YamlEditor"
import { StepNumber } from "@/components/StepNumber"
import { ValidationPanel } from "@/components/ValidationPanel"
import { ExportDropdown, type ExportFormat } from "@/components/ExportDropdown"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { PROMPT_JA, PROMPT_EN } from "@/lib/prompt"
import {
  parsePosterYaml,
  type Poster,
  type PosterValidationResult,
} from "@/schema/posterSchema"
import {
  posterFontSizeOptions,
  posterWidthOptions,
  samplePosterJa,
  samplePosterEn,
} from "@/constants/posterDefaults"

type PosterFontSizeValue = (typeof posterFontSizeOptions)[number]["value"]
type PosterWidthValue = (typeof posterWidthOptions)[number]["value"]

const defaultFontSizeValue: PosterFontSizeValue = "3"
const defaultWidthValue: PosterWidthValue = "medium"
const PosterPreview = lazy(() =>
  import("@/components/PosterPreview").then((module) => ({
    default: module.PosterPreview,
  }))
)

export function App() {
  const { t, i18n } = useTranslation()
  const isEnglish = i18n.language?.startsWith("en")
  const activeSamplePoster = isEnglish ? samplePosterEn : samplePosterJa
  const activePrompt = isEnglish ? PROMPT_EN : PROMPT_JA

  const [yamlText, setYamlText] = useState(() =>
    yaml.dump(activeSamplePoster, { lineWidth: -1 })
  )
  const [validation, setValidation] = useState<PosterValidationResult>(() => ({
    ok: true,
    poster: activeSamplePoster,
    message: t("validation.success"),
  }))
  const [poster, setPoster] = useState<Poster>(() => activeSamplePoster)
  const [screen, setScreen] = useState<"workflow" | "output">("workflow")
  const [mode, setMode] = useState<"preview" | "edit">("preview")
  const [fontSizeValue, setFontSizeValue] =
    useState<PosterFontSizeValue>(defaultFontSizeValue)
  const [widthValue, setWidthValue] =
    useState<PosterWidthValue>(defaultWidthValue)
  const [isSaving, setIsSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const posterRef = useRef<HTMLDivElement>(null)
  const exportPosterRef = useRef<HTMLDivElement>(null)
  const baseFontSize =
    posterFontSizeOptions.find((option) => option.value === fontSizeValue)
      ?.size ?? 16
  const posterWidth =
    posterWidthOptions.find((option) => option.value === widthValue)?.width ??
    "fit"
  const exportPosterWidth =
    typeof posterWidth === "number" ? posterWidth : getFitScreenPosterWidth()

  useEffect(() => {
    let cancelled = false

    async function validate() {
      const result = await parsePosterYaml(yamlText)

      if (cancelled) {
        return
      }

      setValidation(result)

      if (result.ok) {
        setPoster(result.poster)
      }
    }

    void validate()

    return () => {
      cancelled = true
    }
  }, [yamlText, i18n.language])

  function handleYamlChange(value: string) {
    setYamlText(value)
  }

  function handleOutput() {
    if (!validation.ok) {
      return
    }

    setPoster(validation.poster)
    setScreen("output")
    setMode("preview")
  }

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(activePrompt)
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2000)
    } catch {
      // ignore
    }
  }

  async function handleExport(format: ExportFormat) {
    const node = exportPosterRef.current
    const htmlNode =
      typeof posterWidth === "number"
        ? exportPosterRef.current
        : posterRef.current
    const targetWidth =
      typeof posterWidth === "number"
        ? posterWidth
        : getRenderedPosterWidth(posterRef.current)

    if (!node || !htmlNode) {
      return
    }

    setIsSaving(true)
    setExportError(null)
    try {
      const {
        printPoster,
        savePosterHtml,
        savePosterPng,
        savePosterSvg,
      } = await import("@/lib/exportPoster")

      if (format === "png") {
        await savePosterPng(node, poster, targetWidth)
      } else if (format === "svg") {
        await savePosterSvg(node, poster, targetWidth)
      } else if (format === "html") {
        savePosterHtml(htmlNode, poster)
      } else {
        printPoster()
      }
    } catch (err) {
      setExportError(
        err instanceof Error
          ? err.message
          : t("output.exportErrorDefault")
      )
    } finally {
      setIsSaving(false)
    }
  }

  function handleLanguageChange(lang: string) {
    const currentJaYaml = yaml.dump(samplePosterJa, { lineWidth: -1 })
    const currentEnYaml = yaml.dump(samplePosterEn, { lineWidth: -1 })
    const cleanText = yamlText.trim().replace(/\r\n/g, "\n")
    const cleanJa = currentJaYaml.trim().replace(/\r\n/g, "\n")
    const cleanEn = currentEnYaml.trim().replace(/\r\n/g, "\n")

    if (cleanText === cleanJa || cleanText === cleanEn) {
      setYamlText(yaml.dump(lang === "en" ? samplePosterEn : samplePosterJa, { lineWidth: -1 }))
    }
    void i18n.changeLanguage(lang)
  }

  if (screen === "workflow") {
    return (
      <main className="min-h-svh bg-muted/40 text-foreground">
        <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col gap-6 p-6 sm:p-8">
          <header className="app-chrome flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-base font-medium text-muted-foreground">{t("app.title")}</p>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <svg className="size-8 text-primary" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3.5" y="4.5" width="18" height="23" rx="3" transform="rotate(-12 12.5 16)" fill="currentColor" opacity="0.4" stroke="currentColor" stroke-width="1.5" />
                  <rect x="10.5" y="4.5" width="18" height="23" rx="3" fill="currentColor" stroke="currentColor" stroke-width="1.5" />
                  <line x1="14.5" y1="10.5" x2="24.5" y2="10.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                  <line x1="14.5" y1="16.5" x2="20.5" y2="16.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                  <line x1="14.5" y1="22.5" x2="22.5" y2="22.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                </svg>
                Carta
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60 shadow-2xs dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50">
                <GlobeOff className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                {t("app.localOnly")}
              </span>
              <ToggleGroup
                value={[i18n.resolvedLanguage || i18n.language || "ja"]}
                onValueChange={(val) => {
                  const nextLang = val[0]
                  if (nextLang) handleLanguageChange(nextLang)
                }}
                className="h-8 p-0.5 rounded-lg border bg-background"
              >
                <ToggleGroupItem value="ja" className="h-6 px-2.5 text-xs rounded-md">
                  日本語
                </ToggleGroupItem>
                <ToggleGroupItem value="en" className="h-6 px-2.5 text-xs rounded-md">
                  English
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </header>

          <section className="grid flex-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="flex flex-col shadow-xs border-muted/60">
              <CardHeader className="p-6 sm:p-8 pb-4">
                <div className="flex items-center gap-4">
                  <StepNumber value="1" />
                  <CardTitle className="text-xl font-bold">{t("step1.title")}</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed mt-3">
                  {t("step1.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-6 flex-1 flex flex-col">
                <label className="flex flex-col gap-3 flex-1">
                  <span className="text-base font-medium">{t("step1.prompt")}</span>
                  <Textarea
                    value={activePrompt}
                    readOnly
                    className="min-h-96 resize-none bg-muted/50 font-mono text-sm leading-relaxed p-4 rounded-xl border-muted/80"
                  />
                </label>
              </CardContent>
              <CardFooter className="px-6 sm:px-8 pb-6 sm:pb-8">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 px-4 text-sm gap-2"
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

            <Card className="flex min-h-[600px] flex-col shadow-xs border-muted/60">
              <CardHeader className="p-6 sm:p-8 pb-4">
                <div className="flex items-center gap-4">
                  <StepNumber value="2" />
                  <CardTitle className="text-xl font-bold">{t("step2.title")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col px-6 sm:px-8 pb-6 gap-4">
                <YamlEditor value={yamlText} onChange={handleYamlChange} />
                <ValidationPanel validation={validation} />
              </CardContent>
              <CardFooter className="justify-end px-6 sm:px-8 pb-6 sm:pb-8">
                <Button
                  type="button"
                  size="lg"
                  className="h-12 px-6 text-base gap-2"
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

  return (
    <main className="min-h-svh bg-muted/40">
      <header className="app-chrome sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-2 md:w-auto">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 px-4 text-sm gap-2"
                onClick={() => setScreen("workflow")}
              >
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">{t("output.back")}</span>
              </Button>

              <Tabs
                value={mode}
                onValueChange={(value) =>
                  setMode(value === "edit" ? "edit" : "preview")
                }
              >
                <TabsList className="h-10 p-1 rounded-xl">
                  <TabsTrigger
                    value="preview"
                    className="h-8 px-4 text-sm rounded-lg"
                  >
                    {t("output.preview")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="edit"
                    className="h-8 px-4 text-sm rounded-lg"
                  >
                    {t("output.edit")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 px-4 text-sm gap-2"
                onClick={() => setShowSettings(!showSettings)}
              >
                {t("output.settings")}
                <ChevronDown
                  className={`size-4 transition-transform ${showSettings ? "rotate-180" : ""}`}
                />
              </Button>

              <ExportDropdown
                disabled={isSaving || !validation.ok}
                isSaving={isSaving}
                onExport={handleExport}
                size="sm"
                className="h-10 px-4 text-sm gap-2"
                icon={<FileDown className="size-4" />}
              />
            </div>
          </div>

          <div
            className={`${
              showSettings ? "flex" : "hidden"
            } mt-1 flex-wrap items-center gap-x-6 gap-y-3 border-t border-muted pt-3 md:mt-0 md:flex md:border-t-0 md:pt-0`}
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{t("output.fontSize")}</span>
              <ToggleGroup
                aria-label="Font size"
                className="h-10 p-1 rounded-xl"
                value={[fontSizeValue]}
                onValueChange={(values) => {
                  const nextValue = values.at(-1) as
                    | PosterFontSizeValue
                    | undefined
                  if (nextValue) {
                    setFontSizeValue(nextValue)
                  }
                }}
              >
                {posterFontSizeOptions.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    size="sm"
                    className="h-8 min-w-9 px-3 text-sm rounded-lg"
                    aria-label={t("output.fontSizeAria", { label: option.label })}
                  >
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{t("output.width")}</span>
              <ToggleGroup
                aria-label="Poster width"
                className="h-10 p-1 rounded-xl"
                value={[widthValue]}
                onValueChange={(values) => {
                  const nextValue = values.at(-1) as
                    | PosterWidthValue
                    | undefined
                  if (nextValue) {
                    setWidthValue(nextValue)
                  }
                }}
              >
                {posterWidthOptions.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    size="sm"
                    className="h-8 min-w-12 px-3.5 text-sm rounded-lg"
                    aria-label={t("output.widthAria", { label: t(`output.widthOptions.${option.value}`) })}
                  >
                    {t(`output.widthOptions.${option.value}`)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ExportDropdown
              disabled={isSaving || !validation.ok}
              isSaving={isSaving}
              onExport={handleExport}
              size="sm"
              className="h-10 px-4 text-sm gap-2"
              icon={<FileDown className="size-4" />}
            />
          </div>
        </div>
      </header>

      <div className="poster-output-page mx-auto grid w-full gap-4 p-4 lg:grid-cols-[minmax(0,1fr)]">
        {exportError ? (
          <Alert variant="destructive">
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TriangleAlert className="size-4" />
                <AlertTitle>{t("output.exportError", { error: exportError })}</AlertTitle>
              </div>
              <Button
                type="button"
                size="xs"
                variant="outline"
                onClick={() => setExportError(null)}
              >
                {t("output.close")}
              </Button>
            </div>
          </Alert>
        ) : null}

        {mode === "edit" ? (
          <Card className="editor-pane flex min-h-[520px] flex-col">
            <CardContent className="flex min-h-0 flex-1 flex-col pt-4">
              <YamlEditor
                value={yamlText}
                onChange={handleYamlChange}
                label={t("output.editorLabel")}
              />
              <ValidationPanel validation={validation} />
            </CardContent>
          </Card>
        ) : null}

        <Suspense fallback={<div className="poster-print-stage min-h-[60vh]" />}>
          <section className="poster-print-stage overflow-auto">
            <PosterPreview
              ref={posterRef}
              poster={poster}
              baseFontSize={baseFontSize}
              width={posterWidth}
            />
          </section>

          {/* エクスポート用の非表示ポスターコンテナ */}
          <div
            className="no-print"
            style={{
              position: "fixed",
              left: "-9999px",
              top: "0",
              width: `${exportPosterWidth}px`,
              pointerEvents: "none",
              opacity: 0,
              background: "#ffffff",
            }}
          >
            <PosterPreview
              ref={exportPosterRef}
              poster={poster}
              baseFontSize={baseFontSize}
              width={exportPosterWidth}
            />
          </div>
        </Suspense>
      </div>
    </main>
  )
}

function getFitScreenPosterWidth() {
  if (typeof window === "undefined") {
    return 960
  }

  return Math.max(320, window.innerWidth - 32)
}

function getRenderedPosterWidth(node: HTMLElement | null) {
  if (!node) {
    return getFitScreenPosterWidth()
  }

  return Math.ceil(
    node.getBoundingClientRect().width || getFitScreenPosterWidth()
  )
}

export default App
