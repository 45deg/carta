import { useEffect, useRef, useState } from "react"
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

import yaml from "js-yaml"
import { YamlEditor } from "@/components/YamlEditor"
import { PosterPreview } from "@/components/PosterPreview"
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
import {
  printPoster,
  savePosterHtml,
  savePosterPng,
  savePosterSvg,
} from "@/lib/exportPoster"
import { PROMPT } from "@/lib/prompt"
import {
  parsePosterYaml,
  type Poster,
  type PosterValidationResult,
} from "@/schema/posterSchema"
import {
  posterFontSizeOptions,
  posterWidthOptions,
  samplePoster,
} from "@/constants/posterDefaults"

const initialYaml = yaml.dump(samplePoster, { lineWidth: -1 })
type PosterFontSizeValue = (typeof posterFontSizeOptions)[number]["value"]
type PosterWidthValue = (typeof posterWidthOptions)[number]["value"]

const defaultFontSizeValue: PosterFontSizeValue = "3"
const defaultWidthValue: PosterWidthValue = "medium"

export function App() {
  const [yamlText, setYamlText] = useState(initialYaml)
  const [validation, setValidation] = useState<PosterValidationResult>({
    ok: true,
    poster: samplePoster,
    message: "YAMLは有効です。",
  })
  const [poster, setPoster] = useState<Poster>(samplePoster)
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
  }, [yamlText])

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
      await navigator.clipboard.writeText(PROMPT)
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
          : "エクスポート中にエラーが発生しました。"
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (screen === "workflow") {
    return (
      <main className="min-h-svh bg-muted/40 text-foreground">
        <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col gap-6 p-6 sm:p-8">
          <header className="app-chrome flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-base font-medium text-muted-foreground">構造化知識ポスタージェネレーター</p>
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
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60 shadow-2xs dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50">
                <GlobeOff className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ローカル処理・データ送信なし
              </span>
            </div>
          </header>

          <section className="grid flex-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="flex flex-col shadow-xs border-muted/60">
              <CardHeader className="p-6 sm:p-8 pb-4">
                <div className="flex items-center gap-4">
                  <StepNumber value="1" />
                  <CardTitle className="text-xl font-bold">YAMLをAIで作成</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed mt-3">
                  以下のプロンプトでGPTs/Skills/Gemsなどを作成し、それに説明させたい対象や資料を提示してYAMLを出力させてください。直接プロンプトをチャットに聞いても構いません。
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-6 flex-1 flex flex-col">
                <label className="flex flex-col gap-3 flex-1">
                  <span className="text-base font-medium">Prompt</span>
                  <Textarea
                    value={PROMPT}
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
                  {copiedPrompt ? "コピーしました" : "コピー"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex min-h-[600px] flex-col shadow-xs border-muted/60">
              <CardHeader className="p-6 sm:p-8 pb-4">
                <div className="flex items-center gap-4">
                  <StepNumber value="2" />
                  <CardTitle className="text-xl font-bold">出力されたYAMLを貼り付け</CardTitle>
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
                  出力
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
                <span className="hidden sm:inline">戻る</span>
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
                    プレビュー
                  </TabsTrigger>
                  <TabsTrigger
                    value="edit"
                    className="h-8 px-4 text-sm rounded-lg"
                  >
                    編集
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
                設定
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
              <span className="font-medium">Font size</span>
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
                    aria-label={`文字サイズ ${option.label}`}
                  >
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">幅</span>
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
                    aria-label={`幅 ${option.label}`}
                  >
                    {option.label}
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
                <AlertTitle>エクスポートエラー: {exportError}</AlertTitle>
              </div>
              <Button
                type="button"
                size="xs"
                variant="outline"
                onClick={() => setExportError(null)}
              >
                閉じる
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
                label="YAML編集"
              />
              <ValidationPanel validation={validation} />
            </CardContent>
          </Card>
        ) : null}

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
