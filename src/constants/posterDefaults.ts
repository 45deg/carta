import { type Poster } from "@/schema/posterSchema"

export const posterWidthOptions = [720, 840, 960, 1080, 1200]

export const samplePoster: Poster = {
  title: "アルゴリズム設計：分割統治法と計算量",
  description:
    "大きな問題を小さな問題に分割して解く「分割統治法」の基本、計算量の評価方法、およびマージソートを例とした具体的な流れを整理した学習用ポスターです。",
  blocks: [
    {
      type: "card",
      title: "分割統治法 (Divide and Conquer) の基本設計",
      emoji: "💡",
      color: "concept",
      body: "分割統治法は、困難な問題を**直接解決しやすい小さな部分問題**に分割し、それぞれの答えを組み合わせて元の問題の解決策を得るアプローチです。\n\n通常、以下の**3つのステップ**を再帰的に適用します。\n\n| フェーズ | 実行内容 | 目的 |\n| :--- | :--- | :--- |\n| **1. 分割 (Divide)** | 元の問題を同一形式の複数の部分問題へと分割する | 扱いやすいサイズまで問題を小さくする |\n| **2. 統治 (Conquer)** | 部分問題を再帰的に解く。十分に小さければ直接解く | 各部分問題の独立した解決 |\n| **3. 結合 (Combine)** | 部分問題の解を結合して、元の問題の解を構築する | 分散した解を統合する |"
    },
    {
      type: "columns",
      size: [1, 1],
      columns: [
        {
          type: "card",
          title: "基本アルゴリズム：マージソート",
          emoji: "⚡",
          color: "procedure",
          body: "マージソートは分割統治法の最も典型的な応用例です。\n配列を半分に分割し、それぞれをソートした後に「マージ」します。\n\n### 特徴と計算量\n- **最悪/最善/平均時間計算量**: $O(n \\log n)$\n- **空間計算量**: $O(n)$ (外部メモリを必要とする)\n- **安定性**: 安定ソートである\n\n### 再帰方程式 (Recurrence)\n$$\nT(n) = 2T(n/2) + O(n)\n$$\nここで $2T(n/2)$ は2つの部分問題のソート、$O(n)$ はマージ処理のコストを表します。"
        },
        {
          type: "diagram",
          format: "mermaid",
          title: "マージソートの処理フロー",
          body: "flowchart TD\n  subgraph Split [分割フェーズ Top-Down]\n    A[\"[5, 2, 4, 7] (未ソート)\"] --> B1[\"[5, 2]\"]\n    A --> B2[\"[4, 7]\"]\n    B1 --> C1[\"[5]\"]\n    B1 --> C2[\"[2]\"]\n    B2 --> C3[\"[4]\"]\n    B2 --> C4[\"[7]\"]\n  end\n  subgraph Merge [マージフェーズ Bottom-Up]\n    C1 --> D1[\"[2, 5] (ソート済)\"]\n    C2 --> D1\n    C3 --> D2[\"[4, 7] (ソート済)\"]\n    C4 --> D2\n    D1 --> E[\"[2, 4, 5, 7] (完全ソート)\"]\n    D2 --> E\n  end\n  style A fill:#f1f5f9,stroke:#64748b,stroke-width:2px\n  style E fill:#ecfdf5,stroke:#10b981,stroke-width:2px\n  style C1 fill:#fee2e2,stroke:#ef4444\n  style C2 fill:#fee2e2,stroke:#ef4444\n  style C3 fill:#fee2e2,stroke:#ef4444\n  style C4 fill:#fee2e2,stroke:#ef4444",
          caption: "要素数が1になるまで再帰的に分割し、整列しながら木を遡るようにマージします。"
        }
      ]
    },
    {
      type: "columns",
      size: [1, 1],
      columns: [
        {
          type: "card",
          title: "計算量解析の武器：マスター定理 (Master Theorem)",
          emoji: "🎓",
          color: "term",
          body: "マスター定理は、再帰方程式 $T(n) = aT(n/b) + f(n)$ を持つ分割統治アルゴリズムの時間計算量を簡潔に評価するための強力な定理です。\n\n### 基本定義\n- $a \\ge 1$: 部分問題の数\n- $b > 1$: 部分問題の縮小比率\n- $f(n)$: 分割とマージのコスト\n\n### 3つのケース分類\n$c = \\log_b a$ と定義し、$f(n) = \\Theta(n^d)$ とする。\n\n| ケース | 条件 | 解 $T(n)$ | 例 |\n| :--- | :--- | :--- | :--- |\n| **Case 1** | $d < c$ | $T(n) = \\Theta(n^{\\log_b a})$ | 行列積 (Strassen) |\n| **Case 2** | $d = c$ | $T(n) = \\Theta(n^d \\log n)$ | **マージソート** |\n| **Case 3** | $d > c$ | $T(n) = \\Theta(f(n))$ | クイックソート (最良) |"
        },
        {
          type: "diagram",
          format: "vega_lite",
          title: "時間計算量の増大比較 (シミュレーション)",
          body: {
            $schema: "https://vega.github.io/schema/vega-lite/v5.json",
            description: "Comparison of sorting algorithms",
            data: {
              values: [
                { n: 1000, algorithm: "Bubble Sort (O(n²))", time: 300 },
                { n: 2000, algorithm: "Bubble Sort (O(n²))", time: 1200 },
                { n: 3000, algorithm: "Bubble Sort (O(n²))", time: 2700 },
                { n: 4000, algorithm: "Bubble Sort (O(n²))", time: 4800 },
                { n: 5000, algorithm: "Bubble Sort (O(n²))", time: 7500 },
                { n: 1000, algorithm: "Merge Sort (O(n log n))", time: 15 },
                { n: 2000, algorithm: "Merge Sort (O(n log n))", time: 32 },
                { n: 3000, algorithm: "Merge Sort (O(n log n))", time: 50 },
                { n: 4000, algorithm: "Merge Sort (O(n log n))", time: 68 },
                { n: 5000, algorithm: "Merge Sort (O(n log n))", time: 88 },
                { n: 1000, algorithm: "Quick Sort (O(n log n))", time: 10 },
                { n: 2000, algorithm: "Quick Sort (O(n log n))", time: 22 },
                { n: 3000, algorithm: "Quick Sort (O(n log n))", time: 35 },
                { n: 4000, algorithm: "Quick Sort (O(n log n))", time: 48 },
                { n: 5000, algorithm: "Quick Sort (O(n log n))", time: 62 }
              ]
            },
            mark: { type: "line", point: true },
            encoding: {
              x: {
                field: "n",
                type: "quantitative",
                title: "要素数 (N)",
                axis: { grid: true }
              },
              y: {
                field: "time",
                type: "quantitative",
                title: "実行時間 (ミリ秒)",
                scale: { type: "linear" }
              },
              color: {
                field: "algorithm",
                type: "nominal",
                title: "アルゴリズム",
                scale: {
                  domain: [
                    "Bubble Sort (O(n²))",
                    "Merge Sort (O(n log n))",
                    "Quick Sort (O(n log n))"
                  ],
                  range: ["#ef4444", "#3b82f6", "#10b981"]
                }
              }
            }
          },
          caption: "要素数Nの増加に伴う、バブルソート(赤)、マージソート(青)、クイックソート(緑)の理論的な実行時間推移の比較。"
        }
      ]
    },
    {
      type: "card",
      title: "コールスタックの制限と最適化",
      emoji: "⚠️",
      color: "danger",
      body: "再帰アルゴリズムの実装時には、コールスタックの消費による **Stack Overflow** に対する考慮が不可欠です。\n\n### 主な最適化・回避アプローチ\n1. **末尾再帰最適化 (Tail Call Optimization)**:\n   関数の末尾で再帰呼び出しを行う設計。コンパイラやランタイムがスタックフレームを再利用できる場合に有効です。\n2. **イテレーティブな実装への書き換え**:\n   キューやスタック用の配列を用意し、`while` ループを用いて明示的に処理を管理します。\n\n### JavaScriptによるマージ処理の実装例\n```javascript\n// 2つのソート済み配列をマージする関数\nfunction merge(left, right) {\n  const result = [];\n  let l = 0, r = 0;\n  while (l < left.length && r < right.length) {\n    if (left[l] < right[r]) {\n      result.push(left[l++]);\n    } else {\n      result.push(right[r++]);\n    }\n  }\n  return result.concat(left.slice(l)).concat(right.slice(r));\n}\n```"
    }
  ]
}
