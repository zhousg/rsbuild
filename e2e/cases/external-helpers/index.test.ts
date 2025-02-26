import path from 'path';
import { build } from '@scripts/shared';
import { providerType } from '@scripts/helper';
import { expect, test } from '@playwright/test';
import { pluginSwc } from '@rsbuild/plugin-swc';

test('should externalHelpers by default', async () => {
  const rsbuild = await build({
    cwd: __dirname,
    entry: { index: path.resolve(__dirname, './src/main.ts') },
    plugins: providerType === 'rspack' ? [] : [pluginSwc()],
  });
  const files = await rsbuild.unwrapOutputJSON(false);

  const content =
    files[
      Object.keys(files).find(
        (file) => file.includes('static/js') && file.endsWith('.js.map'),
      )!
    ];

  expect(content).toContain('@swc/helpers');
});
