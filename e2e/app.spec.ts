import { test, expect, type Page } from "@playwright/test"

interface CustomWindow extends Window {
  __printed?: boolean;
}

test.describe("Poster Card Generator E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto("/")
  })

  test("loads the application and displays the main heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Carta")
    await expect(page.locator("header.app-chrome p")).toContainText("構造化知識ポスタージェネレーター")
  })

  test("can navigate to output screen and back to workflow", async ({ page }) => {
    // 1. Initial screen should have Step 1 & Step 2 headers visible
    await expect(page.locator("text=YAMLをAIで作成")).toBeVisible()
    
    // 2. Click the "出力" button in the workflow card footer
    const outputBtn = page.getByRole("button", { name: "出力", exact: true })
    await expect(outputBtn).toBeEnabled()
    await outputBtn.click()

    // 3. We should now be in the output screen. Verify the "戻る" button is visible
    const backBtn = page.getByRole("button", { name: "戻る" })
    await expect(backBtn).toBeVisible()

    // 4. Click the "戻る" button and verify we are back to the initial screen
    await backBtn.click()
    await expect(page.locator("text=YAMLをAIで作成")).toBeVisible()
  })

  test("keeps default poster columns when printing from a narrow viewport", async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 900 })
    await page.getByRole("button", { name: "出力", exact: true }).click()
    await page.emulateMedia({ media: "print" })

    const columnGrid = page.locator(".poster-columns").first()
    await expect(columnGrid).toBeAttached()

    const gridTemplateColumns = await columnGrid.evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns
    )
    expect(gridTemplateColumns.split(" ").length).toBeGreaterThan(1)
  })

  test("verifies rendering and downloads for each format", async ({ page }, testInfo) => {
    testInfo.setTimeout(90000)

    await installDownloadCapture(page)

    // 1. Stub window.print() on the currently loaded page to test PDF printing
    await page.evaluate(() => {
      (window as unknown as CustomWindow).__printed = false;
      window.print = () => {
        (window as unknown as CustomWindow).__printed = true;
      };
    })

    // 2. Click the "出力" button to go to the output screen
    await page.getByRole("button", { name: "出力", exact: true }).click()

    // 3. Verify that the poster preview renders on screen
    const posterPreview = page.locator(".poster-print-stage")
    await expect(posterPreview).toBeVisible()

    // 4. Locate the Export dropdown in the header and click it to open
    const headerExportBtn = page.locator("header.app-chrome").getByRole("button", { name: "出力" })
    await expect(headerExportBtn).toBeVisible()
    await headerExportBtn.click()

    // Verify dropdown menu opened and save options are visible
    await expect(page.locator("text=保存形式")).toBeVisible()

    // --- Test PNG Download ---
    const pngExport = await clickMenuItemAndWaitForBlob(page, "PNG")
    expect(pngExport.type).toBe("image/png")
    expect(pngExport.size).toBeGreaterThan(1024)

    // Wait for the dropdown menu to completely close before clicking again
    await expect(page.locator("text=保存形式")).not.toBeVisible()

    // Re-open the export dropdown for the next format
    await headerExportBtn.click()
    await expect(page.locator("text=保存形式")).toBeVisible()

    // --- Test SVG Download ---
    const svgExport = await clickMenuItemAndWaitForBlob(page, "SVG")
    expect(svgExport.type).toBe("image/svg+xml;charset=utf-8")
    const svgContent = svgExport.text
    expect(svgContent).toContain("<svg")
    expect(svgContent).toContain("分割統治法") // Title of default poster should be embedded in the SVG

    // Wait for the dropdown menu to completely close before clicking again
    await expect(page.locator("text=保存形式")).not.toBeVisible()

    // Re-open the export dropdown for the next format
    await headerExportBtn.click()
    await expect(page.locator("text=保存形式")).toBeVisible()

    // --- Test HTML Download ---
    const htmlExport = await clickMenuItemAndWaitForBlob(page, "Single HTML")
    expect(htmlExport.type).toBe("text/html;charset=utf-8")
    const htmlContent = htmlExport.text
    expect(htmlContent).toContain("<!doctype html>")
    expect(htmlContent).toContain("<title>分割統治法：構造・手順・計算量</title>")
    expect(htmlContent).toContain("分割統治法：構造・手順・計算量")

    // Wait for the dropdown menu to completely close before clicking again
    await expect(page.locator("text=保存形式")).not.toBeVisible()

    // Re-open the export dropdown for the next format
    await headerExportBtn.click()
    await expect(page.locator("text=保存形式")).toBeVisible()

    await page.getByRole("menuitem", { name: "PDF印刷", exact: true }).click({
      force: true,
    })
    await page.waitForFunction(() => (window as unknown as CustomWindow).__printed)
    const printed = await page.evaluate(() => (window as unknown as CustomWindow).__printed)
    expect(printed).toBe(true)
  })
})

async function installDownloadCapture(page: Page) {
  await page.evaluate(() => {
    const globalWindow = window as Window & {
      __downloadCaptureInstalled?: boolean
      __downloadBlobs?: Blob[]
    }

    if (globalWindow.__downloadCaptureInstalled) {
      return
    }

    globalWindow.__downloadCaptureInstalled = true
    globalWindow.__downloadBlobs = []

    const originalCreateObjectURL = URL.createObjectURL.bind(URL)
    URL.createObjectURL = ((blob: Blob) => {
      globalWindow.__downloadBlobs?.push(blob)
      return originalCreateObjectURL(blob)
    }) as typeof URL.createObjectURL
  })
}

async function clickMenuItemAndWaitForBlob(page: Page, label: string) {
  const menuItem = page.getByRole("menuitem", { name: label, exact: true })
  await expect(menuItem).toBeVisible()

  const previousCount = await page.evaluate(() => {
    const globalWindow = window as Window & { __downloadBlobs?: Blob[] }
    return globalWindow.__downloadBlobs?.length ?? 0
  })

  await menuItem.click()

  await page.waitForFunction(
    (count) => {
      const globalWindow = window as Window & { __downloadBlobs?: Blob[] }
      return (globalWindow.__downloadBlobs?.length ?? 0) > count
    },
    previousCount
  )

  return page.evaluate(async (count) => {
    const globalWindow = window as Window & { __downloadBlobs?: Blob[] }
    const blob = globalWindow.__downloadBlobs?.[count]

    if (!blob) {
      throw new Error("Expected an export blob to be captured")
    }

    return {
      type: blob.type,
      size: blob.size,
      text: blob.type.startsWith("image/") && !blob.type.includes("svg") ? "" : await blob.text(),
    }
  }, previousCount)
}
