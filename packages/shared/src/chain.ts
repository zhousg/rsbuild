import { ensureArray } from './utils';
import { debug } from './logger';
import {
  Context,
  CreateAsyncHook,
  ModifyBundlerChainUtils,
  ModifyBundlerChainFn,
  BundlerChain,
  SharedRsbuildConfig,
} from './types';

export async function getBundlerChain() {
  const { default: WebpackChain } = await import('webpack-chain');

  const bundlerChain = new WebpackChain();

  return bundlerChain as unknown as BundlerChain;
}

export async function modifyBundlerChain(
  context: Context & {
    hooks: {
      modifyBundlerChainHook: CreateAsyncHook<ModifyBundlerChainFn>;
    };
    config: Readonly<SharedRsbuildConfig>;
  },
  utils: ModifyBundlerChainUtils,
) {
  debug('modify bundler chain');

  const bundlerChain = await getBundlerChain();

  const [modifiedBundlerChain] =
    await context.hooks.modifyBundlerChainHook.call(bundlerChain, utils);

  if (context.config.tools?.bundlerChain) {
    ensureArray(context.config.tools.bundlerChain).forEach((item) => {
      item(modifiedBundlerChain, utils);
    });
  }

  debug('modify bundler chain done');

  return modifiedBundlerChain;
}

export const CHAIN_ID = {
  /** Predefined rules */
  RULE: {
    /** Rule for .mjs */
    MJS: 'mjs',
    /** Rule for fonts */
    FONT: 'font',
    /** Rule for images */
    IMAGE: 'image',
    /** Rule for media */
    MEDIA: 'media',
    /** Rule for js */
    JS: 'js',
    /** Rule for data uri encoded javascript */
    JS_DATA_URI: 'js-data-uri',
    /** Rule for ts */
    TS: 'ts',
    /** Rule for css */
    CSS: 'css',
    /** Rule for less */
    LESS: 'less',
    /** Rule for sass */
    SASS: 'sass',
    /** Rule for stylus */
    STYLUS: 'stylus',
    /** Rule for svg */
    SVG: 'svg',
    /** Rule for pug */
    PUG: 'pug',
    /** Rule for Vue */
    VUE: 'vue',
    /** Rule for toml */
    TOML: 'toml',
    /** Rule for yaml */
    YAML: 'yaml',
    /** Rule for wasm */
    WASM: 'wasm',
    /** Rule for node */
    NODE: 'node',
  },
  /** Predefined rule groups */
  ONE_OF: {
    SVG: 'svg',
    SVG_URL: 'svg-url',
    SVG_ASSET: 'svg-asset',
    SVG_INLINE: 'svg-inline',
  },
  /** Predefined loaders */
  USE: {
    /** ts-loader */
    TS: 'ts',
    /** css-loader */
    CSS: 'css',
    /** sass-loader */
    SASS: 'sass',
    /** less-loader */
    LESS: 'less',
    /** stylus-loader */
    STYLUS: 'stylus',
    /** url-loader */
    URL: 'url',
    /** pug-loader */
    PUG: 'pug',
    /** vue-loader */
    VUE: 'vue',
    /** file-loader */
    FILE: 'file',
    /** @svgr/webpack */
    SVGR: 'svgr',
    /** yaml-loader */
    YAML: 'yaml',
    /** toml-loader */
    TOML: 'toml',
    /** html-loader */
    HTML: 'html',
    /** node-loader */
    NODE: 'html',
    /** babel-loader */
    BABEL: 'babel',
    /** esbuild-loader */
    ESBUILD: 'esbuild',
    /** swc-loader */
    SWC: 'swc',
    /** style-loader */
    STYLE: 'style-loader',
    /** postcss-loader */
    POSTCSS: 'postcss',
    /** ignore-css-loader */
    IGNORE_CSS: 'ignore-css',
    /** css-modules-typescript-loader */
    CSS_MODULES_TS: 'css-modules-typescript',
    /** mini-css-extract-plugin.loader */
    MINI_CSS_EXTRACT: 'mini-css-extract',
    /** resolve-url-loader */
    RESOLVE_URL_LOADER_FOR_SASS: 'resolve-url-loader',
    /** plugin-image-compress.loader */
    IMAGE_COMPRESS: 'image-compress',
    /** plugin-image-compress svgo-loader */
    SVGO: 'svgo',
  },
  /** Predefined plugins */
  PLUGIN: {
    /** HotModuleReplacementPlugin */
    HMR: 'hmr',
    /** CopyWebpackPlugin */
    COPY: 'copy',
    /** HtmlWebpackPlugin */
    HTML: 'html',
    /** DefinePlugin */
    DEFINE: 'define',
    /** IgnorePlugin */
    IGNORE: 'ignore',
    /** BannerPlugin */
    BANNER: 'banner',
    /** Webpackbar */
    PROGRESS: 'progress',
    /** Inspector */
    INSPECTOR: 'inspector',
    /** AppIconPlugin */
    APP_ICON: 'app-icon',
    /** FaviconUrlPlugin */
    FAVICON_URL: 'favicon-url',
    /** WebpackManifestPlugin */
    MANIFEST: 'webpack-manifest',
    /** ForkTsCheckerWebpackPlugin */
    TS_CHECKER: 'ts-checker',
    /** InlineChunkHtmlPlugin */
    INLINE_HTML: 'inline-html',
    /** WebpackBundleAnalyzer */
    BUNDLE_ANALYZER: 'bundle-analyze',
    /** HtmlTagsPlugin */
    HTML_TAGS: 'html-tags',
    /** HtmlNoncePlugin */
    HTML_NONCE: 'html-nonce',
    /** HtmlCrossOriginPlugin */
    HTML_CROSS_ORIGIN: 'html-cross-origin',
    /** htmlPreconnectPlugin */
    HTML_PRECONNECT: 'html-preconnect-plugin',
    /** htmlDnsPrefetchPlugin */
    HTML_DNS_PREFETCH: 'html-dns-prefetch-plugin',
    /** htmlPrefetchPlugin */
    HTML_PREFETCH: 'html-prefetch-plugin',
    /** htmlPreloadPlugin */
    HTML_PRELOAD: 'html-preload-plugin',
    /** MiniCssExtractPlugin */
    MINI_CSS_EXTRACT: 'mini-css-extract',
    /** VueLoaderPlugin */
    VUE_LOADER_PLUGIN: 'vue-loader-plugin',
    /** ReactFastRefreshPlugin */
    REACT_FAST_REFRESH: 'react-fast-refresh',
    /** ProvidePlugin for node polyfill */
    NODE_POLYFILL_PROVIDE: 'node-polyfill-provide',
    /** WebpackSRIPlugin */
    SUBRESOURCE_INTEGRITY: 'subresource-integrity',
    /** WebpackAssetsRetryPlugin */
    ASSETS_RETRY: 'assets-retry',
    /** AutoSetRootFontSizePlugin */
    AUTO_SET_ROOT_SIZE: 'auto-set-root-size',
    /** HtmlAsyncChunkPlugin */
    HTML_ASYNC_CHUNK: 'html-async-chunk',
  },
  /** Predefined minimizers */
  MINIMIZER: {
    /** TerserWebpackPlugin */
    JS: 'js',
    /** CssMinimizerWebpackPlugin */
    CSS: 'css',
    /** ESBuildPlugin */
    ESBUILD: 'js-css',
    /** SWCPlugin */
    SWC: 'swc',
  },
  /** Predefined resolve plugins */
  RESOLVE_PLUGIN: {
    /** ModuleScopePlugin */
    MODULE_SCOPE: 'module-scope',
    /** TsConfigPathsPlugin */
    TS_CONFIG_PATHS: 'ts-config-paths',
  },
} as const;

export type ChainIdentifier = typeof CHAIN_ID;
