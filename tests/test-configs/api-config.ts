import { resolve } from 'path'

const testFixturesPath = resolve(__dirname, '../fixtures')

export default {
  includePatterns: [`${testFixturesPath}/duplicate-functions*.ts`],
  excludePatterns: [],
}
