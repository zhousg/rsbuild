import path from 'path';
import { expect, test } from '@playwright/test';
import { build } from '@scripts/shared';

test('should apply defer by default', async () => {
  const rsbuild = await build({
    cwd: __dirname,
    entry: { index: path.resolve(__dirname, './src/index.js') },
  });
  const files = await rsbuild.unwrapOutputJSON();
  const html =
    files[Object.keys(files).find((file) => file.endsWith('index.html'))!];

  expect(html).toContain('<script defer="defer" src="');
});

test('should remove defer when scriptLoading is "blocking"', async () => {
  const rsbuild = await build({
    cwd: __dirname,
    entry: { index: path.resolve(__dirname, './src/index.js') },
    rsbuildConfig: {
      html: {
        scriptLoading: 'blocking',
      },
    },
  });
  const files = await rsbuild.unwrapOutputJSON();
  const html =
    files[Object.keys(files).find((file) => file.endsWith('index.html'))!];

  expect(html).toContain('<script src="');
});

test('should allow to set scriptLoading to "module"', async () => {
  const rsbuild = await build({
    cwd: __dirname,
    entry: { index: path.resolve(__dirname, './src/index.js') },
    rsbuildConfig: {
      html: {
        scriptLoading: 'module',
      },
    },
  });
  const files = await rsbuild.unwrapOutputJSON();
  const html =
    files[Object.keys(files).find((file) => file.endsWith('index.html'))!];

  expect(html).toContain('<script type="module" src="');
});
