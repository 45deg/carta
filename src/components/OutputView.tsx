import { lazy, Suspense, useEffect, useRef, useState } from "react"
import {
  AArrowDown,
  AArrowUp,
  ArrowLeft,
  ChevronDown,
  FileDown,
  TriangleAlert,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { ExportDropdown, type ExportFormat } from "@/components/ExportDropdown"
import { PosterCanvas } from "@/components/PosterCanvas"
import { FontSizeCombobox } from "@/components/FontSizeCombobox"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  posterFontSizeOptions,
  posterColumnCountOptions,
} from "@/constants/posterDefaults"
import { type Poster, type PosterValidationResult } from "@/schema/posterSchema"

type PosterFontSizeValue = (typeof posterFontSizeOptions)[number]["value"]
type PosterColumnCountValue = (typeof posterColumnCountOptions)[number]["value"]

const PosterPreview = lazy(() =>
  import("@/components/PosterPreview").then((module) => ({
    default: module.PosterPreview,
  }))
)

interface OutputViewProps {
  poster: Poster
  fontSizeValue: PosterFontSizeValue
  setFontSizeValue: (value: PosterFontSizeValue) => void
  widthValue: number
  setWidthValue: (value: number) => void
  debouncedWidth: number
  columnCountValue: PosterColumnCountValue
  setColumnCountValue: (value: PosterColumnCountValue) => void
  validation: PosterValidationResult
  setScreen: (screen: "workflow" | "output") => void
}

export function OutputView({
  poster,
  fontSizeValue,
  setFontSizeValue,
  widthValue,
  setWidthValue,
  debouncedWidth,
  columnCountValue,
  setColumnCountValue,
  validation,
  setScreen,
}: OutputViewProps) {
  const { t } = useTranslation()
  const [isSaving, setIsSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const posterRef = useRef<HTMLDivElement>(null)
  const exportPosterRef = useRef<HTMLDivElement>(null)

  const baseFontSize =
    posterFontSizeOptions.find((option) => option.value === fontSizeValue)
      ?.size ?? 16
  const columnCount =
    posterColumnCountOptions.find((option) => option.value === columnCountValue)
      ?.count ?? 1
  const exportPosterWidth = debouncedWidth * columnCount
  const fontSizeIndex = posterFontSizeOptions.findIndex(
    (option) => option.value === fontSizeValue
  )
  const canDecreaseFontSize = fontSizeIndex > 0
  const canIncreaseFontSize = fontSizeIndex < posterFontSizeOptions.length - 1

  const stepFontSize = (direction: -1 | 1) => {
    const nextOption = posterFontSizeOptions[fontSizeIndex + direction]
    if (nextOption) {
      setFontSizeValue(nextOption.value)
    }
  }

  useEffect(() => {
    const node = posterRef.current
    if (!node) return

    const checkLandscape = () => {
      const rect = node.getBoundingClientRect()
      const isLandscape = rect.width > rect.height
      if (isLandscape) {
        document.body.classList.add("is-landscape-print")
      } else {
        document.body.classList.remove("is-landscape-print")
      }
      document.body.setAttribute("data-print-columns", String(columnCount))
    }

    checkLandscape()

    const observer = new ResizeObserver(checkLandscape)
    observer.observe(node)

    const handleBeforePrint = () => {
      const rect = node.getBoundingClientRect()
      if (rect.width > rect.height) {
        const style = document.createElement("style")
        style.id = "print-landscape-style"
        style.innerHTML =
          "@media print { @page { size: A4 landscape !important; } }"
        document.head.appendChild(style)
      }
    }
    const handleAfterPrint = () => {
      document.getElementById("print-landscape-style")?.remove()
    }

    window.addEventListener("beforeprint", handleBeforePrint)
    window.addEventListener("afterprint", handleAfterPrint)

    return () => {
      observer.disconnect()
      document.body.classList.remove("is-landscape-print")
      document.body.removeAttribute("data-print-columns")
      window.removeEventListener("beforeprint", handleBeforePrint)
      window.removeEventListener("afterprint", handleAfterPrint)
      document.getElementById("print-landscape-style")?.remove()
    }
  }, [poster, fontSizeValue, debouncedWidth, columnCountValue, columnCount])

  async function handleExport(format: ExportFormat) {
    const node = exportPosterRef.current
    const htmlNode = exportPosterRef.current
    const targetWidth = debouncedWidth * columnCount

    if (!node || !htmlNode) {
      return
    }

    setIsSaving(true)
    setExportError(null)
    try {
      const { printPoster, savePosterHtml, savePosterPng, savePosterSvg } =
        await import("@/lib/exportPoster")

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
        err instanceof Error ? err.message : t("output.exportErrorDefault")
      )
    } finally {
      setIsSaving(false)
    }
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
                className="h-10 gap-2 px-4 text-sm"
                onClick={() => setScreen("workflow")}
              >
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">{t("output.back")}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 gap-2 px-4 text-sm"
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
                className="h-10 gap-2 px-4 text-sm"
                icon={<FileDown className="size-4" />}
              />
            </div>
          </div>

          <div
            className={`${showSettings ? "flex" : "hidden"
              } mt-1 flex-wrap items-center gap-x-6 gap-y-3 border-t border-muted pt-3 md:mt-0 md:flex md:border-t-0 md:pt-0`}
          >
            <div className="flex items-center gap-2 text-sm">
              <label className="font-medium" htmlFor="poster-font-size">
                {t("output.fontSize")}
              </label>
              <div className="flex h-10 items-center overflow-hidden rounded-xl border border-border bg-background">
                <FontSizeCombobox
                  value={fontSizeValue}
                  onValueChange={setFontSizeValue}
                  selectLabel={t("output.fontSizeSelect")}
                  emptyLabel={t("output.fontSizeEmpty")}
                />
                <div className="h-5 w-px bg-border" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="h-full rounded-none"
                  title={t("output.fontSizeDecrease")}
                  aria-label={t("output.fontSizeDecrease")}
                  disabled={!canDecreaseFontSize}
                  onClick={() => stepFontSize(-1)}
                >
                  <AArrowDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="h-full rounded-none"
                  title={t("output.fontSizeIncrease")}
                  aria-label={t("output.fontSizeIncrease")}
                  disabled={!canIncreaseFontSize}
                  onClick={() => stepFontSize(1)}
                >
                  <AArrowUp className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-sm">
              <span className="font-medium whitespace-nowrap">
                {t("output.width")}: {widthValue}px
              </span>
              <div className="flex w-32 items-center px-1">
                <Slider
                  value={widthValue}
                  onValueChange={(val) => {
                    const nextValue = Array.isArray(val) ? val[0] : val
                    setWidthValue(nextValue)
                  }}
                  min={600}
                  max={1600}
                  step={40}
                  aria-label={t("output.width")}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{t("output.columnCount")}</span>
              <ToggleGroup
                aria-label="Column count"
                className="h-10 rounded-xl p-1"
                value={[columnCountValue]}
                onValueChange={(values) => {
                  const nextValue = values.at(-1) as
                    | PosterColumnCountValue
                    | undefined
                  if (nextValue) {
                    setColumnCountValue(nextValue)
                  }
                }}
              >
                {posterColumnCountOptions.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    size="sm"
                    className="h-8 min-w-9 rounded-lg px-3 text-sm"
                    aria-label={t("output.columnCountAria", {
                      label: option.label,
                    })}
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
              className="h-10 gap-2 px-4 text-sm"
              icon={<FileDown className="size-4" />}
            />
          </div>
        </div>
      </header>

      <div className="poster-output-page flex flex-col gap-4 p-4">
        {exportError ? (
          <Alert variant="destructive">
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TriangleAlert className="size-4" />
                <AlertTitle>
                  {t("output.exportError", { error: exportError })}
                </AlertTitle>
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

        <Suspense
          fallback={<div className="poster-print-stage min-h-[60vh]" />}
        >
          <PosterCanvas>
            <PosterPreview
              ref={posterRef}
              poster={poster}
              baseFontSize={baseFontSize}
              width={debouncedWidth}
              columnCount={columnCount}
            />
          </PosterCanvas>

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
              width={debouncedWidth}
              columnCount={columnCount}
            />
          </div>
        </Suspense>
      </div>
    </main>
  )
}
