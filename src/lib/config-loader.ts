import fs from 'fs/promises'
import { createJiti } from 'jiti'
import path from 'path'
import { DEFAULT_CONFIG_FILE, DEFAULT_DETECTOR_OPTIONS } from '@/const'
import { Logger } from './logger'
import type { DetectorOptions } from '@/types'

/**
 * 配置文件加载器
 * 只支持 ts-no-duplicate.ts 配置文件，使用 jiti 加载
 */
export class ConfigLoader {
  static async load(configPath: string = DEFAULT_CONFIG_FILE): Promise<DetectorOptions> {
    // 如果没有指定配置文件，使用默认配置文件名
    try {
      await fs.access(configPath)

      Logger.info(`读取配置文件: ${configPath}`)
      const config = await this.loadConfigFile(configPath)
      return this.mergeConfig(config)
    }
    catch (error) {
      Logger.info(`配置文件加载失败: ${error instanceof Error ? error.message : String(error)}`)
      Logger.info('使用默认配置')
      // 配置文件不存在或加载失败，返回默认配置
      return DEFAULT_DETECTOR_OPTIONS
    }
  }

  private static async loadConfigFile(configPath: string): Promise<any> {
    // 创建 jiti 实例，支持 TypeScript 和 ESM，禁用缓存
    const jiti = createJiti(import.meta.url, {
      interopDefault: true,
      cache: false, // 禁用缓存，确保每次都重新加载
    })

    const absolutePath = path.resolve(configPath)
    const imported = await jiti.import<DetectorOptions | { default: DetectorOptions }>(absolutePath)

    // 处理默认导出：jiti 可能返回 { default: config } 或直接返回 config
    const config = 'default' in imported ? imported.default : imported
    return config
  }

  private static mergeConfig(userConfig: any): DetectorOptions {
    // 直接覆盖合并，用户配置优先
    const merged = {
      ...DEFAULT_DETECTOR_OPTIONS,
      ...userConfig,
      // rules 需要单独处理，保留默认值
      rules: {
        ...DEFAULT_DETECTOR_OPTIONS.rules,
        ...userConfig.rules,
      },
    } as DetectorOptions

    return merged
  }
}
