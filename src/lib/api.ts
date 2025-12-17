import { ConfigLoader } from './config-loader'
import { DuplicateDetector } from './detector'
import { ReportFormatter } from './formatter'
import type { DetectorOptions, DuplicateReport } from '@/types'

/**
 * 核心API接口
 * 提供程序化的重复检测功能
 */
export interface DuplicateDetectorApi {
  /**
   * 检测重复声明
   * @param options 检测选项
   * @returns 检测报告
   */
  detect(options?: Partial<DetectorOptions>): Promise<DuplicateReport>

  /**
   * 从配置文件加载选项并检测
   * @param configPath 配置文件路径
   * @returns 检测报告
   */
  detectWithConfig(configPath?: string): Promise<DuplicateReport>

  /**
   * 格式化报告
   * @param report 检测报告
   * @param format 输出格式
   * @returns 格式化后的字符串
   */
  formatReport(report: DuplicateReport, format: 'console' | 'json' | 'markdown'): string
}

/**
 * 创建重复检测器API实例
 */
export function createDuplicateDetectorApi(): DuplicateDetectorApi {
  return {
    async detect(options: Partial<DetectorOptions> = {}): Promise<DuplicateReport> {
      const detector = new DuplicateDetector(options)
      return await detector.detect()
    },

    async detectWithConfig(configPath?: string): Promise<DuplicateReport> {
      const detectorOptions = await ConfigLoader.load(configPath)
      const detector = new DuplicateDetector(detectorOptions)
      return await detector.detect()
    },

    formatReport(report: DuplicateReport, format: 'console' | 'json' | 'markdown'): string {
      // 捕获输出
      const originalLog = console.log
      const logs: string[] = []
      console.log = (...args) => logs.push(args.join(' '))

      try {
        switch (format) {
          case 'json':
            ReportFormatter.json(report)
            break
          case 'markdown':
            ReportFormatter.markdown(report)
            break
          default:
            ReportFormatter.console(report)
        }

        return logs.join('\n')
      }
      finally {
        console.log = originalLog
      }
    },
  }
}

/**
 * 默认API实例
 */
export const duplicateDetectorApi = createDuplicateDetectorApi()
