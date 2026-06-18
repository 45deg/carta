import { useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  FileCode2,
  FileImage,
  Printer,
  TriangleAlert,
} from "lucide-react"

import yaml from "js-yaml"
import { YamlEditor } from "@/components/YamlEditor"
import { PosterPreview } from "@/components/PosterPreview"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

type ExportFormat = "png" | "svg" | "pdf" | "html"

const posterWidthOptions = [720, 840, 960, 1080, 1200]

const samplePoster: Poster = {
  title: "再帰と分割統治の学習ポスター",
  description:
    "再帰的な問題分解を、カード・列・図で短時間に復習できるよう整理したポスターです。",
  blocks: [
    {
      type: "card",
      title: "要点",
      emoji: "💡",
      color: "important",
      body: "再帰は **小さな同型問題** に分けて解く考え方です。\n\n| 観点 | 確認すること |\n|---|---|\n| 終了条件 | いつ止まるか |\n| 再帰ステップ | どのように小さくするか |\n| 結合 | 答えをどう戻すか |\n\n数式も扱えます。\n\n$$\nT(n)=2T(n/2)+O(n)\n$$",
    },
    {
      type: "columns",
      size: [1, 1],
      columns: [
        {
          type: "card",
          title: "手順",
          emoji: "1",
          color: "procedure",
          body: "1. 問題を観察する\n2. 最小ケースを決める\n3. 小さい問題へ変換する\n4. 戻り値を組み立てる",
        },
        {
          type: "diagram",
          format: "mermaid",
          title: "処理の流れ",
          body: "flowchart TD\n  A[大きな問題] --> B[小さな問題1]\n  A --> C[小さな問題2]\n  B --> D[結果を結合]\n  C --> D",
          caption: "分割統治では、分けた結果を最後に結合します。",
        },
      ],
    },
    {
      type: "diagram",
      format: "vega_lite",
      title: "理解度チェック",
      width: 70,
      body: {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        data: {
          values: [
            { topic: "終了条件", score: 4 },
            { topic: "分解", score: 3 },
            { topic: "結合", score: 5 },
          ],
        },
        mark: "bar",
        encoding: {
          x: { field: "topic", type: "nominal" },
          y: { field: "score", type: "quantitative" },
          color: { field: "topic", type: "nominal" },
        },
      },
      caption: "Vega-Liteで簡単な確認グラフも表示できます。",
    },
  ],
}

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

  async function handleExport(format: ExportFormat) {
    const node = exportPosterRef.current

    if (!node) {
      return
    }

    setIsSaving(true)
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
                  onClick={() => void navigator.clipboard.writeText(PROMPT)}
                >
                  <Clipboard />
                  コピー
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
            />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 p-4 lg:grid-cols-[minmax(0,1fr)]">
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

function StepNumber({ value }: { value: string }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
      {value}
    </span>
  )
}

function ValidationPanel({
  validation,
}: {
  validation: PosterValidationResult
}) {
  if (validation.ok) {
    return (
      <Alert className="mt-3" variant="success">
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
            この修正内容を再度AIに入力してYAML（またはJSON）を作り直させてください。
          </AlertTitle>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            void navigator.clipboard.writeText(validation.llmMessage)
          }
        >
          <Clipboard />
          エラーをコピー
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

function ExportDropdown({
  disabled,
  isSaving,
  onExport,
}: {
  disabled: boolean
  isSaving: boolean
  onExport: (format: ExportFormat) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger type="button" disabled={disabled}>
        {isSaving ? "保存中" : "出力"}
        <ChevronDown />
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

export default App
