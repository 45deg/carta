import { useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clipboard,
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
  posterWidthOptions,
  samplePoster,
} from "@/constants/posterDefaults"

const initialYaml = yaml.dump(samplePoster, { lineWidth: -1 })

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
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [posterWidth, setPosterWidth] = useState(960)
  const [isSaving, setIsSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const posterRef = useRef<HTMLDivElement>(null)
  const exportPosterRef = useRef<HTMLDivElement>(null)

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

    if (!node) {
      return
    }

    setIsSaving(true)
    setExportError(null)
    try {
      if (format === "png") {
        await savePosterPng(node, poster, posterWidth)
      } else if (format === "svg") {
        await savePosterSvg(node, poster, posterWidth)
      } else if (format === "html") {
        savePosterHtml(node, poster)
      } else {
        printPoster()
      }
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "エクスポート中にエラーが発生しました。")
    } finally {
      setIsSaving(false)
    }
  }

  if (screen === "workflow") {
    return (
      <main className="min-h-svh bg-muted/40 text-foreground">
        <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-4 p-4 sm:p-6">
          <header className="app-chrome flex flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">
              Carta
            </p>
            <h1 className="text-2xl font-semibold tracking-normal">
              構造化知識ポスタージェネレーター
            </h1>
          </header>

          <section className="grid flex-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <StepNumber value="1" />
                  <CardTitle>YAMLをAIで作成</CardTitle>
                </div>
                <CardDescription>
                  以下のプロンプトでGPTs/Skills/Gemsなどを作成し、それに説明させたい対象や資料を提示してYAMLを出力させてください。直接プロンプトをチャットに聞いても構いません。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Prompt</span>
                  <Textarea
                    value={PROMPT}
                    readOnly
                    className="min-h-80 resize-none bg-muted/50 font-mono text-xs leading-relaxed"
                  />
                </label>
              </CardContent>
              <CardFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyPrompt}
                >
                  {copiedPrompt ? <CheckCircle2 className="size-4" /> : <Clipboard className="size-4" />}
                  {copiedPrompt ? "コピーしました" : "コピー"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex min-h-[560px] flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <StepNumber value="2" />
                  <CardTitle>出力されたYAMLを貼り付け</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col">
                <YamlEditor value={yamlText} onChange={handleYamlChange} />
                <ValidationPanel validation={validation} />
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  type="button"
                  size="lg"
                  disabled={!validation.ok}
                  onClick={handleOutput}
                >
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
                <TabsList className="h-9">
                  <TabsTrigger value="preview" className="px-3 text-xs sm:text-sm">プレビュー</TabsTrigger>
                  <TabsTrigger value="edit" className="px-3 text-xs sm:text-sm">編集</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                設定
                <ChevronDown className={`size-4 transition-transform ${showSettings ? "rotate-180" : ""}`} />
              </Button>

              <ExportDropdown
                disabled={isSaving || !validation.ok}
                isSaving={isSaving}
                onExport={handleExport}
                size="sm"
              />
            </div>
          </div>

          <div
            className={`${showSettings ? "flex" : "hidden"
              } md:flex flex-wrap items-center gap-x-6 gap-y-3 border-t md:border-t-0 pt-3 md:pt-0 border-muted mt-1 md:mt-0`}
          >
            <label className="flex items-center gap-2 text-sm">
              <span className="font-medium">Font size</span>
              <input
                type="range"
                min="13"
                max="22"
                value={baseFontSize}
                onChange={(event) => setBaseFontSize(Number(event.target.value))}
                className="w-24 sm:w-28 accent-primary"
              />
              <span className="w-10 tabular-nums">{baseFontSize}px</span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <span className="font-medium">幅</span>
              <select
                value={posterWidth}
                onChange={(event) => setPosterWidth(Number(event.target.value))}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {posterWidthOptions.map((width) => (
                  <option key={width} value={width}>
                    {width}px
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <ExportDropdown
              disabled={isSaving || !validation.ok}
              isSaving={isSaving}
              onExport={handleExport}
              size="sm"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 p-4 lg:grid-cols-[minmax(0,1fr)]">
        {exportError ? (
          <Alert variant="destructive">
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-2">
                <TriangleAlert className="size-4" />
                <AlertTitle>エクスポートエラー: {exportError}</AlertTitle>
              </div>
              <Button type="button" size="xs" variant="outline" onClick={() => setExportError(null)}>
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
            width: `${posterWidth}px`,
            pointerEvents: "none",
            opacity: 0,
            background: "#ffffff",
          }}
        >
          <PosterPreview
            ref={exportPosterRef}
            poster={poster}
            baseFontSize={baseFontSize}
            width={posterWidth}
          />
        </div>
      </div>
    </main>
  )
}


export default App
