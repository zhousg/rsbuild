import type { ChainIdentifier, ModifyChainUtils } from '@rsbuild/shared';
import type { WebpackChain, WebpackConfig } from './thirdParty';
import type { RuleSetRule, WebpackPluginInstance } from 'webpack';

export type ModifyWebpackChainUtils = ModifyChainUtils & {
  /** @deprecated Use target instead. */
  name: string;
  webpack: typeof import('webpack');
  CHAIN_ID: ChainIdentifier;
  HtmlWebpackPlugin: typeof import('html-webpack-plugin');
};

export type ModifyWebpackConfigUtils = ModifyWebpackChainUtils & {
  addRules: (rules: RuleSetRule | RuleSetRule[]) => void;
  prependPlugins: (
    plugins: WebpackPluginInstance | WebpackPluginInstance[],
  ) => void;
  appendPlugins: (
    plugins: WebpackPluginInstance | WebpackPluginInstance[],
  ) => void;
  removePlugin: (pluginName: string) => void;
  mergeConfig: typeof import('@rsbuild/shared/webpack-merge').merge;
};

export type ModifyWebpackChainFn = (
  chain: WebpackChain,
  utils: ModifyWebpackChainUtils,
) => Promise<void> | void;

export type ModifyWebpackConfigFn = (
  config: WebpackConfig,
  utils: ModifyWebpackConfigUtils,
) => Promise<WebpackConfig | void> | WebpackConfig | void;
