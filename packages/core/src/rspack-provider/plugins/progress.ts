import { TARGET_ID_MAP } from '@rsbuild/shared';
import type { RsbuildPlugin } from '../types';

export const pluginProgress = (): RsbuildPlugin => ({
  name: 'plugin-progress',
  setup(api) {
    api.modifyBundlerChain(async (chain, { target, CHAIN_ID }) => {
      const config = api.getNormalizedConfig();
      const options = config.dev.progressBar;

      if (!options) {
        return;
      }

      const { ProgressPlugin } = await import('@rspack/core');

      chain.plugin(CHAIN_ID.PLUGIN.PROGRESS).use(ProgressPlugin, [
        {
          prefix: TARGET_ID_MAP[target],
          ...(options === true ? {} : options),
        },
      ]);
    });
  },
});
