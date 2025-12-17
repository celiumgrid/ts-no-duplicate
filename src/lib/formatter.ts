import { Logger } from './logger'
import type { DuplicateReport } from '@/types'

/**
 * 检测报告格式化器
 * 支持多种输出格式：控制台、JSON、Markdown
 */
export class ReportFormatter {
  static console(report: DuplicateReport): void {
    Logger.info('📊 检测报告\n', false)

    // 显示摘要
    console.log(Logger.cyan('摘要:'))
    console.log(`  文件总数: ${report.summary.totalFiles}`)
    console.log(`  声明总数: ${report.summary.totalDeclarations}`)
    console.log(`  重复组数: ${report.summary.duplicateGroups}`)
    console.log(`  重复声明数: ${report.summary.duplicateDeclarations}\n`)

    if (report.duplicates.length === 0) {
      Logger.success('未发现重复命名！')
      return
    }

    Logger.error(`发现 ${report.duplicates.length} 组重复命名:\n`)

    report.duplicates.forEach((group, index) => {
      const typeColor = Logger.getTypeColor(group.type)
      console.log(Logger.yellow(`${index + 1}. ${typeColor(group.type)} "${group.name}" (${group.count} 次重复)`))

      group.locations.forEach((location, locIndex) => {
        const prefix = locIndex === group.locations.length - 1 ? '└─' : '├─'
        console.log(Logger.dim(`   ${prefix} ${location.file}:${location.line}:${location.column}`))

        if (location.context) {
          console.log(Logger.dim(`      ${location.context}`))
        }
      })
      console.log()
    })
  }

  static json(report: DuplicateReport): void {
    console.log(JSON.stringify(report, null, 2))
  }

  static markdown(report: DuplicateReport): void {
    console.log('# TypeScript 重复命名检测报告\n')

    console.log('## 摘要\n')
    console.log(`- 文件总数: ${report.summary.totalFiles}`)
    console.log(`- 声明总数: ${report.summary.totalDeclarations}`)
    console.log(`- 重复组数: ${report.summary.duplicateGroups}`)
    console.log(`- 重复声明数: ${report.summary.duplicateDeclarations}\n`)

    if (report.duplicates.length === 0) {
      console.log('✅ **未发现重复命名！**\n')
      return
    }

    console.log('## 重复命名详情\n')

    report.duplicates.forEach((group, index) => {
      console.log(`### ${index + 1}. \`${group.type}\` "${group.name}" (${group.count} 次重复)\n`)

      group.locations.forEach((location) => {
        console.log(`- \`${location.file}:${location.line}:${location.column}\``)
        if (location.context) {
          console.log(`  \`\`\`typescript\n  ${location.context}\n  \`\`\``)
        }
      })
      console.log()
    })
  }
}
