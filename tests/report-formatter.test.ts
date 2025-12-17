import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ReportFormatter } from '../src/lib/formatter'
import type { DuplicateReport } from '../src/types'

describe('ReportFormatter', () => {
  let consoleSpy: any

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { })
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  const mockReport: DuplicateReport = {
    summary: {
      totalFiles: 10,
      totalDeclarations: 50,
      duplicateGroups: 2,
      duplicateDeclarations: 6,
    },
    duplicates: [
      {
        name: 'handleSubmit',
        type: 'function',
        count: 3,
        locations: [
          {
            file: 'src/form.ts',
            line: 10,
            column: 2,
            context: 'function handleSubmit(data: FormData) {',
          },
          {
            file: 'src/contact.ts',
            line: 15,
            column: 2,
            context: 'const handleSubmit = (data: any) => {',
          },
          {
            file: 'src/utils.ts',
            line: 5,
            column: 2,
            context: 'export function handleSubmit(formData: object) {',
          },
        ],
      },
      {
        name: 'UserService',
        type: 'class',
        count: 2,
        locations: [
          {
            file: 'src/user.ts',
            line: 20,
            column: 2,
            context: 'class UserService {',
          },
          {
            file: 'src/auth.ts',
            line: 8,
            column: 2,
            context: 'export class UserService {',
          },
        ],
      },
    ],
  }

  const emptyReport: DuplicateReport = {
    summary: {
      totalFiles: 5,
      totalDeclarations: 25,
      duplicateGroups: 0,
      duplicateDeclarations: 0,
    },
    duplicates: [],
  }

  it('应该格式化控制台输出 - 有重复', () => {
    ReportFormatter.console(mockReport)

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('📊 检测报告'))
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('文件总数: 10'))
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('声明总数: 50'))
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('重复组数: 2'))
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('重复声明数: 6'))
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌ 发现 2 组重复命名'))
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('handleSubmit'))
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('UserService'))
  })

  it('应该格式化控制台输出 - 无重复', () => {
    ReportFormatter.console(emptyReport)

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('📊 检测报告'))
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('✅ 未发现重复命名！'))
  })

  it('应该格式化 JSON 输出', () => {
    ReportFormatter.json(mockReport)

    const jsonOutput = consoleSpy.mock.calls[0][0]
    const parsed = JSON.parse(jsonOutput)

    expect(parsed.summary.totalFiles).toBe(10)
    expect(parsed.summary.duplicateGroups).toBe(2)
    expect(parsed.duplicates).toHaveLength(2)
    expect(parsed.duplicates[0].name).toBe('handleSubmit')
    expect(parsed.duplicates[0].type).toBe('function')
    expect(parsed.duplicates[0].count).toBe(3)
    expect(parsed.duplicates[0].locations).toHaveLength(3)
  })

  it('应该格式化 Markdown 输出 - 有重复', () => {
    ReportFormatter.markdown(mockReport)

    expect(consoleSpy).toHaveBeenCalledWith('# TypeScript 重复命名检测报告\n')
    expect(consoleSpy).toHaveBeenCalledWith('## 摘要\n')
    expect(consoleSpy).toHaveBeenCalledWith('- 文件总数: 10')
    expect(consoleSpy).toHaveBeenCalledWith('- 声明总数: 50')
    expect(consoleSpy).toHaveBeenCalledWith('- 重复组数: 2')
    expect(consoleSpy).toHaveBeenCalledWith('- 重复声明数: 6\n')
    expect(consoleSpy).toHaveBeenCalledWith('## 重复命名详情\n')
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('### 1. `function` "handleSubmit"'))
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('### 2. `class` "UserService"'))
  })

  it('应该格式化 Markdown 输出 - 无重复', () => {
    ReportFormatter.markdown(emptyReport)

    expect(consoleSpy).toHaveBeenCalledWith('# TypeScript 重复命名检测报告\n')
    expect(consoleSpy).toHaveBeenCalledWith('✅ **未发现重复命名！**\n')
  })
})
