import { createCompiler } from './createCompiler';
import { initConfigs, InitConfigsOptions } from './initConfigs';
import { logger, type Stats, type BuildOptions } from '@rsbuild/shared';
import type {
  MultiStats,
  Compiler,
  MultiCompiler,
  Configuration as WebpackConfig,
} from 'webpack';

export interface BuildExecuter {
  (compiler: Compiler): Promise<{ stats: Stats }>;
  (compiler: MultiCompiler): Promise<{ stats: MultiStats }>;
  (compiler: Compiler | MultiCompiler): Promise<{ stats: Stats | MultiStats }>;
}

export const webpackBuild: BuildExecuter = async (compiler) => {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats?.hasErrors()) {
        const buildError = err || new Error('Webpack build failed!');
        reject(buildError);
      }
      // If there is a compilation error, the close method should not be called.
      // Otherwise bundler may generate an invalid cache.
      else {
        // When using run or watch, call close and wait for it to finish before calling run or watch again.
        // Concurrent compilations will corrupt the output files.
        compiler.close((closeErr) => {
          closeErr && logger.error(closeErr);

          // Assert type of stats must align to compiler.
          resolve({ stats: stats as any });
        });
      }
    });
  });
};

export const build = async (
  initOptions: InitConfigsOptions,
  { mode = 'production', watch, compiler: customCompiler }: BuildOptions = {},
  executer?: BuildExecuter,
) => {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = mode;
  }

  const { context } = initOptions;

  let compiler: Compiler | MultiCompiler;
  let bundlerConfigs: WebpackConfig[] | undefined;

  if (customCompiler) {
    compiler = customCompiler;
  } else {
    const { webpackConfigs } = await initConfigs(initOptions);
    compiler = await createCompiler({
      context,
      webpackConfigs,
    });

    // assign webpackConfigs
    bundlerConfigs = webpackConfigs;
  }

  await context.hooks.onBeforeBuildHook.call({
    bundlerConfigs,
  });

  if (watch) {
    compiler.watch({}, (err) => {
      if (err) {
        logger.error(err);
      }
    });
  } else {
    const executeResult = await executer?.(compiler);
    await context.hooks.onAfterBuildHook.call({
      stats: executeResult?.stats as Stats,
    });
  }
};
