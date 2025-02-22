import {
  validateRsbuildConfig,
  sharedSecurityConfigSchema,
} from '../src/schema';

describe('validateRsbuildConfig', () => {
  it('test custom error', async () => {
    await expect(
      validateRsbuildConfig(sharedSecurityConfigSchema, {
        checkSyntax: {
          ecmaVersion: 2,
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Rsbuild config validation error:
      * Expected boolean, received object at "checkSyntax", or Invalid value. Expected 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | latest, received 2 at "checkSyntax.ecmaVersion""
    `);
  });

  it('test validate passed', async () => {
    await expect(
      validateRsbuildConfig(sharedSecurityConfigSchema, {
        checkSyntax: {
          ecmaVersion: 3,
        },
      }),
    ).resolves.toBeDefined();

    await expect(
      validateRsbuildConfig(sharedSecurityConfigSchema, {
        checkSyntax: true,
      }),
    ).resolves.toBeDefined();
  });
});
