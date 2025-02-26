import path from 'path';
import { expect, test } from '@playwright/test';
import { build } from '@scripts/shared';
import { webpackOnlyTest } from '@scripts/helper';

test('should build web-worker target correctly', async () => {
  const rsbuild = await build({
    cwd: __dirname,
    entry: { index: path.resolve(__dirname, './src/index.js') },
    target: 'web-worker',
  });
  const files = await rsbuild.unwrapOutputJSON();
  const filenames = Object.keys(files);
  const jsFiles = filenames.filter((item) => item.endsWith('.js'));

  expect(jsFiles.length).toEqual(1);
  expect(jsFiles[0].includes('index')).toBeTruthy();
});

// TODO: needs dynamicImportMode: 'eager',
webpackOnlyTest(
  'should build web-worker target with dynamicImport correctly',
  async () => {
    const rsbuild = await build({
      cwd: __dirname,
      entry: { index: path.resolve(__dirname, './src/index2.js') },
      target: 'web-worker',
    });
    const files = await rsbuild.unwrapOutputJSON();
    const filenames = Object.keys(files);
    const jsFiles = filenames.filter((item) => item.endsWith('.js'));

    expect(jsFiles.length).toEqual(1);
    expect(jsFiles[0].includes('index')).toBeTruthy();
  },
);
