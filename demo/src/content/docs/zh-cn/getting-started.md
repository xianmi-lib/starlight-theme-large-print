---
title: 快速上手
description: 安装并配置 starlight-theme-large-print。
---

## 安装

```bash
npm install starlight-theme-large-print
# 可选：一个中文字体包
npm install starlight-theme-large-print-font-noto-serif-sc   # 简体中文
npm install starlight-theme-large-print-font-noto-serif-tc   # 繁体中文
```

## 配置

在 `astro.config.mjs` 中把插件加入 Starlight 的 `plugins` 数组：

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

## 加入字号调节控件

主题不会自动注入字号控件（自动覆盖 Starlight 组件会与其他主题撞车）。请在你自己的 `Header` 覆盖件里渲染，放在 `<ThemeSelect />` 旁边：

```astro
---
import FontSizeControl from 'starlight-theme-large-print/components/FontSizeControl.astro';
---

<FontSizeControl />
```

### 下拉变体：`FontSizeSelect`

下拉形态（原生 `<select>`），按名称显示当前档位——同样五档、同一套持久化机制，读者偏好在两种控件之间互通。档位名与无障碍名称都是参数，方便本地化：

```astro
---
import FontSizeSelect from 'starlight-theme-large-print/components/FontSizeSelect.astro';
---

<FontSizeSelect labels={['小', '稍小', '标准', '大', '特大']} ariaLabel="字号" />
```

两种控件可以共存于同一页面（通过 `data-lp-step` 保持同步），但站点一般任选其一。

### 按语言配字体（多语言站点）

`font` 也接受以 Starlight locale 为键的映射：每种语言的页面使用各自的字体包，通过 `<html lang>` 属性分域生效。`root` 键（如有）与字符串形式一样设置全站默认。本演示站即用它实现简体页加载 SC、繁体页加载 TC：

```js
starlightThemeLargePrint({
  font: { 'zh-cn': 'noto-serif-sc', 'zh-tw': 'noto-serif-tc' },
}),
```

引用到的字体包都要安装；没有对应条目的语言，页面回退到系统衬线字体栈。

## 选项

| 选项 | 默认值 | 说明 |
| --- | --- | --- |
| `font` | `false` | `'noto-serif-sc'` \| `'noto-serif-tc'` \| `false` \| locale→字体包映射。需安装对应的字体包。 |
| `baseFontSize` | `'17px'` | 正文字号基准；读者可用字号控件覆盖。 |
| `lineHeight` | `1.85` | 正文行高。 |
| `warmDark` | `true` | 暖纸色调的暗色模式背景。 |
