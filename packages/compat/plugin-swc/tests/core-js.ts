import { transformSync } from '../src/binding';

describe('run code', () => {
  const { code } = transformSync(
    {
      env: {
        targets: 'ie 9',
        mode: 'entry',
      },
    },
    'test.js',
    'import "core-js"',
  );

  try {
    eval(code);
  } catch (e) {}
});
