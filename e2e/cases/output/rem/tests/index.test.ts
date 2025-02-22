import { join, resolve } from 'path';
import { expect, test } from '@playwright/test';
import { build, getHrefByEntryName } from '@scripts/shared';
import { pluginReact } from '@rsbuild/plugin-react';

const fixtures = resolve(__dirname, '../');

test('rem default (disable)', async ({ page }) => {
  const rsbuild = await build({
    cwd: fixtures,
    entry: {
      main: join(fixtures, 'src/index.ts'),
    },
    plugins: [pluginReact()],
    runServer: true,
  });
  await page.goto(getHrefByEntryName('main', rsbuild.port));

  const title = page.locator('#title');
  await expect(title).toHaveCSS('font-size', '20px');

  const description = page.locator('#description');
  await expect(description).toHaveCSS('font-size', '16px');

  rsbuild.close();
});

test('rem enable', async ({ page }) => {
  // convert to rem
  const rsbuild = await build({
    cwd: fixtures,
    entry: {
      main: join(fixtures, 'src/index.ts'),
    },
    runServer: true,
    plugins: [pluginReact()],
    rsbuildConfig: {
      output: {
        convertToRem: true,
      },
    },
  });

  await page.goto(getHrefByEntryName('main', rsbuild.port));

  const root = page.locator('html');
  await expect(root).toHaveCSS('font-size', '64px');

  // less convert pxToRem
  const title = page.locator('#title');
  await expect(title).toHaveCSS('font-size', '25.6px');

  // scss convert pxToRem
  const header = page.locator('#header');
  await expect(header).toHaveCSS('font-size', '25.6px');

  // css convert pxToRem
  const description = page.locator('#description');
  await expect(description).toHaveCSS('font-size', '20.48px');

  rsbuild.close();
});

test('should inline runtime code to html by default', async () => {
  const rsbuild = await build({
    cwd: fixtures,
    entry: { index: join(fixtures, 'src/index.ts') },
    plugins: [pluginReact()],
    rsbuildConfig: {
      output: {
        convertToRem: {},
      },
    },
  });
  const files = await rsbuild.unwrapOutputJSON();
  const htmlFile = Object.keys(files).find((file) => file.endsWith('.html'));

  expect(htmlFile).toBeTruthy();
  expect(files[htmlFile!].includes('function setRootPixel')).toBeTruthy();
});

test('should extract runtime code when inlineRuntime is false', async () => {
  const rsbuild = await build({
    cwd: fixtures,
    entry: { index: join(fixtures, 'src/index.ts') },
    plugins: [pluginReact()],
    rsbuildConfig: {
      output: {
        convertToRem: {
          inlineRuntime: false,
        },
      },
    },
  });
  const files = await rsbuild.unwrapOutputJSON();

  const htmlFile = Object.keys(files).find((file) => file.endsWith('.html'));
  const retryFile = Object.keys(files).find(
    (file) => file.includes('/convert-rem') && file.endsWith('.js'),
  );

  expect(htmlFile).toBeTruthy();
  expect(retryFile).toBeTruthy();
  expect(files[htmlFile!].includes('function setRootPixel')).toBeFalsy();
});
