---
title: 排版風格
description: starlight-theme-large-print 的排版取捨。
---

本頁演示主題的排版氣質：為長文閱讀而設的安靜襯線。

## 閱讀舒適優先

主題把正文設為 17px、1.85 倍行高——相比 Starlight 默認的 16px / 1.75 是有意上調。段落呼吸感更足，標題與正文同屬一個襯線家族，閱讀語氣始終不中斷。

### 更小的標題

即便到更深的層級，標題也保持安靜、文雅，而不喧譁。

#### 第四級標題

長文內容得益於剋制。The quick brown fox jumps over the lazy dog. Sphinx of black quartz, judge my vow. Pack my box with five dozen liquor jugs.

## 列表與強調

- 襯線正文，閱讀尺寸舒適
- **粗體**使用配套的襯線粗字字重
- *斜體*對中日韓文字有優雅的回退處理
- `行內代碼`保持等寬氣質，尺寸可讀

1. 有序列表繼承同樣的節奏
2. 寬屏下行長也保持在舒適區
3. 讀者可用頁首控件整體放大

> 引用塊保持同樣的襯線語氣。"最好的界面，是讓文字自己說話的界面。"

## 代碼

```ts
// 代碼塊保持 Starlight 的 Expressive Code 渲染，原樣不動。
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```
