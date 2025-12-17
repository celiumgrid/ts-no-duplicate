import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { ConfigLoader } from '../src/lib/config-loader'
import { DEFAULT_DETECTOR_OPTIONS } from '../src/const'

describe('ConfigLoader', () => {
  const testConfigsPath = resolve(__dirname, 'test-configs')

  it('应该加载默认配置当没有配置文件时', async () => {
    const config = await ConfigLoader.load('non-existent-config.ts')

    expect(config).toBeDefined()
    expect(config.tsConfigPath).toBe(DEFAULT_DETECTOR_OPTIONS.tsConfigPath)
    expect(config.includeInternal).toBe(DEFAULT_DETECTOR_OPTIONS.includeInternal)
    expect(config.excludePatterns).toEqual(expect.arrayContaining(DEFAULT_DETECTOR_OPTIONS.excludePatterns || []))
    expect(config.includePatterns).toEqual(expect.arrayContaining(DEFAULT_DETECTOR_OPTIONS.includePatterns || []))
  })

  it('应该加载 ts-no-duplicate.ts 配置文件', async () => {
    const testConfigPath = resolve(testConfigsPath, 'config-1.ts')
    const config = await ConfigLoader.load(testConfigPath)

    expect(config.tsConfigPath).toBe('./custom-tsconfig.json')
    expect(config.includeInternal).toBe(true)
    expect(config.excludePatterns).toContain('**/*.custom.ts')
    expect(config.includePatterns).toContain('**/*.tsx')
    expect(config.ignoreTypes).toEqual(['function'])
    expect(config.ignoreNames).toEqual(['test'])
    expect(config.rules?.allowSameFileOverloads).toBe(false)
    expect(config.rules?.allowCrossModuleDuplicates).toBe(true)
    expect(config.rules?.maxDuplicatesPerName).toBe(5)
  })

  it('应该自动查找默认配置文件', async () => {
    const testConfigPath = resolve(testConfigsPath, 'config-2.ts')
    const config = await ConfigLoader.load(testConfigPath)

    expect(config.includeInternal).toBe(true)
  })

  it('应该合并用户配置和默认配置', async () => {
    const testConfigPath = resolve(testConfigsPath, 'config-3.ts')
    const config = await ConfigLoader.load(testConfigPath)

    // 用户配置应该覆盖默认值
    expect(config.includeInternal).toBe(true)
    // excludePatterns 被用户配置完全覆盖
    expect(config.excludePatterns).toEqual(['**/*.custom.ts'])

    // 未配置的字段应该使用默认值
    expect(config.tsConfigPath).toBe('./tsconfig.json')
    // includePatterns 未配置，使用默认值
    expect(config.includePatterns).toEqual(['**/*.ts', '**/*.tsx'])
  })

  it('应该处理无效的配置文件', async () => {
    const testConfigPath = resolve(testConfigsPath, 'config-invalid.ts')
    const config = await ConfigLoader.load(testConfigPath)

    // 应该返回默认配置
    expect(config.tsConfigPath).toBe('./tsconfig.json')
    expect(config.includeInternal).toBe(false)
  })
})
