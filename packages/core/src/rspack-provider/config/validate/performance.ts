import {
  sharedPerformanceConfigSchema,
  z,
  BaseChunkSplit,
  RsbuildChunkSplit,
  BaseSplitRulesSchema,
  SplitBySizeSchema,
  SplitCustomSchema,
  ForceSplittingSchema,
} from '@rsbuild/shared';
import type { PerformanceConfig } from '../../types';

const BaseChunkSplitSchema: z.ZodType<BaseChunkSplit> =
  BaseSplitRulesSchema.extend({
    strategy: z.enum(['split-by-experience', 'all-in-one', 'single-vendor']),
    forceSplitting: ForceSplittingSchema,
    override: z.any().optional(),
  });

const RsbuildChunkSplitSchema: z.ZodType<RsbuildChunkSplit> = z.union([
  BaseChunkSplitSchema,
  SplitBySizeSchema,
  SplitCustomSchema,
]);

export const performanceConfigSchema: z.ZodType<PerformanceConfig> =
  sharedPerformanceConfigSchema
    .extend({
      chunkSplit: RsbuildChunkSplitSchema,
    })
    .partial();
