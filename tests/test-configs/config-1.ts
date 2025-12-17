import type { DetectorOptions } from '../../src/index'

const config: DetectorOptions = {
  tsConfigPath: './custom-tsconfig.json',
  includeInternal: true,
  excludePatterns: ['**/*.custom.ts'],
  includePatterns: ['**/*.tsx'],
  ignoreTypes: ['function'],
  ignoreNames: ['test'],
  rules: {
    allowSameFileOverloads: false,
    allowCrossModuleDuplicates: true,
    maxDuplicatesPerName: 5,
  },
}

export default config
