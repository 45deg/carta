import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import yaml from "js-yaml"

import { WorkflowView } from "@/components/WorkflowView"
import { OutputView } from "@/components/OutputView"
import { PROMPT_JA, PROMPT_EN } from "@/lib/prompt"
import {
  parsePosterYaml,
  type Poster,
  type PosterValidationResult,
} from "@/schema/posterSchema"
import {
  posterFontSizeOptions,
  posterColumnCountOptions,
  samplePosterJa,
  samplePosterEn,
} from "@/constants/posterDefaults"

type PosterFontSizeValue = (typeof posterFontSizeOptions)[number]["value"]
type PosterColumnCountValue = (typeof posterColumnCountOptions)[number]["value"]

const defaultFontSizeValue: PosterFontSizeValue = "16"
const defaultWidthValue = 960
const defaultColumnCountValue: PosterColumnCountValue = "1"

function App() {
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

  const [fontSizeValue, setFontSizeValue] =
    useState<PosterFontSizeValue>(defaultFontSizeValue)
  const [widthValue, setWidthValue] =
    useState<number>(defaultWidthValue)
  const [debouncedWidth, setDebouncedWidth] =
    useState<number>(defaultWidthValue)
  const [columnCountValue, setColumnCountValue] =
    useState<PosterColumnCountValue>(defaultColumnCountValue)
  const [copiedPrompt, setCopiedPrompt] = useState(false)

  // Debouncing effect for width slider updates to avoid laggy preview updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedWidth(widthValue)
    }, 200)
    return () => {
      clearTimeout(handler)
    }
  }, [widthValue])

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

  function handleLanguageChange(lang: string) {
    const currentJaYaml = yaml.dump(samplePosterJa, { lineWidth: -1 })
    const currentEnYaml = yaml.dump(samplePosterEn, { lineWidth: -1 })
    const cleanText = yamlText.trim().replace(/\r\n/g, "\n")
    const cleanJa = currentJaYaml.trim().replace(/\r\n/g, "\n")
    const cleanEn = currentEnYaml.trim().replace(/\r\n/g, "\n")

    if (cleanText === cleanJa || cleanText === cleanEn) {
      setYamlText(
        yaml.dump(lang === "en" ? samplePosterEn : samplePosterJa, {
          lineWidth: -1,
        })
      )
    }
    void i18n.changeLanguage(lang)
  }

  if (screen === "workflow") {
    return (
      <WorkflowView
        yamlText={yamlText}
        handleYamlChange={handleYamlChange}
        validation={validation}
        handleOutput={handleOutput}
        activePrompt={activePrompt}
        handleCopyPrompt={handleCopyPrompt}
        copiedPrompt={copiedPrompt}
        handleLanguageChange={handleLanguageChange}
      />
    )
  }

  return (
    <OutputView
      poster={poster}
      fontSizeValue={fontSizeValue}
      setFontSizeValue={setFontSizeValue}
      widthValue={widthValue}
      setWidthValue={setWidthValue}
      debouncedWidth={debouncedWidth}
      columnCountValue={columnCountValue}
      setColumnCountValue={setColumnCountValue}
      validation={validation}
      setScreen={setScreen}
    />
  )
}

export default App
