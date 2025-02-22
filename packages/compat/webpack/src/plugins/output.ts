import { posix } from 'path';
import { CSSExtractOptions } from '../types/thirdParty/css';
import {
  getDistPath,
  getFilename,
  isUseCssExtract,
  applyOutputPlugin,
  mergeChainedOptions,
} from '@rsbuild/shared';
import type { RsbuildPlugin } from '../types';

export const pluginOutput = (): RsbuildPlugin => ({
  name: 'plugin-output',

  setup(api) {
    applyOutputPlugin(api);

    api.modifyWebpackChain(async (chain, { isProd, target, CHAIN_ID }) => {
      const config = api.getNormalizedConfig();

      const cssPath = getDistPath(config.output, 'css');

      // css output
      if (isUseCssExtract(config, target)) {
        const { default: MiniCssExtractPlugin } = await import(
          'mini-css-extract-plugin'
        );
        const extractPluginOptions = mergeChainedOptions(
          {},
          (config.tools.cssExtract as CSSExtractOptions)?.pluginOptions || {},
        );

        const cssFilename = getFilename(config.output, 'css', isProd);

        chain
          .plugin(CHAIN_ID.PLUGIN.MINI_CSS_EXTRACT)
          .use(MiniCssExtractPlugin, [
            {
              filename: posix.join(cssPath, cssFilename),
              chunkFilename: posix.join(cssPath, `async/${cssFilename}`),
              ignoreOrder: true,
              ...extractPluginOptions,
            },
          ]);
      }
    });
  },
});
