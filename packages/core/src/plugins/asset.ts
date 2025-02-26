import path from 'path';
import {
  getRegExpForExts,
  getDistPath,
  getFilename,
  chainStaticAssetRule,
} from '@rsbuild/shared';
import type { DefaultRsbuildPlugin } from '@rsbuild/shared';

export const pluginAsset = (
  assetType: 'image' | 'media' | 'font',
  exts: string[],
): DefaultRsbuildPlugin => ({
  name: `plugin-${assetType}`,

  setup(api) {
    api.modifyBundlerChain((chain, { isProd }) => {
      const config = api.getNormalizedConfig();
      const regExp = getRegExpForExts(exts);
      const distDir = getDistPath(config.output, assetType);
      const filename = getFilename(config.output, assetType, isProd);

      const maxSize = config.output.dataUriLimit[assetType];

      const rule = chain.module.rule(assetType).test(regExp);

      chainStaticAssetRule({
        rule,
        maxSize,
        filename: path.posix.join(distDir, filename),
        assetType,
      });
    });
  },
});
