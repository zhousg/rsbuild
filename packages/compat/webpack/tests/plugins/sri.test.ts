import { pluginSRI } from '@/plugins/sri';
import { createStubRsbuild } from '../helper';

describe('plugin-sri', () => {
  it('should apply default sri plugin', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginSRI()],
      rsbuildConfig: {
        security: {
          sri: true,
        },
      },
    });

    const config = await rsbuild.unwrapWebpackConfig();
    expect(config.output?.crossOriginLoading).toBe('anonymous');
  });

  it('should apply sri plugin', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginSRI()],
      rsbuildConfig: {
        security: {
          sri: {
            hashFuncNames: ['sha384'],
            enabled: true,
          },
        },
      },
    });

    const config = await rsbuild.unwrapWebpackConfig();
    expect(config.output?.crossOriginLoading).toBe('anonymous');
  });

  it("should't apply sri plugin", async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginSRI()],
      rsbuildConfig: {},
    });

    const config = await rsbuild.unwrapWebpackConfig();
    expect(config.output?.crossOriginLoading).toBeUndefined();
  });
});
