<picture>
  <img alt="Rsbuild Banner" src="https://github.com/web-infra-dev/rsbuild/assets/7237365/84abc13e-b620-468f-a90b-dbf28e7e9427">
</picture>

# Rsbuild

<p>
  <a href="https://discord.gg/dfJnVWaG">
    <img src="https://img.shields.io/discord/977448667919286283?logo=discord&label=discord&colorA=564341&colorB=EDED91" alt="discord channel" />
  </a>
  <a href="https://www.npmjs.com/package/@rsbuild/shared?activeTab=readme">
   <img src="https://img.shields.io/npm/v/@rsbuild/shared?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <a href="https://github.com/web-infra-dev/rsbuild/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@rsbuild/shared?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  </a>
</p>

English | [简体中文](./README.zh-CN.md)

Rsbuild is an Rspack-based build tool for the web.

## Why Rsbuild?

The main goal of Rsbuild is to provide out-of-the-box build capabilities for Rspack users, allowing developers to start a web project with zero configuration.

Rsbuild also provides universal build capabilities for higher level solutions, such as Rspress and Modern.js. In fact, Rsbuild is a rebrand of the Modern.js Builder. It has been decoupled from Modern.js to provide greater flexibility and to meet the diverse needs of community users.

The following diagram illustrates the relationship between Rsbuild and other tools in the ecosystem:

![Rspack Ecosystem](https://github.com/web-infra-dev/rsbuild/assets/7237365/1ec93ad6-b8b1-475b-963f-cba1e7d79dec)

## Features

- 🚀 **Rspack Based**: Using Rspack to bring you the ultimate development experience.
- 🦄 **Batteries Included**: Out-of-the-box integration with the most practical building features in the ecosystem.
- 🎯 **Framework Agnostic**: Supports React, Vue, Svelte, and more frameworks.
- 🛠️ **Deep Optimization**: Automatically optimize static assets to maximizing production performance.
- 🎨 **Highly Pluggable**: Comes with a lightweight plugin system and a set of high quality plugins.
- 🍭 **Easy to Configure**: Start with zero configuration and everything is configurable.

## Getting Started

**This project is new and under active development. It will be available in late November 2023.**

## Ecosystem

- 🦀 [Rspack](https://github.com/web-infra-dev/rspack): the underlying bundler of Rsbuild.
- 🐹 [Rspress](https://github.com/web-infra-dev/rspress): A fast static site generator based on Rsbuild.
- 🦄 [Modern.js](https://github.com/web-infra-dev/modern.js): A progressive React framework based on Rsbuild.

## Contribution

> New contributors welcome!

Please read the [Contributing Guide](https://github.com/web-infra-dev/rsbuild/blob/main/CONTRIBUTING.md).

## Community

Come and chat with us on [Discord](https://discord.gg/dfJnVWaG)! The Rspack / Rsbuild team and users are active there, and we're always looking for contributions.

## Code of Conduct

This repo has adopted the ByteDance Open Source Code of Conduct. Please check [Code of Conduct](./CODE_OF_CONDUCT.md) for more details.

## Credits

Some implementations of Rsbuild are referenced from the following projects. We would like to express our gratitude to them:

- `plugin-module-scope` and `plugin-file-size`: referenced from [create-react-app](https://github.com/facebook/create-react-app)
- `generateMetaTags` util: referenced from [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin).

## License

Rsbuild is licensed under the [MIT License](./LICENSE).
