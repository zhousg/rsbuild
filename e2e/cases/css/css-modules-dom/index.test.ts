import { join, resolve } from 'path';
import { fs } from '@rsbuild/shared/fs-extra';
import { build, getHrefByEntryName } from '@scripts/shared';
import { expect, test } from '@playwright/test';
import { pluginReact } from '@rsbuild/plugin-react';

const fixtures = resolve(__dirname);

test('enableCssModuleTSDeclaration', async () => {
  fs.removeSync(join(fixtures, 'src/App.module.less.d.ts'));
  fs.removeSync(join(fixtures, 'src/App.module.scss.d.ts'));

  await build({
    cwd: fixtures,
    entry: {
      main: join(fixtures, 'src/index.ts'),
    },
    plugins: [pluginReact()],
    rsbuildConfig: {
      output: {
        enableCssModuleTSDeclaration: true,
      },
    },
  });

  expect(
    fs.existsSync(join(fixtures, 'src/App.module.less.d.ts')),
  ).toBeTruthy();

  expect(
    fs
      .readFileSync(join(fixtures, 'src/App.module.less.d.ts'), {
        encoding: 'utf-8',
      })
      .includes(`title: string;`),
  ).toBeTruthy();

  expect(
    fs.existsSync(join(fixtures, 'src/App.module.scss.d.ts')),
  ).toBeTruthy();

  expect(
    fs
      .readFileSync(join(fixtures, 'src/App.module.scss.d.ts'), {
        encoding: 'utf-8',
      })
      .includes(`header: string;`),
  ).toBeTruthy();
});

test('disableCssExtract', async ({ page }) => {
  const rsbuild = await build({
    cwd: fixtures,
    entry: {
      main: join(fixtures, 'src/index.ts'),
    },
    runServer: true,
    plugins: [pluginReact()],
    rsbuildConfig: {
      output: {
        disableCssExtract: true,
      },
    },
  });

  await page.goto(getHrefByEntryName('main', rsbuild.port));

  // disableCssExtract worked
  const files = await rsbuild.unwrapOutputJSON();
  const cssFiles = Object.keys(files).filter((file) => file.endsWith('.css'));

  expect(cssFiles.length).toBe(0);

  // scss worked
  const header = page.locator('#header');
  await expect(header).toHaveCSS('font-size', '20px');

  // less worked
  const title = page.locator('#title');
  await expect(title).toHaveCSS('font-size', '20px');

  rsbuild.close();
});
