import { type Poster } from "@/schema/posterSchema"

export const posterFontSizeOptions = [
  { label: "1", value: "1", size: 13 },
  { label: "2", value: "2", size: 15 },
  { label: "3", value: "3", size: 16 },
  { label: "4", value: "4", size: 19 },
  { label: "5", value: "5", size: 22 },
] as const

export const posterWidthOptions = [
  { label: "最大", value: "max", width: "fit" },
  { label: "大", value: "large", width: 1080 },
  { label: "中", value: "medium", width: 960 },
  { label: "小", value: "small", width: 840 },
] as const

export const samplePoster: Poster = {
  title: "分割統治法：構造・手順・計算量",
  description:
    "大きな問題を小さな部分問題へ分けて解く分割統治法について、基本構造、マージソートの流れ、再帰方程式の読み方、実装時の注意点を整理した学習用ポスターです。",
  blocks: [
    {
      type: "card",
      title: "基本発想",
      emoji: "💡",
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
          body: "flowchart TD\n  A[\"[5, 2, 4, 7]\"] --> B1[\"[5, 2]\"]\n  A --> B2[\"[4, 7]\"]\n  B1 --> C1[\"[5]\"]\n  B1 --> C2[\"[2]\"]\n  B2 --> C3[\"[4]\"]\n  B2 --> C4[\"[7]\"]\n  C1 --> D1[\"[2, 5]\"]\n  C2 --> D1\n  C3 --> D2[\"[4, 7]\"]\n  C4 --> D2\n  D1 --> E[\"[2, 4, 5, 7]\"]\n  D2 --> E",
          caption:
            "要素数が1になるまで分割し、整列済みの部分配列を下から順に結合します。",
        },
      ],
    },
    {
      type: "card",
      title: "再帰方程式の読み方",
      emoji: "📘",
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
