import { RsbuildPlugin } from '../types';
import { awaitableGetter, Plugins } from '@rsbuild/shared';

export const applyMinimalPlugins = (plugins: Plugins) =>
  awaitableGetter<RsbuildPlugin>([
    import('../plugins/basic').then((m) => m.pluginBasic()),
    plugins.entry?.(),
    plugins.cache?.(),
    plugins.target?.(),
    import('../plugins/output').then((m) => m.pluginOutput()),
    plugins.devtool(),
    import('../plugins/resolve').then((m) => m.pluginResolve()),
  ]);

export const applyBasicPlugins = (plugins: Plugins) =>
  awaitableGetter<RsbuildPlugin>([
    ...applyMinimalPlugins(plugins).promises,
    import('../plugins/copy').then((m) => m.pluginCopy()),
    plugins.html(),
    plugins.image(),
    plugins.define(),
    import('../plugins/tsLoader').then((m) => m.pluginTsLoader()),
    import('../plugins/babel').then((m) => m.pluginBabel()),
    import('../plugins/css').then((m) => m.pluginCss()),
    import('../plugins/sass').then((m) => m.pluginSass()),
    import('../plugins/less').then((m) => m.pluginLess()),
  ]);

export const applyDefaultPlugins = (plugins: Plugins) =>
  awaitableGetter<RsbuildPlugin>([
    ...applyMinimalPlugins(plugins).promises,
    plugins.fileSize?.(),
    plugins.cleanOutput?.(),
    import('../plugins/hmr').then((m) => m.pluginHMR()),
    plugins.svg(),
    import('../plugins/pug').then((m) => m.pluginPug()),
    plugins.checkSyntax(),
    import('../plugins/copy').then((m) => m.pluginCopy()),
    plugins.font(),
    plugins.image(),
    plugins.media(),
    plugins.html(),
    plugins.wasm(),
    plugins.moment(),
    plugins.nodeAddons(),
    plugins.define(),
    import('../plugins/progress').then((m) => m.pluginProgress()),
    import('../plugins/minimize').then((m) => m.pluginMinimize()),
    import('../plugins/manifest').then((m) => m.pluginManifest()),
    import('../plugins/moduleScopes').then((m) => m.pluginModuleScopes()),
    import('../plugins/tsLoader').then((m) => m.pluginTsLoader()),
    import('../plugins/babel').then((m) => m.pluginBabel()),
    import('../plugins/css').then((m) => m.pluginCss()),
    import('../plugins/sass').then((m) => m.pluginSass()),
    import('../plugins/less').then((m) => m.pluginLess()),
    plugins.rem(),
    plugins.bundleAnalyzer(),
    plugins.toml(),
    plugins.yaml(),
    plugins.splitChunks(),
    import('../plugins/sri').then((m) => m.pluginSRI()),
    plugins.startUrl?.(),
    plugins.inlineChunk(),
    plugins.assetsRetry(),
    plugins.externals(),
    plugins.performance(),
    import('../plugins/lazyCompilation').then((m) => m.pluginLazyCompilation()),
    plugins.networkPerformance(),
    plugins.preloadOrPrefetch(),
    import('../plugins/fallback').then((m) => m.pluginFallback()), // fallback should be the last plugin
  ]);
