import { resolve } from 'path'

const testFixturesPath = resolve(__dirname, '../fixtures')

export default {
  includePatterns: [`${testFixturesPath}/*.ts`],
  excludePatterns: [],
  includeInternal: true,
}
