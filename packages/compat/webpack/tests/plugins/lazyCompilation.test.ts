import { pluginSplitChunks } from '@rsbuild/core/plugins/splitChunks';
import { pluginLazyCompilation } from '@/plugins/lazyCompilation';
import { createStubRsbuild } from '../helper';

describe('plugin-lazy-compilation', () => {
  it('should allow to use lazy compilation', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginLazyCompilation()],
      rsbuildConfig: {
        experiments: {
          lazyCompilation: {
            entries: false,
            imports: true,
          },
        },
      },
    });

    const config = await rsbuild.unwrapWebpackConfig();
    expect(config).toEqual({
      experiments: {
        lazyCompilation: {
          entries: false,
          imports: true,
        },
      },
      optimization: {
        splitChunks: false,
      },
    });
  });

  it('should disable split chunks', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginSplitChunks(), pluginLazyCompilation()],
      rsbuildConfig: {
        experiments: {
          lazyCompilation: true,
        },
      },
    });

    const config = await rsbuild.unwrapWebpackConfig();
    expect(config.optimization?.splitChunks).toEqual(false);
  });

  it('should not apply lazy compilation in production', async () => {
    const { NODE_ENV } = process.env;
    process.env.NODE_ENV = 'production';

    const rsbuild = await createStubRsbuild({
      plugins: [pluginLazyCompilation()],
      rsbuildConfig: {
        experiments: {
          lazyCompilation: true,
        },
      },
    });

    const config = await rsbuild.unwrapWebpackConfig();
    expect(config).toEqual({});

    process.env.NODE_ENV = NODE_ENV;
  });

  it('should not apply lazy compilation for node target', async () => {
    const rsbuild = await createStubRsbuild({
      target: 'node',
      plugins: [pluginLazyCompilation()],
      rsbuildConfig: {
        experiments: {
          lazyCompilation: true,
        },
      },
    });

    const config = await rsbuild.unwrapWebpackConfig();
    expect(config).toEqual({});
  });
});
