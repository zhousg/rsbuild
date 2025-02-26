import {
  AssetsRetryOptions,
  Charset,
  CssModules,
  DataUriLimit,
  DisableSourceMapOption,
  DistPathConfig,
  FilenameConfig,
  LegalComments,
  Polyfill,
  SharedOutputConfig,
} from '../types';
import { z } from '../utils';
import { ZodType } from '../zod';
import { RsbuildTargetSchema } from './source';

export const DistPathConfigSchema: ZodType<DistPathConfig> = z.partialObj({
  root: z.string(),
  js: z.string(),
  css: z.string(),
  svg: z.string(),
  font: z.string(),
  html: z.string(),
  image: z.string(),
  media: z.string(),
  server: z.string(),
});

export const FilenameConfigSchema: ZodType<FilenameConfig> = z.partialObj({
  js: z.string(),
  css: z.string(),
  svg: z.string(),
  font: z.string(),
  image: z.string(),
  media: z.string(),
});

export const CharsetSchema: ZodType<Charset> = z.enum(['ascii', 'utf8']);

export const PolyfillSchema: ZodType<Polyfill> = z.enum([
  'usage',
  'entry',
  'ua',
  'off',
]);

export const AssetsRetryOptionsSchema: ZodType<AssetsRetryOptions> =
  z.partialObj({
    max: z.number(),
    type: z.array(z.string()),
    test: z.union([z.string(), z.function(z.tuple([z.string()]), z.boolean())]),
    domain: z.array(z.string()),
    crossOrigin: z.boolean(),
    onFail: z.function(),
    onRetry: z.function(),
    onSuccess: z.function(),
  });

export const DataUriLimitSchema: ZodType<DataUriLimit> = z.partialObj({
  svg: z.number(),
  font: z.number(),
  image: z.number(),
  media: z.number(),
});

export const LegalCommentsSchema: ZodType<LegalComments> = z.enum([
  'none',
  'inline',
  'linked',
]);

export const DisableSourceMapOptionSchema: ZodType<DisableSourceMapOption> =
  z.union([z.boolean(), z.partialObj({ js: z.boolean(), css: z.boolean() })]);

const inlineSchema = z.union([
  z.boolean(),
  z.instanceof(RegExp),
  z.anyFunction(),
]);

export const CssModulesSchema: ZodType<CssModules> = z.partialObj({
  auto: z.any(),
  localIdentName: z.string(),
  exportLocalsConvention: z.any(),
});

export const sharedOutputConfigSchema = z.partialObj({
  distPath: DistPathConfigSchema,
  filename: FilenameConfigSchema,
  charset: CharsetSchema,
  polyfill: PolyfillSchema,
  cssModules: CssModulesSchema,
  assetsRetry: AssetsRetryOptionsSchema,
  assetPrefix: z.string(),
  dataUriLimit: z.union([z.number(), DataUriLimitSchema]),
  legalComments: LegalCommentsSchema,
  cleanDistPath: z.boolean(),
  convertToRem: z.union([z.boolean(), z.instanceof(Object)]),
  disableCssExtract: z.boolean(),
  disableMinimize: z.boolean(),
  disableSourceMap: DisableSourceMapOptionSchema,
  disableFilenameHash: z.boolean(),
  disableInlineRuntimeChunk: z.boolean(),
  disableCssModuleExtension: z.boolean(),
  enableAssetManifest: z.boolean(),
  enableAssetFallback: z.boolean(),
  enableLatestDecorators: z.boolean(),
  enableCssModuleTSDeclaration: z.boolean(),
  enableInlineScripts: inlineSchema,
  enableInlineStyles: inlineSchema,
  externals: z.any(),
  overrideBrowserslist: z.union([
    z.array(z.string()),
    z.record(RsbuildTargetSchema, z.array(z.string())),
  ]),
});

const _schema: z.ZodType<SharedOutputConfig> = sharedOutputConfigSchema;
