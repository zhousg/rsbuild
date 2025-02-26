import { expect, describe, it } from 'vitest';
import { getModuleName } from '../src/module-graph/utils';

/** Based on @bundle-stats/utils, detail url: https://github.com/relative-ci/bundle-stats/blob/master/packages/utils/src/webpack/__tests__/utils-get-module-name.js */
describe('Webpack/utils/getModuleName', () => {
  it('should return empty name if missing', () => {
    expect(getModuleName()).toBe('');
  });

  it('should return name as it is', () => {
    expect(getModuleName('./node_modules/lodash/_apply.js')).toBe(
      './node_modules/lodash/_apply.js',
    );
  });

  it('should remove loader details', () => {
    expect(
      getModuleName(
        '!babel-loader!eslint-loader!./node_modules/lodash/_apply.js',
      ),
    ).toBe('./node_modules/lodash/_apply.js');
    expect(
      getModuleName(
        '!babel-loader!eslint-loader!./node_modules/lodash/_apply.js',
      ),
    ).toBe('./node_modules/lodash/_apply.js');
    expect(
      getModuleName('plugin/src/loader.js?{"modules":["./src/main.js"]}!'),
    ).toBe('plugin/src/loader.js?{"modules":["./src/main.js"]}!');
  });

  it('should remove webpack module details', () => {
    expect(getModuleName('./node_modules/lodash/_apply.js + 7 modules')).toBe(
      './node_modules/lodash/_apply.js',
    );
  });

  it('should remove invalid node_modules prefix', () => {
    expect(
      getModuleName('css ../node_modules../node_modules/package-a/style.css'),
    ).toBe('../node_modules/package-a/style.css');
  });
});
