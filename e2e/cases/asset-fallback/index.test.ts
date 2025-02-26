import path from 'path';
import { expect, test } from '@playwright/test';
import { build } from '@scripts/shared';

test('should handle unknown modules with fallback rule', async () => {
  const rsbuild = await build({
    cwd: __dirname,
    entry: { index: path.resolve(__dirname, './src/index.js') },
    rsbuildConfig: {
      output: {
        enableAssetFallback: true,
      },
    },
  });
  const files = await rsbuild.unwrapOutputJSON();

  const result = Object.keys(files).find((file) => file.endsWith('.xxx'));

  expect(result).toBeTruthy();
  expect(/\/static\/media\/foo.\w+.xxx/.test(result!)).toBeTruthy();
});
