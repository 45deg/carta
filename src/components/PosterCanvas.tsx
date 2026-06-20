import { useState, type ReactNode } from "react"
import { Maximize2, Minus, MoveHorizontal, Plus, RotateCcw } from "lucide-react"
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch"

import { Button } from "@/components/ui/button"

type PosterCanvasProps = {
  children: ReactNode
}

const minScale = 0.2
const maxScale = 2
const fitPadding = 48

export function PosterCanvas({ children }: PosterCanvasProps) {
  const [scale, setScale] = useState(1)

  return (
    <section className="poster-canvas" aria-label="Poster canvas">
      <TransformWrapper
        initialScale={1}
        minScale={minScale}
        maxScale={maxScale}
        centerOnInit
        centerZoomedOut
        limitToBounds={false}
        smooth
        wheel={{ wheelDisabled: true }}
        trackPadPanning={{ disabled: false, velocityDisabled: true }}
        panning={{ velocityDisabled: true }}
        doubleClick={{ disabled: true }}
        onInit={(ref) => {
          window.requestAnimationFrame(() => fitToScreen(ref, setScale, 0))
        }}
        onTransform={(_, state) => setScale(state.scale)}
      >
        {(controls) => (
          <>
            <TransformComponent
              wrapperClass="poster-canvas-viewport"
              contentClass="poster-canvas-content"
            >
              {children}
            </TransformComponent>
            <ZoomControls controls={controls} scale={scale} />
          </>
        )}
      </TransformWrapper>
    </section>
  )
}

function ZoomControls({
  controls,
  scale,
}: {
  controls: ReactZoomPanPinchContentRef
  scale: number
}) {
  return (
    <div className="poster-zoom-controls no-print" aria-label="Zoom controls">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Zoom out"
        aria-label="Zoom out"
        onClick={() => controls.zoomOut(0.2, 120)}
      >
        <Minus className="size-4" />
      </Button>
      <span className="poster-zoom-value" aria-live="polite">
        {Math.round(scale * 100)}%
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Zoom in"
        aria-label="Zoom in"
        onClick={() => controls.zoomIn(0.2, 120)}
      >
        <Plus className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        title="Fit to canvas"
        aria-label="Fit to canvas"
        className="px-2.5"
        onClick={() => fitToScreen(controls, undefined, 160)}
      >
        <Maximize2 className="size-4" />
        Screen
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        title="Fit to width"
        aria-label="Fit to width"
        className="px-2.5"
        onClick={() => fitToWidth(controls, undefined, 160)}
      >
        <MoveHorizontal className="size-4" />
        Width
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        title="Set zoom to 100%"
        aria-label="Set zoom to 100%"
        className="px-2.5"
        onClick={() => controls.centerView(1, 160)}
      >
        <RotateCcw className="size-4" />
        100%
      </Button>
    </div>
  )
}

function fitToScreen(
  controls: ReactZoomPanPinchContentRef,
  onScaleChange?: (scale: number) => void,
  animationTime = 160
) {
  const wrapper = controls.instance.wrapperComponent
  const content = controls.instance.contentComponent

  if (!wrapper || !content) {
    return
  }

  const widthScale = (wrapper.clientWidth - fitPadding) / content.offsetWidth
  const heightScale = (wrapper.clientHeight - fitPadding) / content.offsetHeight
  const fittedScale = Math.min(widthScale, heightScale)
  const nextScale = Math.min(maxScale, Math.max(minScale, fittedScale))

  controls.centerView(nextScale, animationTime)
  onScaleChange?.(nextScale)
}

function fitToWidth(
  controls: ReactZoomPanPinchContentRef,
  onScaleChange?: (scale: number) => void,
  animationTime = 160
) {
  const wrapper = controls.instance.wrapperComponent
  const content = controls.instance.contentComponent

  if (!wrapper || !content) {
    return
  }

  const fittedScale = (wrapper.clientWidth - fitPadding) / content.offsetWidth
  const nextScale = Math.min(maxScale, Math.max(minScale, fittedScale))

  controls.centerView(nextScale, animationTime)
  onScaleChange?.(nextScale)
}
