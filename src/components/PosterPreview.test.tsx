import { render, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { PosterPreview } from "@/components/PosterPreview"
import { type Poster } from "@/schema/posterSchema"

describe("PosterPreview", () => {
  it("renders inline KaTeX in poster and card titles", async () => {
    const poster: Poster = {
      title: "Complexity $O(n \\log n)$",
      description: "A short description.",
      blocks: [
        {
          type: "card",
          title: "Recurrence $T(n)$",
          body: "Body text.",
        },
      ],
    }

    const { container } = render(
      <PosterPreview poster={poster} baseFontSize={16} width={960} />
    )

    await waitFor(() => {
      expect(container.querySelectorAll("h1 .katex")).toHaveLength(1)
      expect(
        container.querySelectorAll(".poster-card-heading h2 .katex")
      ).toHaveLength(1)
    })
  })
})
