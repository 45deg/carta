import { getFontEmbedCSS, toPng, toSvg } from "html-to-image"

import { type Poster } from "@/schema/posterSchema"
import posterCss from "@/styles/poster.css?raw"
import { safeFileName } from "@/lib/safeFileName"
import katexCss from "katex/dist/katex.min.css?raw"
import highlightCss from "highlight.js/styles/github.css?raw"

function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement("a")
  link.download = fileName
  link.href = dataUrl
  link.click()
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  downloadDataUrl(url, fileName)
  URL.revokeObjectURL(url)
}

function downloadText(text: string, fileName: string, type: string) {
  const blob = new Blob([text], { type })
  downloadBlob(blob, fileName)
}

export async function savePosterPng(node: HTMLElement, poster: Poster, targetWidth: number) {
  const dataUrl = await exportPosterImage(node, targetWidth, (exportNode, options) => {
    return toPng(exportNode, {
      ...options,
      pixelRatio: 2,
    })
  })
  downloadDataUrl(dataUrl, safeFileName(poster.title, "png"))
}

export async function savePosterSvg(node: HTMLElement, poster: Poster, targetWidth: number) {
  const dataUrl = await exportPosterImage(node, targetWidth, toSvg)
  const svgText = await dataUrlToText(dataUrl)
  downloadBlob(
    new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }),
    safeFileName(poster.title, "svg")
  )
}

async function exportPosterImage(
  node: HTMLElement,
  targetWidth: number,
  render: (
    exportNode: HTMLElement,
    options: {
      backgroundColor: string
      cacheBust: boolean
      width: number
      height: number
      canvasWidth: number
      canvasHeight: number
      fontEmbedCSS: string
      style: Record<string, string>
    }
  ) => Promise<string>
) {
  const fontEmbedCSS = await getFontEmbedCSS(node)
  const rect = node.getBoundingClientRect()
  const width = targetWidth
  const height = Math.ceil(rect.height || node.offsetHeight || node.scrollHeight || 600)
  const exportNode = node.cloneNode(true) as HTMLElement

  exportNode.style.width = `${width}px`
  exportNode.style.maxWidth = "none"
  exportNode.style.margin = "0"
  exportNode.style.boxShadow = "none"

  const wrapper = document.createElement("div")
  wrapper.style.position = "fixed"
  wrapper.style.left = "0"
  wrapper.style.top = "0"
  wrapper.style.width = `${width}px`
  wrapper.style.height = `${height}px`
  wrapper.style.overflow = "hidden"
  wrapper.style.background = "#ffffff"
  wrapper.style.pointerEvents = "none"
  wrapper.style.opacity = "0"
  wrapper.appendChild(exportNode)
  document.body.appendChild(wrapper)

  try {
    return await render(exportNode, {
      backgroundColor: "#ffffff",
      cacheBust: true,
      width,
      height,
      canvasWidth: width,
      canvasHeight: height,
      fontEmbedCSS,
      style: {
        width: `${width}px`,
        maxWidth: "none",
        margin: "0",
        boxShadow: "none",
      },
    })
  } finally {
    wrapper.remove()
  }
}

async function dataUrlToText(dataUrl: string) {
  const response = await fetch(dataUrl)
  return response.text()
}

function katexCssWithCdnFonts() {
  return katexCss.replaceAll(
    "url(fonts/",
    "url(https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/fonts/"
  )
}

function posterCssForHtmlExport() {
  return [
    katexCssWithCdnFonts(),
    highlightCss,
    posterCss,
    ".poster-root{width:var(--poster-page-width,960px);max-width:none;margin:0;box-shadow:none;}",
  ].join("\n")
}

export function savePosterHtml(node: HTMLElement, poster: Poster) {
  const posterMarkup = node.outerHTML
  const html = [
    "<!doctype html>",
    '<html lang="ja">',
    "<head>",
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${escapeHtml(poster.title)}</title>`,
    "<style>",
    posterCssForHtmlExport(),
    "body{margin:0;background:#fff;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#171717;}",
    ".poster-export-page{min-height:100vh;background:#fff;padding:24px;box-sizing:border-box;}",
    "</style>",
    "</head>",
    '<body><main class="poster-export-page">',
    posterMarkup,
    "</main></body></html>",
  ].join("\n")

  downloadText(
    html,
    safeFileName(poster.title, "html"),
    "text/html;charset=utf-8"
  )
}

export function printPoster() {
  window.print()
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
