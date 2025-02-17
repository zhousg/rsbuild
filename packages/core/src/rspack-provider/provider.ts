import {
  startProdServer,
  pickRsbuildConfig,
  createPublicContext,
  type RsbuildProvider,
} from '@rsbuild/shared';
import { chalk } from '@rsbuild/shared/chalk';
import { createContext } from './core/createContext';
import { initConfigs } from './core/initConfigs';
import { getPluginAPI } from './core/initPlugins';
import { applyDefaultPlugins } from './shared/plugin';
import {
  isSatisfyRspackMinimumVersion,
  supportedRspackMinimumVersion,
} from './shared/rspackVersion';
import type {
  Compiler,
  RspackConfig,
  RsbuildConfig,
  NormalizedConfig,
  MultiCompiler,
} from './types';

export type RspackProvider = RsbuildProvider<
  RsbuildConfig,
  RspackConfig,
  NormalizedConfig,
  Compiler | MultiCompiler
>;

export function rspackProvider({
  rsbuildConfig: originalRsbuildConfig,
}: {
  rsbuildConfig: RsbuildConfig;
}): RspackProvider {
  const rsbuildConfig = pickRsbuildConfig(originalRsbuildConfig);

  return async ({ pluginStore, rsbuildOptions, plugins }) => {
    if (!(await isSatisfyRspackMinimumVersion())) {
      throw new Error(
        `The current Rspack version does not meet the requirements, the minimum supported version of Rspack is ${chalk.green(
          supportedRspackMinimumVersion,
        )}`,
      );
    }

    const context = await createContext(rsbuildOptions, rsbuildConfig);
    const pluginAPI = getPluginAPI({ context, pluginStore });

    context.pluginAPI = pluginAPI;

    return {
      bundler: 'rspack',

      pluginAPI,

      publicContext: createPublicContext(context),

      async applyDefaultPlugins() {
        pluginStore.addPlugins(await applyDefaultPlugins(plugins));
      },

      async createCompiler() {
        const { createCompiler } = await import('./core/createCompiler');
        const { rspackConfigs } = await initConfigs({
          context,
          pluginStore,
          rsbuildOptions,
        });

        // todo: compiler 类型定义
        return createCompiler({
          context,
          rspackConfigs,
        }) as any;
      },

      async startDevServer(options) {
        const { startDevServer } = await import('./core/startDevServer');
        return startDevServer(
          { context, pluginStore, rsbuildOptions },
          options,
        );
      },

      async preview() {
        return startProdServer(context, context.config);
      },

      async build(options) {
        const { build: buildImpl, rspackBuild } = await import('./core/build');
        return buildImpl(
          { context, pluginStore, rsbuildOptions },
          options,
          rspackBuild,
        );
      },

      async initConfigs() {
        const { rspackConfigs } = await initConfigs({
          context,
          pluginStore,
          rsbuildOptions,
        });
        return rspackConfigs;
      },

      async inspectConfig(inspectOptions) {
        const { inspectConfig } = await import('./core/inspectConfig');
        return inspectConfig({
          context,
          pluginStore,
          rsbuildOptions,
          inspectOptions,
        });
      },
    };
  };
}
