import _ from 'lodash';
import { NormalizedConfig } from '@rsbuild/webpack';
import {
  logger,
  isUsingHMR,
  isBeyondReact17,
  getCoreJsVersion,
  getBrowserslistWithDefault,
  type ModifyChainUtils,
  getDefaultStyledComponentsConfig,
} from '@rsbuild/shared';
import { Extensions } from '@modern-js/swc-plugins';
import { getDefaultSwcConfig } from './plugin';
import {
  ObjPluginSwcOptions,
  OuterExtensions,
  PluginSwcOptions,
  TransformConfig,
} from './types';
import { CORE_JS_DIR_PATH, SWC_HELPERS_DIR_PATH } from './constants';

/**
 * Determine react runtime mode based on react version
 */
export function determinePresetReact(
  root: string,
  pluginConfig: ObjPluginSwcOptions,
) {
  const presetReact =
    pluginConfig.presetReact || (pluginConfig.presetReact = {});

  presetReact.runtime ??= isBeyondReact17(root) ? 'automatic' : 'classic';
}

export function checkUseMinify(
  options: ObjPluginSwcOptions,
  config: NormalizedConfig,
  isProd: boolean,
) {
  return (
    isProd &&
    !config.output.disableMinimize &&
    (options.jsMinify !== false || options.cssMinify !== false)
  );
}

const PLUGIN_ONLY_OPTIONS: (keyof ObjPluginSwcOptions)[] = [
  'presetReact',
  'presetEnv',
  'jsMinify',
  'cssMinify',
  'overrides',
  'test',
  'exclude',
  'include' as unknown as keyof ObjPluginSwcOptions, // include is not in SWC config, but we need it as loader condition
];

export interface FinalizedConfig {
  test?: RegExp;
  include?: RegExp[];
  exclude?: RegExp[];
  swcConfig: ObjPluginSwcOptions;
}

export function removeUselessOptions(
  obj: ObjPluginSwcOptions,
): TransformConfig {
  const output = { ...obj };

  for (const key of PLUGIN_ONLY_OPTIONS) {
    delete output[key];
  }

  return output;
}

export async function finalizeConfig(
  userConfig: PluginSwcOptions,
  rsbuildSetConfig: TransformConfig,
): Promise<FinalizedConfig[]> {
  const isUsingFnOptions = typeof userConfig === 'function';

  const objConfig = isUsingFnOptions ? {} : userConfig;
  const defaultConfig = getDefaultSwcConfig();

  // apply swc default config
  let swcConfig: ObjPluginSwcOptions = _.merge(
    {},
    defaultConfig,
    rsbuildSetConfig,
    objConfig,
  );

  if (isUsingFnOptions) {
    const ret = userConfig(swcConfig, {
      mergeConfig: _.merge,
      setConfig: _.set,
    });

    if (ret) {
      swcConfig = ret;
    }
  }

  // apply overrides
  const overrides = swcConfig.overrides || [];

  const finalized: FinalizedConfig[] = [{ swcConfig }];

  for (const override of overrides) {
    finalized.push({
      test: override.test,
      include: override.include,
      exclude: override.exclude,
      swcConfig: _.merge({}, swcConfig, override),
    });
  }

  return finalized;
}

export async function applyPluginConfig(
  rawOptions: PluginSwcOptions,
  utils: ModifyChainUtils,
  rsbuildConfig: NormalizedConfig,
  rootPath: string,
): Promise<FinalizedConfig[]> {
  const isUsingFnOptions = typeof rawOptions === 'function';
  const { target, isProd } = utils;

  // if using function type config, create an empty config
  // and then invoke function with this config
  const pluginOptions = isUsingFnOptions ? {} : rawOptions;

  determinePresetReact(rootPath, pluginOptions);

  const swc = {
    jsc: {
      transform: {
        react: {
          refresh: isUsingHMR(rsbuildConfig, utils),
        },
      },
    },
    env: pluginOptions.presetEnv || {},
    extensions: { ...pluginOptions.extensions },
    cwd: rootPath,
  } satisfies TransformConfig;

  if (pluginOptions.presetReact) {
    swc.jsc.transform.react = {
      ...swc.jsc.transform.react,
      ...pluginOptions.presetReact,
    };
  }

  const { polyfill } = rsbuildConfig.output;
  if (swc.env.mode === undefined && polyfill !== 'ua' && polyfill !== 'off') {
    swc.env.mode = polyfill;
  }

  if (!swc.env.coreJs) {
    const CORE_JS_PATH = require.resolve('core-js/package.json');
    swc.env.coreJs = getCoreJsVersion(CORE_JS_PATH);
  }

  // If `targets` is not specified manually, we get `browserslist` from project.
  if (!swc.env.targets) {
    swc.env.targets = await getBrowserslistWithDefault(
      rootPath,
      rsbuildConfig,
      target,
    );
  }

  const isSSR = target === 'node';

  // compat builder-plugin-swc extensions.styledComponents params
  if (swc.extensions?.styledComponents) {
    swc.extensions.styledComponents = {
      ...getDefaultStyledComponentsConfig(isProd, isSSR),
      ...(typeof swc.extensions.styledComponents === 'object'
        ? swc.extensions?.styledComponents
        : {}),
    };
  }

  const extensions: Extensions | OuterExtensions = (swc.extensions ??= {});

  if (rsbuildConfig.source?.transformImport) {
    extensions.pluginImport ??= [];
    extensions.pluginImport.push(...rsbuildConfig.source.transformImport);
  }

  if (rsbuildConfig.performance?.transformLodash) {
    extensions.lodash = {
      cwd: rootPath,
      ids: ['lodash', 'lodash-es'],
    };
  }

  extensions.lockCorejsVersion ??= {
    corejs: CORE_JS_DIR_PATH,
    swcHelpers: SWC_HELPERS_DIR_PATH,
  };

  /**
   * SWC can't use latestDecorator in TypeScript file for now
   */
  if (rsbuildConfig.output.enableLatestDecorators) {
    logger.warn('Cannot use latestDecorator in SWC compiler.');
  }

  return await finalizeConfig(rawOptions, swc);
}
