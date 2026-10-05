---
title: 排版风格
description: starlight-theme-large-print 的排版取舍。
---

本页演示主题的排版气质：为长文阅读而设的安静衬线。

## 阅读舒适优先

主题把正文设为 17px、1.85 倍行高——相比 Starlight 默认的 16px / 1.75 是有意上调。段落呼吸感更足，标题与正文同属一个衬线家族，阅读语气始终不中断。

### 更小的标题

即便到更深的层级，标题也保持安静、文雅，而不喧哗。

#### 第四级标题

长文内容得益于克制。The quick brown fox jumps over the lazy dog. Sphinx of black quartz, judge my vow. Pack my box with five dozen liquor jugs.

## 列表与强调

- 衬线正文，阅读尺寸舒适
- **粗体**使用配套的衬线粗字字重
- *斜体*对中日韩文字有优雅的回退处理
- `行内代码`保持等宽气质，尺寸可读

1. 有序列表继承同样的节奏
2. 宽屏下行长也保持在舒适区
3. 读者可用页首控件整体放大

> 引用块保持同样的衬线语气。"最好的界面，是让文字自己说话的界面。"

## 代码

```ts
// 代码块保持 Starlight 的 Expressive Code 渲染，原样不动。
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```
