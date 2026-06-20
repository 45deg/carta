export const jaResources = {
  translation: {
    app: {
      title: "構造化知識ポスタージェネレーター",
      localOnly: "ローカル処理・データ送信なし",
    },
    step1: {
      title: "YAMLをAIで作成",
      desc: "以下のプロンプトでGPTs/Skills/Gemsなどを作成し、それに説明させたい対象や資料を提示してYAMLを出力させてください。直接プロンプトをチャットに聞いても構いません。",
      prompt: "Prompt",
      copy: "コピー",
      copied: "コピーしました",
    },
    step2: {
      title: "出力されたYAMLを貼り付け",
      render: "出力",
    },
    output: {
      back: "戻る",
      settings: "設定",
      fontSize: "文字サイズ",
      fontSizeAria: "文字サイズ {{label}}",
      fontSizeSelect: "文字サイズ",
      fontSizeOpen: "文字サイズの候補を開く",
      fontSizeEmpty: "候補がありません",
      fontSizeDecrease: "文字サイズを小さくする",
      fontSizeIncrease: "文字サイズを大きくする",
      width: "列幅",
      widthAria: "列幅 {{label}}",
      columnCount: "列分割",
      columnCountAria: "列分割数 {{label}}",
      widthOptions: {
        large: "大",
        medium: "中",
        small: "小",
      },
      exportError: "エクスポートエラー: {{error}}",
      exportErrorDefault: "エクスポート中にエラーが発生しました。",
      close: "閉じる",
      language: "言語",
    },
    export: {
      saving: "保存中",
      export: "出力",
      formatTitle: "保存形式",
      optionPdf: "PDF印刷",
      optionHtml: "Single HTML",
    },
    editor: {
      defaultLabel: "YAML入力",
    },
    validation: {
      success: "YAML/JSONは有効です。",
      errorTitle:
        "この修正内容を再度AIに入力してYAML（またはJSON）を作り直させてください。",
      copyError: "エラーをコピー",
      copiedError: "コピーしました",
      invalidSchemaPrefix:
        "以下のYAML/JSONは学習用構造化ポスターのスキーマに合っていません。",
      invalidSchemaSuffix:
        "次の検証エラーをすべて修正し、有効なYAMLまたはJSONのみを出力してください。\n\n{{message}}\n\n注意: blocks は1件以上、columns.columns は再帰的な Block 配列、card.body の layout.columns は content 配列、type/color/format/variant は定義済みの値だけを使ってください。",
      mermaidErrorPrefix:
        "以下のYAML/JSONにはMermaid図の構文エラーがあります。",
      mermaidErrorSuffix:
        "次の検証エラーをすべて修正し、有効なYAMLまたはJSONのみを出力してください。\n\n{{message}}\n\n注意: MermaidのbodyにはMermaidコードのみを書き、Markdownコードフェンスや説明文を含めないでください。",
      parseErrorPrefix: "以下のYAML/JSONは構文として読み取れません。",
      parseErrorSuffix:
        "構文エラーを修正し、学習用構造化ポスターのYAMLまたはJSONのみを出力してください。\n\n- YAML/JSON parse error: {{message}}",
    },
    diagram: {
      renderErrorTitle: "図を描画できませんでした",
      renderErrorDefault: "図の描画に失敗しました。",
    },
  },
}
