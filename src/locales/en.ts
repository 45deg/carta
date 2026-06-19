export const enResources = {
  translation: {
    app: {
      title: "Structured Knowledge Poster Generator",
      localOnly: "Local Processing · No Data Transmission",
    },
    step1: {
      title: "Generate YAML with AI",
      desc: "Use the prompt below to configure custom AI instances (like custom GPTs, Skills, or Gems). Present your subject or materials to have the AI output YAML. You can also paste the prompt directly into a chat.",
      prompt: "Prompt",
      copy: "Copy",
      copied: "Copied!",
    },
    step2: {
      title: "Paste the Generated YAML",
      render: "Render",
    },
    output: {
      back: "Back",
      settings: "Settings",
      fontSize: "Font size",
      fontSizeAria: "Font size {{label}}",
      width: "Width",
      widthAria: "Width {{label}}",
      widthOptions: {
        max: "Max",
        large: "Large",
        medium: "Medium",
        small: "Small",
      },
      exportError: "Export Error: {{error}}",
      exportErrorDefault: "An error occurred during export.",
      close: "Close",
      language: "Language",
    },
    export: {
      saving: "Saving...",
      export: "Export",
      formatTitle: "Save as",
      optionPdf: "Print PDF",
      optionHtml: "Single HTML",
    },
    editor: {
      defaultLabel: "YAML Input",
    },
    validation: {
      success: "YAML/JSON is valid.",
      errorTitle: "Please feed this error feedback back to the AI to regenerate a valid YAML (or JSON).",
      copyError: "Copy Error",
      copiedError: "Copied!",
      invalidSchemaPrefix: "The YAML/JSON below does not conform to the structured learning poster schema.",
      invalidSchemaSuffix: "Please correct all verification errors below and output only valid YAML or JSON.\n\n{{message}}\n\nNote: blocks must have at least 1 item, columns.columns must be a recursive array of Blocks, layout.columns in card.body must be a content array, and only predefined values for type, color, format, variant, and direction must be used.",
      mermaidErrorPrefix: "The YAML/JSON below contains syntax errors in the Mermaid diagram.",
      mermaidErrorSuffix: "Please correct all verification errors below and output only valid YAML or JSON.\n\n{{message}}\n\nNote: Include only Mermaid code in the diagram's body. Do not include Markdown code fences or descriptions.",
      parseErrorPrefix: "The YAML/JSON below cannot be parsed.",
      parseErrorSuffix: "Please correct the syntax errors and output only a valid structured learning poster in YAML or JSON.\n\n- YAML/JSON parse error: {{message}}",
    },
    diagram: {
      renderErrorTitle: "Could not render diagram",
      renderErrorDefault: "Failed to render diagram.",
    },
  },
}
