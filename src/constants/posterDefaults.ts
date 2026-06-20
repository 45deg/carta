import { type Poster } from "@/schema/posterSchema"

export const posterFontSizeOptions = [
  { label: "10", value: "10", size: 10 },
  { label: "11", value: "11", size: 11 },
  { label: "12", value: "12", size: 12 },
  { label: "13", value: "13", size: 13 },
  { label: "14", value: "14", size: 14 },
  { label: "15", value: "15", size: 15 },
  { label: "16", value: "16", size: 16 },
  { label: "18", value: "18", size: 18 },
  { label: "20", value: "20", size: 20 },
  { label: "22", value: "22", size: 22 },
  { label: "24", value: "24", size: 24 },
  { label: "28", value: "28", size: 28 },
  { label: "32", value: "32", size: 32 },
] as const

export const posterWidthOptions = [
  { label: "大", value: "large", width: 1080 },
  { label: "中", value: "medium", width: 960 },
  { label: "小", value: "small", width: 840 },
] as const

export const posterColumnCountOptions = [
  { label: "1", value: "1", count: 1 },
  { label: "2", value: "2", count: 2 },
  { label: "3", value: "3", count: 3 },
] as const

export const samplePosterJa: Poster = {
  title: "分割統治法：構造・手順・計算量",
  description:
    "大きな問題を小さな部分問題へ分けて解く分割統治法について、基本構造、マージソートの流れ、再帰方程式の読み方、実装時の注意点を整理した学習用ポスターです。",
  blocks: [
    {
      type: "card",
      title: "基本発想",
      emoji: "💡",
      icon: "lightbulb",
      color: "concept",
      body: [
        {
          type: "markdown",
          text: "分割統治法は、問題を**同じ形の小さな問題**に分け、部分問題の答えを組み合わせて全体の答えを作る設計法です。再帰的に考えると、複雑な処理を「分ける」「解く」「合わせる」の役割に分離できます。",
        },
        {
          type: "flow",
          variant: "steps",
          direction: "horizontal",
          items: [
            {
              title: "Divide",
              body: "元の問題を、同じ形式の複数の部分問題に分割する。",
            },
            {
              title: "Conquer",
              body: "部分問題を再帰的に解く。十分に小さい場合は直接解く。",
            },
            {
              title: "Combine",
              body: "部分問題の解を結合し、元の問題の解を構成する。",
            },
          ],
        },
      ],
    },
    {
      type: "columns",
      size: [2, 1],
      columns: [
        {
          type: "card",
          title: "マージソートで見る処理",
          emoji: "⚙️",
          icon: "settings",
          color: "procedure",
          body: [
            {
              type: "markdown",
              text: "マージソートは分割統治法の典型例です。配列を半分に分け、左右をそれぞれ整列し、最後に整列済み配列として結合します。",
            },
            {
              type: "layout",
              variant: "side_by_side",
              size: [1.1, 0.9],
              columns: [
                [
                  {
                    type: "flow",
                    variant: "timeline",
                    direction: "vertical",
                    items: [
                      {
                        title: "分割",
                        body: "`[5, 2, 4, 7]` を `[5, 2]` と `[4, 7]` に分ける。",
                      },
                      {
                        title: "基底",
                        body: "要素数が1になるまで分割し、単独要素は整列済みとみなす。",
                      },
                      {
                        title: "結合",
                        body: "小さい要素から順に取り出し、`[2, 4, 5, 7]` を作る。",
                      },
                    ],
                  },
                ],
                [
                  {
                    type: "list",
                    title: "性質",
                    variant: "definitions",
                    items: [
                      {
                        term: "時間計算量",
                        body: "最悪・平均・最善のいずれも $O(n \\log n)$。",
                      },
                      {
                        term: "空間計算量",
                        body: "マージ用の補助配列が必要なので $O(n)$。",
                      },
                      {
                        term: "安定性",
                        body: "同じ値の相対順序を保てる安定ソート。",
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          type: "diagram",
          format: "mermaid",
          title: "分割と結合の全体像",
          body: 'flowchart TD\n  A["[5, 2, 4, 7]"] --> B1["[5, 2]"]\n  A --> B2["[4, 7]"]\n  B1 --> C1["[5]"]\n  B1 --> C2["[2]"]\n  B2 --> C3["[4]"]\n  B2 --> C4["[7]"]\n  C1 --> D1["[2, 5]"]\n  C2 --> D1\n  C3 --> D2["[4, 7]"]\n  C4 --> D2\n  D1 --> E["[2, 4, 5, 7]"]\n  D2 --> E',
          caption:
            "要素数が1になるまで分割し、整列済みの部分配列を下から順に結合します。",
        },
      ],
    },
    {
      type: "card",
      title: "再帰方程式の読み方",
      emoji: "📘",
      icon: "book-open",
      color: "term",
      body: [
        {
          type: "markdown",
          text: "分割統治法の計算量は、再帰方程式 $T(n) = aT(n/b) + f(n)$ として表せます。マージソートでは $T(n) = 2T(n/2) + O(n)$ です。",
        },
        {
          type: "layout",
          variant: "aside",
          columns: [
            [
              {
                type: "list",
                variant: "definitions",
                items: [
                  {
                    term: "$a$",
                    body: "生成される部分問題の数。マージソートでは2。",
                  },
                  {
                    term: "$b$",
                    body: "部分問題の縮小比率。マージソートでは2。",
                  },
                  {
                    term: "$f(n)$",
                    body: "分割と結合にかかる、再帰呼び出し以外のコスト。",
                  },
                ],
              },
            ],
            [
              {
                type: "markdown",
                text: "**直感**  \n各段で全要素を一度ずつマージし、段数は $\\log n$ 段あります。したがって全体は $O(n \\log n)$ になります。",
              },
            ],
          ],
        },
      ],
    },
    {
      type: "flow",
      title: "実装時に確認する順序",
      variant: "steps",
      direction: "horizontal",
      items: [
        {
          title: "基底条件",
          body: "問題サイズが十分小さいときに必ず停止する条件を書く。",
        },
        {
          title: "分割の妥当性",
          body: "部分問題が元の問題と同じ形式になっているか確認する。",
        },
        {
          title: "結合の正しさ",
          body: "部分解から全体解を作る処理で情報を落としていないか確認する。",
        },
      ],
    },
    {
      type: "list",
      title: "よくある落とし穴",
      variant: "checklist",
      items: [
        {
          body: "基底条件が弱く、再帰が止まらない。",
          checked: true,
        },
        {
          body: "分割後の部分問題が重なり、想定より計算量が増える。",
          checked: true,
        },
        {
          body: "結合処理のコストを無視して、再帰呼び出しだけで計算量を見積もる。",
          checked: true,
        },
      ],
    },
  ],
}

export const samplePosterEn: Poster = {
  title: "Divide and Conquer: Structure, Process, and Complexity",
  description:
    "A learning poster detailing the basic structure of the divide-and-conquer paradigm, the flow of merge sort, how to read recurrence equations, and implementation pitfalls.",
  blocks: [
    {
      type: "card",
      title: "Core Concept",
      emoji: "💡",
      icon: "lightbulb",
      color: "concept",
      body: [
        {
          type: "markdown",
          text: "Divide and conquer is an algorithm design paradigm that recursively breaks a problem down into **two or more sub-problems of the same type**, solves them directly when simple enough, and combines the solutions to solve the original problem.",
        },
        {
          type: "flow",
          variant: "steps",
          direction: "horizontal",
          items: [
            {
              title: "Divide",
              body: "Break the problem into sub-problems of the same type.",
            },
            {
              title: "Conquer",
              body: "Solve sub-problems recursively. If small enough, solve directly.",
            },
            {
              title: "Combine",
              body: "Merge the sub-problem solutions to build the final answer.",
            },
          ],
        },
      ],
    },
    {
      type: "columns",
      size: [2, 1],
      columns: [
        {
          type: "card",
          title: "Merge Sort in Action",
          emoji: "⚙️",
          icon: "settings",
          color: "procedure",
          body: [
            {
              type: "markdown",
              text: "Merge sort is a classic example of divide and conquer. It splits an array in half, sorts each half recursively, and merges the sorted halves.",
            },
            {
              type: "layout",
              variant: "side_by_side",
              size: [1.1, 0.9],
              columns: [
                [
                  {
                    type: "flow",
                    variant: "timeline",
                    direction: "vertical",
                    items: [
                      {
                        title: "Divide",
                        body: "Split `[5, 2, 4, 7]` into `[5, 2]` and `[4, 7]`.",
                      },
                      {
                        title: "Base Case",
                        body: "Stop dividing when size is 1; single elements are sorted.",
                      },
                      {
                        title: "Combine",
                        body: "Merge sub-arrays in sorted order to get `[2, 4, 5, 7]`.",
                      },
                    ],
                  },
                ],
                [
                  {
                    type: "list",
                    title: "Properties",
                    variant: "definitions",
                    items: [
                      {
                        term: "Time Complexity",
                        body: "$O(n \\log n)$ in worst, average, and best cases.",
                      },
                      {
                        term: "Space Complexity",
                        body: "$O(n)$ auxiliary space required for merging.",
                      },
                      {
                        term: "Stability",
                        body: "A stable sort that preserves relative order of equal keys.",
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          type: "diagram",
          format: "mermaid",
          title: "Overall Flow of Divide & Combine",
          body: 'flowchart TD\n  A["[5, 2, 4, 7]"] --> B1["[5, 2]"]\n  A --> B2["[4, 7]"]\n  B1 --> C1["[5]"]\n  B1 --> C2["[2]"]\n  B2 --> C3["[4]"]\n  B2 --> C4["[7]"]\n  C1 --> D1["[2, 5]"]\n  C2 --> D1\n  C3 --> D2["[4, 7]"]\n  C4 --> D2\n  D1 --> E["[2, 4, 5, 7]"]\n  D2 --> E',
          caption:
            "Divide until array sizes are 1, then combine sorted sub-arrays bottom-up.",
        },
      ],
    },
    {
      type: "card",
      title: "Reading Recurrence Equations",
      emoji: "📘",
      icon: "book-open",
      color: "term",
      body: [
        {
          type: "markdown",
          text: "The time complexity of divide and conquer is expressed as $T(n) = aT(n/b) + f(n)$. For merge sort, it is $T(n) = 2T(n/2) + O(n)$.",
        },
        {
          type: "layout",
          variant: "aside",
          columns: [
            [
              {
                type: "list",
                variant: "definitions",
                items: [
                  {
                    term: "$a$",
                    body: "Number of sub-problems. 2 for merge sort.",
                  },
                  {
                    term: "$b$",
                    body: "Problem reduction ratio. 2 for merge sort.",
                  },
                  {
                    term: "$f(n)$",
                    body: "Cost of division and combining outside the recursion.",
                  },
                ],
              },
            ],
            [
              {
                type: "markdown",
                text: "**Intuition**  \nAt each level of the recursion tree, we merge all elements once with cost $O(n)$, and there are $\\log n$ levels. Thus, the total complexity is $O(n \\log n)$.",
              },
            ],
          ],
        },
      ],
    },
    {
      type: "flow",
      title: "Implementation Verification Steps",
      variant: "steps",
      direction: "horizontal",
      items: [
        {
          title: "Base Case",
          body: "Ensure a valid stop condition exists for small inputs to prevent infinite recursion.",
        },
        {
          title: "Division Validity",
          body: "Confirm that sub-problems have the exact same structure as the main problem.",
        },
        {
          title: "Combination Correctness",
          body: "Verify that combining sub-solutions does not drop any information.",
        },
      ],
    },
    {
      type: "list",
      title: "Common Pitfalls",
      variant: "checklist",
      items: [
        {
          body: "Weak base case, leading to stack overflow / infinite recursion.",
          checked: true,
        },
        {
          body: "Overlapping sub-problems, increasing time complexity beyond expectations.",
          checked: true,
        },
        {
          body: "Ignoring division/combination cost when estimating overall complexity.",
          checked: true,
        },
      ],
    },
  ],
}
