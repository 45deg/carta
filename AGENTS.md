# Coding Guidelines for Agents

Welcome! As an AI coding agent or developer working on the **Carta** project, you must strictly follow these development guidelines to maintain high code quality, performance, and clean architecture.

---

## Dev environment tips

- **Do not let any file grow beyond 500 lines.** If a React component (e.g., `src/App.tsx`), a stylesheet (e.g., files under `src/styles/`), or any utility file exceeds **500 lines**, you MUST refactor and split it into smaller components or modules.
- **Save new React components under `src/components/` only.**
- **Do not write styles in a single massive CSS file.** You MUST keep styling modular by organizing styles inside the `src/styles/` directory.
- **Do not implement bloated custom React hooks.** If a hook handles multiple distinct responsibilities or exceeds a clean length, you MUST break it down into smaller custom hooks.
- **Do not declare utility or helper functions inside hooks.** You MUST move them outside of the hook definition (e.g., to the bottom of the file) or extract them into dedicated utility modules under `src/lib/`.
- **Do not hardcode user-facing strings in UI components.** You MUST use the `useTranslation` hook or the `t` function to display text.
- **You MUST update both locale resource files in sync** when adding or modifying text to maintain identical keys and structures across both files:
  - English Locale: `src/locales/en.ts`
  - Japanese Locale: `src/locales/ja.ts`
- **NEVER edit files under `src/components/ui/` directly.** These are managed by the shadcn CLI. You MUST customize them by passing classes via the `className` prop, or by writing wrapper components in `src/components/` if logic overrides are needed.

---

## Testing instructions

- **You MUST verify that your changes do not introduce regressions, syntax errors, or styling issues** before finishing a task.
- **You MUST run type checking** and verify that TypeScript compilation passes without any errors.
- **You MUST run unit and integration tests** and ensure no functionality is broken.
- **You MAY run end-to-end tests** using Playwright to ensure the rendering flow works.

---

## PR instructions

- **You MUST run ESLint** before submitting a PR or ending a task to verify there are no warnings or errors.
- **You MUST fix all type errors and test failures** so that the entire suite remains green.
