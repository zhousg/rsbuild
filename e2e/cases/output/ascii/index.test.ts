import path from 'path';
import { expect, test } from '@playwright/test';
import { build, getHrefByEntryName } from '@scripts/shared';

test('output.charset default (ascii)', async ({ page }) => {
  const rsbuild = await build({
    cwd: __dirname,
    entry: {
      index: path.resolve(__dirname, './src/index.js'),
    },
    runServer: true,
  });

  await page.goto(getHrefByEntryName('index', rsbuild.port));
  expect(await page.evaluate('window.a')).toBe('你好 world!');

  const files = await rsbuild.unwrapOutputJSON();

  const [, content] = Object.entries(files).find(
    ([name]) => name.endsWith('.js') && name.includes('static/js/index'),
  )!;

  // in rspack is: \\u4f60\\u597D world!
  expect(
    content.toLocaleLowerCase().includes('\\u4f60\\u597d world!'),
  ).toBeTruthy();

  rsbuild.close();
});

test('output.charset (utf8)', async ({ page }) => {
  const rsbuild = await build({
    cwd: __dirname,
    entry: {
      index: path.resolve(__dirname, './src/index.js'),
    },
    rsbuildConfig: {
      output: {
        charset: 'utf8',
      },
    },
    runServer: true,
  });

  await page.goto(getHrefByEntryName('index', rsbuild.port));
  expect(await page.evaluate('window.a')).toBe('你好 world!');

  const files = await rsbuild.unwrapOutputJSON();

  const [, content] = Object.entries(files).find(
    ([name]) => name.endsWith('.js') && name.includes('static/js/index'),
  )!;

  expect(content.includes('你好 world!')).toBeTruthy();

  rsbuild.close();
});
