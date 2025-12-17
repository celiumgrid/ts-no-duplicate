import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { duplicateDetectorApi } from '../src/lib/api'

describe('Duplicate Detector API', () => {
  const testFixturesPath = resolve(__dirname, 'fixtures')

  describe('detect()', () => {
    it('应该检测到重复的函数名', async () => {
      const report = await duplicateDetectorApi.detect({
        includePatterns: [`${testFixturesPath}/duplicate-functions*.ts`],
        excludePatterns: [],
      })

      expect(report.duplicates).toBeDefined()
      expect(report.duplicates.length).toBeGreaterThan(0)

      const calculateTotalDuplicate = report.duplicates.find(
        (dup: any) => dup.name === 'calculateTotal' && dup.type === 'function',
      )

      expect(calculateTotalDuplicate).toBeDefined()
      expect(calculateTotalDuplicate?.count).toBe(2)
      expect(calculateTotalDuplicate?.locations).toHaveLength(2)
    })

    it('应该检测到重复的类名', async () => {
      const report = await duplicateDetectorApi.detect({
        includePatterns: [`${testFixturesPath}/duplicate-classes*.ts`],
        excludePatterns: [],
      })

      const userServiceDuplicate = report.duplicates.find(
        (dup: any) => dup.name === 'UserService' && dup.type === 'class',
      )

      expect(userServiceDuplicate).toBeDefined()
      expect(userServiceDuplicate?.count).toBe(2)
    })

    it('应该检测到重复的接口名', async () => {
      const report = await duplicateDetectorApi.detect({
        includePatterns: [`${testFixturesPath}/duplicate-classes*.ts`],
        excludePatterns: [],
      })

      const userInterfaceDuplicate = report.duplicates.find(
        (dup: any) => dup.name === 'User' && dup.type === 'interface',
      )

      expect(userInterfaceDuplicate).toBeDefined()
      expect(userInterfaceDuplicate?.count).toBe(2)
    })

    it('应该检测到重复的类型别名', async () => {
      const report = await duplicateDetectorApi.detect({
        includePatterns: [`${testFixturesPath}/duplicate-types*.ts`],
        excludePatterns: [],
      })

      const apiResponseDuplicate = report.duplicates.find(
        (dup: any) => dup.name === 'ApiResponse' && dup.type === 'type',
      )

      expect(apiResponseDuplicate).toBeDefined()
      expect(apiResponseDuplicate?.count).toBe(2)
    })

    it('应该检测到重复的枚举', async () => {
      const report = await duplicateDetectorApi.detect({
        includePatterns: [`${testFixturesPath}/duplicate-types*.ts`],
        excludePatterns: [],
      })

      const priorityEnumDuplicate = report.duplicates.find(
        (dup: any) => dup.name === 'Priority' && dup.type === 'enum',
      )

      expect(priorityEnumDuplicate).toBeDefined()
      expect(priorityEnumDuplicate?.count).toBe(2)
    })

    it('对于没有重复的文件应该返回空结果', async () => {
      const report = await duplicateDetectorApi.detect({
        includePatterns: [`${testFixturesPath}/no-duplicates.ts`],
        excludePatterns: [],
      })

      expect(report.duplicates).toHaveLength(0)
      expect(report.summary.duplicateGroups).toBe(0)
    })

    it('应该支持忽略特定类型', async () => {
      const report = await duplicateDetectorApi.detect({
        includePatterns: [`${testFixturesPath}/duplicate-functions*.ts`],
        excludePatterns: [],
        ignoreTypes: ['function'],
      })

      const functionDuplicates = report.duplicates.filter(
        (dup: any) => dup.type === 'function',
      )

      expect(functionDuplicates).toHaveLength(0)
    })

    it('应该包含正确的统计信息', async () => {
      const report = await duplicateDetectorApi.detect({
        includePatterns: [`${testFixturesPath}/*.ts`],
        excludePatterns: [],
      })

      expect(report.summary).toBeDefined()
      expect(report.summary.totalFiles).toBeGreaterThan(0)
      expect(report.summary.totalDeclarations).toBeGreaterThan(0)
      expect(report.summary.duplicateGroups).toBeGreaterThanOrEqual(0)
      expect(report.summary.duplicateDeclarations).toBeGreaterThanOrEqual(0)
    })

    it('应该包含上下文信息', async () => {
      const report = await duplicateDetectorApi.detect({
        includePatterns: [`${testFixturesPath}/duplicate-functions*.ts`],
        excludePatterns: [],
      })

      if (report.duplicates.length > 0) {
        const firstDuplicate = report.duplicates[0]
        expect(firstDuplicate.locations[0].context).toBeDefined()
        expect(firstDuplicate.locations[0].context).toBeTruthy()
      }
    })
  })

  describe('detectWithConfig()', () => {
    const testConfigsPath = resolve(__dirname, 'test-configs')

    it('应该能够从配置文件加载选项', async () => {
      const configPath = resolve(testConfigsPath, 'api-config.ts')
      const report = await duplicateDetectorApi.detectWithConfig(configPath)
      expect(report.duplicates).toBeDefined()
    })

    it('应该使用配置文件中的忽略类型选项', async () => {
      const configPath = resolve(testConfigsPath, 'api-ignore-types.ts')
      const report = await duplicateDetectorApi.detectWithConfig(configPath)

      const functionDuplicates = report.duplicates.filter(
        (dup: any) => dup.type === 'function',
      )

      expect(functionDuplicates).toHaveLength(0)
    })
  })

  describe('formatReport()', () => {
    it('应该能够格式化为JSON', async () => {
      const report = await duplicateDetectorApi.detect({
        includePatterns: [`${testFixturesPath}/no-duplicates.ts`],
      })

      const formatted = duplicateDetectorApi.formatReport(report, 'json')

      expect(() => JSON.parse(formatted)).not.toThrow()
      const parsed = JSON.parse(formatted)
      expect(parsed.duplicates).toBeDefined()
      expect(parsed.summary).toBeDefined()
    })

    it('应该能够格式化为控制台输出', async () => {
      const report = await duplicateDetectorApi.detect({
        includePatterns: [`${testFixturesPath}/no-duplicates.ts`],
      })

      const formatted = duplicateDetectorApi.formatReport(report, 'console')

      expect(typeof formatted).toBe('string')
      expect(formatted.length).toBeGreaterThan(0)
    })

    it('应该能够格式化为Markdown', async () => {
      const report = await duplicateDetectorApi.detect({
        includePatterns: [`${testFixturesPath}/no-duplicates.ts`],
      })

      const formatted = duplicateDetectorApi.formatReport(report, 'markdown')

      expect(typeof formatted).toBe('string')
      expect(formatted.length).toBeGreaterThan(0)
    })
  })
})
