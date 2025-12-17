import type { DetectorOptions } from '@/types'

/**
 * 默认配置文件名
 */
export const DEFAULT_CONFIG_FILE = 'ts-no-duplicate.ts'

/**
 * 默认检测器配置
 */
export const DEFAULT_DETECTOR_OPTIONS: DetectorOptions = {
  tsConfigPath: './tsconfig.json',
  includeInternal: false,
  excludePatterns: [
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/*.d.ts',
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
  ],
  includePatterns: ['**/*.ts', '**/*.tsx'],
  ignoreTypes: [],
  ignoreNames: [],
  rules: {
    allowSameFileOverloads: true,
    allowCrossModuleDuplicates: false,
    maxDuplicatesPerName: 2,
  },
}
