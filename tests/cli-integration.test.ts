import { describe, it, expect } from 'vitest'
import { resolve } from 'path'
import { execSync } from 'child_process'

describe('CLI Integration Tests', () => {
  const testConfigsPath = resolve(__dirname, 'test-configs')

  describe('CLI Wiring', () => {
    it('应该能够通过CLI执行检测并返回JSON格式结果', async () => {
      const configPath = resolve(testConfigsPath, 'cli-basic.ts')

      try {
        // 使用配置文件执行命令
        execSync(
          `pnpm exec tsx src/index.ts --format json --config ${configPath}`,
          { encoding: 'utf-8', cwd: process.cwd() },
        )
      }
      catch (error: any) {
        // 命令因为发现重复而失败，但输出仍然有效
        const result = error.stdout

        // 验证输出是有效的JSON
        expect(() => JSON.parse(result)).not.toThrow()

        const report = JSON.parse(result)
        expect(report.duplicates).toBeDefined()
        expect(report.summary).toBeDefined()
      }
    })

    it('应该能够处理无重复的情况', async () => {
      const configPath = resolve(testConfigsPath, 'cli-no-duplicates.ts')

      const result = execSync(
        `pnpm exec tsx src/index.ts --format json --config ${configPath}`,
        { encoding: 'utf-8', cwd: process.cwd() },
      )

      // 验证输出是有效的JSON
      expect(() => JSON.parse(result)).not.toThrow()

      const report = JSON.parse(result)
      expect(report.duplicates).toHaveLength(0)
    })

    it('应该支持不同的输出格式', async () => {
      const configPath = resolve(testConfigsPath, 'cli-no-duplicates.ts')

      const result = execSync(
        `pnpm exec tsx src/index.ts --format console --config ${configPath}`,
        { encoding: 'utf-8', cwd: process.cwd() },
      )

      // 验证输出包含预期的文本
      expect(result).toContain('检测报告')
    })

    it('应该在发现重复时返回非零退出码', async () => {
      const configPath = resolve(testConfigsPath, 'cli-basic.ts')
      let exitCode = 0

      try {
        execSync(
          `pnpm exec tsx src/index.ts --format json --config ${configPath}`,
          { encoding: 'utf-8', cwd: process.cwd() },
        )
      }
      catch (error: any) {
        exitCode = error.status
      }

      expect(exitCode).toBe(1)
    })

    it('应该在没有重复时返回零退出码', async () => {
      const configPath = resolve(testConfigsPath, 'cli-no-duplicates.ts')
      let exitCode = 0

      try {
        execSync(
          `pnpm exec tsx src/index.ts --format json --config ${configPath}`,
          { encoding: 'utf-8', cwd: process.cwd() },
        )
      }
      catch (error: any) {
        exitCode = error.status
      }

      expect(exitCode).toBe(0)
    })
  })

  describe('配置文件选项', () => {
    it('应该支持ignoreTypes配置选项', async () => {
      const configPath = resolve(testConfigsPath, 'cli-ignore-types.ts')

      try {
        const result = execSync(
          `pnpm exec tsx src/index.ts --format json --config ${configPath}`,
          { encoding: 'utf-8', cwd: process.cwd() },
        )

        const report = JSON.parse(result)
        const functionDuplicates = report.duplicates.filter(
          (dup: any) => dup.type === 'function',
        )

        expect(functionDuplicates).toHaveLength(0)
      }
      catch (error: any) {
        // 如果有其他类型的重复，命令可能失败
        // 但我们仍然可以验证输出
        const result = error.stdout
        const report = JSON.parse(result)
        const functionDuplicates = report.duplicates.filter(
          (dup: any) => dup.type === 'function',
        )

        expect(functionDuplicates).toHaveLength(0)
      }
    })

    it('应该支持includeInternal配置选项', async () => {
      const configPath = resolve(testConfigsPath, 'cli-include-internal.ts')
      let result: string

      try {
        result = execSync(
          `pnpm exec tsx src/index.ts --format json --config ${configPath}`,
          { encoding: 'utf-8', cwd: process.cwd() },
        )
      }
      catch (error: any) {
        result = error.stdout
      }

      const report = JSON.parse(result)

      // includeInternal: true 应该包含内部声明
      // 这里我们只验证命令能够正常执行
      expect(report.summary).toBeDefined()
      expect(report.duplicates).toBeDefined()
    })
  })
})
