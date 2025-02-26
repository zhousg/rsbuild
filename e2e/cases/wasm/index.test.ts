import path, { join } from 'path';
import { expect, test } from '@playwright/test';
import { build, getHrefByEntryName } from '@scripts/shared';

test('should allow to import wasm file', async ({ page }) => {
  const root = join(__dirname, 'wasm-basic');
  const rsbuild = await build({
    cwd: root,
    entry: { main: path.resolve(root, 'src/index.js') },
    runServer: true,
  });
  const files = await rsbuild.unwrapOutputJSON();

  const wasmFile = Object.keys(files).find((file) =>
    file.endsWith('.module.wasm'),
  );

  expect(wasmFile).toBeTruthy();
  expect(wasmFile?.includes('static/wasm/')).toBeTruthy();

  await page.goto(getHrefByEntryName('main', rsbuild.port));

  await page.waitForFunction(() => {
    return Boolean(document.querySelector('#root')?.innerHTML);
  });

  const locator = page.locator('#root');
  await expect(locator).toHaveText('6');

  rsbuild.close();
});

test('should allow to dynamic import wasm file', async () => {
  const root = join(__dirname, 'wasm-async');
  const rsbuild = await build({
    cwd: root,
    entry: { main: path.resolve(root, 'src/index.js') },
  });
  const files = await rsbuild.unwrapOutputJSON();

  const wasmFile = Object.keys(files).find((file) =>
    file.endsWith('.module.wasm'),
  );

  expect(wasmFile).toBeTruthy();
  expect(wasmFile?.includes('static/wasm/')).toBeTruthy();
});

test('should allow to use new URL to get path of wasm file', async ({
  page,
}) => {
  const root = join(__dirname, 'wasm-url');
  const rsbuild = await build({
    cwd: root,
    entry: { main: path.resolve(root, 'src/index.js') },
    runServer: true,
  });
  const files = await rsbuild.unwrapOutputJSON();

  const wasmFile = Object.keys(files).find((file) =>
    file.endsWith('.module.wasm'),
  );

  expect(wasmFile).toBeTruthy();
  expect(wasmFile?.includes('static/wasm/')).toBeTruthy();

  await page.goto(getHrefByEntryName('main', rsbuild.port));

  await page.waitForFunction(() => {
    return Boolean(document.querySelector('#root')?.innerHTML);
  });

  await expect(
    page.evaluate(`document.querySelector('#root').innerHTML`),
  ).resolves.toMatch(/\/static\/wasm\/\w+\.module\.wasm/);

  rsbuild.close();
});
