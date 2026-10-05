---
title: 快速上手
description: 安裝並配置 starlight-theme-large-print。
---

## 安裝

```bash
npm install starlight-theme-large-print
# 可選：一箇中文字體包
npm install starlight-theme-large-print-font-noto-serif-sc   # 簡體中文
npm install starlight-theme-large-print-font-noto-serif-tc   # 繁體中文
```

## 配置

在 `astro.config.mjs` 中把插件加入 Starlight 的 `plugins` 數組：

```js
import starlightThemeLargePrint from 'starlight-theme-large-print';

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightThemeLargePrint({
          font: 'noto-serif-sc', // 'noto-serif-sc' | 'noto-serif-tc' | false
          // baseFontSize: '17px',
          // lineHeight: 1.85,
          // warmDark: true,
        }),
      ],
    }),
  ],
});
```

## 加入字號調節控件

主題不會自動注入字號控件（自動覆蓋 Starlight 組件會與其他主題撞車）。請在你自己的 `Header` 覆蓋件裡渲染，放在 `<ThemeSelect />` 旁邊：

```astro
---
import FontSizeControl from 'starlight-theme-large-print/components/FontSizeControl.astro';
---

<FontSizeControl />
```

### 下拉變體：`FontSizeSelect`

下拉形態（原生 `<select>`），按名稱顯示當前檔位——同樣五檔、同一套持久化機制，讀者偏好在兩種控件之間互通。檔位名與無障礙名稱都是參數，方便本地化：

```astro
---
import FontSizeSelect from 'starlight-theme-large-print/components/FontSizeSelect.astro';
---

<FontSizeSelect labels={['小', '稍小', '標準', '大', '特大']} ariaLabel="字號" />
```

兩種控件可以共存於同一頁面（通過 `data-lp-step` 保持同步），但站點一般任選其一。

### 按語言配字體（多語言站點）

`font` 也接受以 Starlight locale 為鍵的映射：每種語言的頁面使用各自的字體包，通過 `<html lang>` 屬性分域生效。`root` 鍵（如有）與字符串形式一樣設置全站默認。本演示站即用它實現簡體頁加載 SC、繁體頁加載 TC：

```js
starlightThemeLargePrint({
  font: { 'zh-cn': 'noto-serif-sc', 'zh-tw': 'noto-serif-tc' },
}),
```

引用到的字體包都要安裝；沒有對應條目的語言，頁面回退到系統襯線字體棧。

## 選項

| 選項 | 默認值 | 說明 |
| --- | --- | --- |
| `font` | `false` | `'noto-serif-sc'` \| `'noto-serif-tc'` \| `false` \| locale→字體包映射。需安裝對應的字體包。 |
| `baseFontSize` | `'17px'` | 正文字號基準；讀者可用字號控件覆蓋。 |
| `lineHeight` | `1.85` | 正文行高。 |
| `warmDark` | `true` | 暖紙色調的暗色模式背景。 |
