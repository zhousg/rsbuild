# CSS Usage

Rsbuild has built-in multiple style resource processing capabilities, including Less / Sass preprocessor, PostCSS, CSS Modules, CSS inline and CSS compression.

In addition, Rsbuild also provides multiple configs to customize the compile rules of style resources.

## Using Less, Sass and Stylus

The Rsbuild has built-in community popular CSS preprocessors such as Less, Sass.

By default, you don't need to configure anything for Less and Sass. If you need to customize loader config, you can configure [tools.less](/config/options/tools.html#toolsless), [tools.sass](/config/options/tools.html#toolssass) to set it up.

You can also use Stylus in Rsbuild, just install the Stylus plugin provided by Rsbuild, please refer to [Stylus Plugin](/plugins/list/plugin-stylus.html) for usage.

## Using PostCSS

Rsbuild has built-in [PostCSS](https://postcss.org/) to transform the CSS code. You can configure the postcss-loader via [tools.postcss](/config/options/tools.html#toolspostcss).

```ts
export default {
  tools: {
    postcss: (opts) => {
      const viewportPlugin = require('postcss-px-to-viewport')({
        viewportWidth: 375,
      });
      opts.postcssOptions.plugins.push(viewportPlugin);
    },
  },
};
```

### Builtin PostCSS plugins

Rsbuild has some builtin PostCSS plugins, which will perform the following transformations on CSS:

- [autoprefixer](https://github.com/postcss/autoprefixer): we have enabled [autoprefixer](https://github.com/postcss/autoprefixer) to add vendor prefixes to CSS rules. If you want to configure the target browser, you can use [output.overrideBrowserslist](/config/options/output.html#outputoverridebrowserslist) config.
- [postcss-nesting](https://www.npmjs.com/package/postcss-nested): Provide [CSS Nesting](https://drafts.csswg.org/css-nesting-1/) support, you can Use nested writing in CSS, such as:

```css
.my-table {
  & td {
    text-align: center;

    &.c {
      text-transform: uppercase;
    }
  }
}
```

- [postcss-flexbugs-fixes](https://www.npmjs.com/package/postcss-flexbugs-fixes): Used to fix known [Flex Bugs](https://github.com/philipwalton/flexbugs).
- [postcss-initial](https://www.npmjs.com/package/postcss-initial): Enabled only when it needs to be compatible with legacy browsers, providing the [`initial` attribute value](https://developer.mozilla.org/en-US/docs/Web/CSS/initial_value) compatible.
- [postcss-page-break](https://www.npmjs.com/package/postcss-page-break): Enabled only when compatibility with legacy browsers is required, providing support for [`break-` attribute](https://developer.mozilla.org/en-US/docs/Web/CSS/break-after).
- [postcss-font-variant](https://www.npmjs.com/package/postcss-font-variant): Enabled only when compatibility with legacy browsers is required, providing support for [`font-variant`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant).
- [postcss-media-minmax](https://www.npmjs.com/package/postcss-media-minmax): Enabled only when compatibility with legacy browsers is required, providing support for [Media Query Ranges](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#syntax_improvements_in_level_4) compatibility.
- [postcss-custom-properties](https://www.npmjs.com/package/postcss-custom-properties): Only enabled when compatibility with legacy browsers is required, providing support for [Custom Properties](https://www.w3.org/TR/css-variables-1/), you can define and use custom variables in CSS, such as:

```css
:root {
  --main-bg-color: pink;
}

body {
  background-color: var(--main-bg-color);
}
```

## Using CSS Modules

Please read the [Using CSS Modules](/guide/basic/css-modules.html) chapter for a complete usage of CSS Modules.

## CSS Minify

Usually, in production environments we compress static assets such as CSS, JS, etc. to achieve better transfer efficiency.

Rsbuild automatically compresses CSS code at production build time with [css-minimizer-webpack-plugin](https://github.com/webpack-contrib/css-minimizer-webpack-plugin) (The compression tool used at the bottom is [cssnano](https://cssnano.co/)).

You can configure [tools.minifyCss](/config/options/tools.html#toolsminifycss) to make it more customizable.

:::tip About cssnano
cssnano is a tool for optimizing and minifying CSS files. It reduces the size of CSS files by removing unused rules, merging similar rules, removing comments and whitespace, and converting length units, among other techniques, to improve the loading speed of websites.
:::

## Inline CSS Files

By default, Rsbuild will extract CSS into a separate `.css` file and output it to the dist directory.

If you want to inline styles into your JS file, you can set [output.disableCssExtract](/config/options/output.html#outputdisablecssextract) to true to disable CSS extraction logic.When the JS file is requested by the browser, JS dynamically inserts the `<style>` tag into the Html to load the CSS styles.

```ts
export default {
  output: {
    disableCssExtract: true,
  },
};
```

This will increase the size of your JS Bundle, so it is usually not recommended to disable the CSS extraction.

## Import CSS in node_modules

You can directly import CSS files in node_modules.

- Import in a component:

```ts title="src/App.tsx"
// Import the Arco Design style:
import '@arco-design/web-react/dist/css/arco.css';
```

- Import in a style file:

```css title="src/App.css"
/* reference normalize.css */
/* https://github.com/necolas/normalize.css */
@import 'normalize.css';

body {
  /* */
}
```
