import { join, resolve } from 'path';
import { expect, test } from '@playwright/test';
import { build, getHrefByEntryName } from '@scripts/shared';
import { pluginReact } from '@rsbuild/plugin-react';

const fixtures = resolve(__dirname, '../');

test('pug', async ({ page }) => {
  const rsbuild = await build({
    cwd: fixtures,
    entry: {
      main: join(fixtures, 'src/index.ts'),
    },
    runServer: true,
    plugins: [pluginReact()],
    rsbuildConfig: {
      html: {
        template: './static/index.pug',
      },
      tools: {
        pug: true,
      },
    },
  });

  await page.goto(getHrefByEntryName('main', rsbuild.port));

  const testPug = page.locator('#test-pug');
  await expect(testPug).toHaveText('Pug source code!');

  const testEl = page.locator('#test');
  await expect(testEl).toHaveText('Hello Rsbuild!');

  rsbuild.close();
});
