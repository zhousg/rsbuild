import { pluginRem } from '@src/plugins/rem';
import { createStubRsbuild, matchPlugin } from '@rsbuild/test-helper';
import { pluginCss } from '@/plugins/css';
import { pluginLess } from '@/plugins/less';
import { pluginSass } from '@/plugins/sass';

describe('plugin-rem', () => {
  it('should not run rem plugin without config', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss(), pluginRem()],
      rsbuildConfig: {},
    });

    const bundlerConfigs = await rsbuild.initConfigs();
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should not run rem plugin when false', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss(), pluginRem()],
      rsbuildConfig: {
        output: {
          convertToRem: false,
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should run rem plugin with default config', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss(), pluginLess(), pluginSass(), pluginRem()],
      rsbuildConfig: {
        output: {
          convertToRem: true,
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should order plugins and run rem plugin with default config', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginRem(), pluginCss(), pluginLess(), pluginSass()],
      rsbuildConfig: {
        output: {
          convertToRem: true,
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should not run htmlPlugin with enableRuntime is false', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss(), pluginRem()],
      rsbuildConfig: {
        output: {
          convertToRem: {
            enableRuntime: false,
          },
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(bundlerConfigs[0].plugins?.length || 0).toBe(0);
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should run rem plugin with custom config', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss(), pluginRem()],
      rsbuildConfig: {
        output: {
          convertToRem: {
            rootFontSize: 30,
            pxtorem: {
              propList: ['font-size'],
            },
          },
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should not run rem plugin when target is node', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss(), pluginRem()],
      rsbuildConfig: {
        output: {
          convertToRem: true,
        },
      },
      target: ['node'],
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(
      matchPlugin(bundlerConfigs[0], 'AutoSetRootFontSizePlugin'),
    ).toBeFalsy();
  });

  it('should not run rem plugin when target is web-worker', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss(), pluginRem()],
      rsbuildConfig: {
        output: {
          convertToRem: true,
        },
      },
      target: ['web-worker'],
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(
      matchPlugin(bundlerConfigs[0], 'AutoSetRootFontSizePlugin'),
    ).toBeFalsy();
  });
});
