import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StepNumber } from "./StepNumber"

describe("StepNumber", () => {
  it("renders the value correctly", () => {
    render(<StepNumber value="5" />)
    expect(screen.getByText("5")).toBeInTheDocument()
  })
})
