import { createStubRsbuild } from '@rsbuild/test-helper';
import { pluginCss } from '@/plugins/css';
import { pluginLess } from '@/plugins/less';
import { pluginSass } from '@/plugins/sass';

describe('plugin-css', () => {
  it('should override browserslist of autoprefixer when using output.overrideBrowserslist config', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss()],
      rsbuildConfig: {
        output: {
          overrideBrowserslist: ['Chrome 80'],
        },
      },
    });
    const bundlerConfigs = await rsbuild.initConfigs();
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should disable source map when output.disableSourceMap is true', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss()],
      rsbuildConfig: {
        output: {
          disableSourceMap: true,
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(JSON.stringify(bundlerConfigs[0])).toContain('"sourceMap":false');
  });

  it('should disable source map when output.disableSourceMap is css: true', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss()],
      rsbuildConfig: {
        output: {
          disableSourceMap: {
            css: true,
          },
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(JSON.stringify(bundlerConfigs[0])).toContain('"sourceMap":false');
  });

  it('should disable source map in production by default', async () => {
    const { NODE_ENV } = process.env;
    process.env.NODE_ENV = 'production';

    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss()],
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(JSON.stringify(bundlerConfigs[0])).toContain('"sourceMap":false');

    process.env.NODE_ENV = NODE_ENV;
  });

  it('should allow to custom cssModules.localIdentName', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss()],
      rsbuildConfig: {
        output: {
          cssModules: {
            localIdentName: '[hash]',
          },
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(JSON.stringify(bundlerConfigs[0])).toContain(
      '"localIdentName":"[hash]"',
    );
  });

  it('should allow to custom cssModuleLocalIdentName', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss()],
      rsbuildConfig: {
        output: {
          cssModuleLocalIdentName: '[hash]',
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(JSON.stringify(bundlerConfigs[0])).toContain(
      '"localIdentName":"[hash]"',
    );
  });

  it('should ignore hashDigest when custom cssModuleLocalIdentName', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss()],
      rsbuildConfig: {
        output: {
          cssModuleLocalIdentName: '[hash:base64:5]',
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(JSON.stringify(bundlerConfigs[0])).toContain(
      '"localIdentName":"[hash:5]"',
    );
  });

  it('should use custom cssModules rule when using output.cssModules config', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss()],
      rsbuildConfig: {
        output: {
          cssModules: {
            auto: (resourcePath) => resourcePath.includes('.module.'),
          },
        },
      },
    });
    const bundlerConfigs = await rsbuild.initConfigs();
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should apply custom css-modules-typescript-loader when enableCssModuleTSDeclarationg', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss()],
      rsbuildConfig: {
        output: {
          enableCssModuleTSDeclaration: true,
        },
      },
    });
    const bundlerConfigs = await rsbuild.initConfigs();
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });
});

describe('plugin-css disableCssExtract', () => {
  it('should use css-loader + style-loader when disableCssExtract is true', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss()],
      rsbuildConfig: {
        output: {
          disableCssExtract: true,
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should apply ignoreCssLoader when disableCssExtract is true and target is node', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginCss()],
      target: 'node',
      rsbuildConfig: {
        output: {
          disableCssExtract: true,
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(bundlerConfigs[0]).toMatchSnapshot();
  });
});

describe('plugin-less', () => {
  it('should add less-loader', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginLess()],
      rsbuildConfig: {
        tools: {
          less: {},
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should add less-loader and css-loader when disableCssExtract', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginLess()],
      rsbuildConfig: {
        output: {
          disableCssExtract: true,
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should add less-loader with tools.less', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginLess()],
      rsbuildConfig: {
        tools: {
          less: {
            lessOptions: {
              javascriptEnabled: false,
            },
          },
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should add less-loader with excludes', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginLess()],
      rsbuildConfig: {
        tools: {
          less(config, { addExcludes }) {
            addExcludes(/node_modules/);
          },
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });
});

describe('plugin-sass', () => {
  it('should add sass-loader', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginSass()],
      rsbuildConfig: {
        tools: {},
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should add sass-loader and css-loader when disableCssExtract', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginSass()],
      rsbuildConfig: {
        output: {
          disableCssExtract: true,
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });

  it('should add sass-loader with excludes', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginSass()],
      rsbuildConfig: {
        tools: {
          sass(config, { addExcludes }) {
            addExcludes(/node_modules/);
          },
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();
    expect(bundlerConfigs[0]).toMatchSnapshot();
  });
});
