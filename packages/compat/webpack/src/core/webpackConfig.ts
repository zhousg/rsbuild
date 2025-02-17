import {
  debug,
  CHAIN_ID,
  ensureArray,
  modifyBundlerChain,
  mergeChainedOptions,
  type NodeEnv,
  type WebpackChain,
  type RsbuildTarget,
} from '@rsbuild/shared';
import { castArray } from 'lodash';
import { getCompiledPath } from '../shared';
import type { RuleSetRule, WebpackPluginInstance } from 'webpack';

import type {
  Context,
  WebpackConfig,
  ModifyWebpackChainUtils,
  ModifyWebpackConfigUtils,
} from '../types';

async function modifyWebpackChain(
  context: Context,
  utils: ModifyWebpackChainUtils,
  chain: WebpackChain,
) {
  debug('modify webpack chain');

  const [modifiedChain] = await context.hooks.modifyWebpackChainHook.call(
    chain,
    utils,
  );

  if (context.config.tools?.webpackChain) {
    ensureArray(context.config.tools.webpackChain).forEach((item) => {
      item(modifiedChain, utils);
    });
  }

  debug('modify webpack chain done');

  return modifiedChain;
}

async function modifyWebpackConfig(
  context: Context,
  webpackConfig: WebpackConfig,
  utils: ModifyWebpackConfigUtils,
) {
  debug('modify webpack config');
  let [modifiedConfig] = await context.hooks.modifyWebpackConfigHook.call(
    webpackConfig,
    utils,
  );

  if (context.config.tools?.webpack) {
    modifiedConfig = mergeChainedOptions(
      modifiedConfig,
      context.config.tools.webpack,
      utils,
      utils.mergeConfig,
    );
  }

  debug('modify webpack config done');
  return modifiedConfig;
}

async function getChainUtils(
  target: RsbuildTarget,
): Promise<ModifyWebpackChainUtils> {
  const { default: webpack } = await import('webpack');
  const { default: HtmlWebpackPlugin } = await import('html-webpack-plugin');
  const nodeEnv = process.env.NODE_ENV as NodeEnv;

  const nameMap = {
    web: 'client',
    node: 'server',
    'web-worker': 'web-worker',
    'service-worker': 'service-worker',
  };

  return {
    env: nodeEnv,
    name: nameMap[target] || '',
    target,
    webpack,
    isProd: nodeEnv === 'production',
    isServer: target === 'node',
    isServiceWorker: target === 'service-worker',
    isWebWorker: target === 'web-worker',
    CHAIN_ID,
    getCompiledPath,
    HtmlWebpackPlugin,
    HtmlPlugin: HtmlWebpackPlugin,
  };
}

async function getConfigUtils(
  config: WebpackConfig,
  chainUtils: ModifyWebpackChainUtils,
): Promise<ModifyWebpackConfigUtils> {
  const { merge } = await import('@rsbuild/shared/webpack-merge');

  return {
    ...chainUtils,

    mergeConfig: merge,

    addRules(rules: RuleSetRule | RuleSetRule[]) {
      const ruleArr = castArray(rules);
      if (!config.module) {
        config.module = {};
      }
      if (!config.module.rules) {
        config.module.rules = [];
      }
      config.module.rules.unshift(...ruleArr);
    },

    prependPlugins(plugins: WebpackPluginInstance | WebpackPluginInstance[]) {
      const pluginArr = castArray(plugins);
      if (!config.plugins) {
        config.plugins = [];
      }
      config.plugins.unshift(...pluginArr);
    },

    appendPlugins(plugins: WebpackPluginInstance | WebpackPluginInstance[]) {
      const pluginArr = castArray(plugins);
      if (!config.plugins) {
        config.plugins = [];
      }
      config.plugins.push(...pluginArr);
    },

    removePlugin(pluginName: string) {
      if (config.plugins) {
        config.plugins = config.plugins.filter(
          (item) => item?.constructor.name !== pluginName,
        );
      }
    },
  };
}

export async function generateWebpackConfig({
  target,
  context,
}: {
  target: RsbuildTarget;
  context: Context;
}) {
  const chainUtils = await getChainUtils(target);
  const { BannerPlugin, DefinePlugin, ProvidePlugin } = await import('webpack');

  const bundlerChain = await modifyBundlerChain(context, {
    ...chainUtils,
    bundler: {
      BannerPlugin,
      DefinePlugin,
      ProvidePlugin,
    },
  });

  const chain = await modifyWebpackChain(
    context,
    chainUtils,
    // module rules not support merge
    // need a special rule merge or use bundlerChain as WebpackChain
    bundlerChain as WebpackChain,
  );

  let webpackConfig = chain.toConfig();

  webpackConfig = await modifyWebpackConfig(
    context,
    webpackConfig,
    await getConfigUtils(webpackConfig, chainUtils),
  );

  return webpackConfig;
}
