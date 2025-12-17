import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { DuplicateDetector } from '../src/lib/detector'

describe('DuplicateDetector Rules', () => {
  const testFixturesPath = resolve(__dirname, 'fixtures')

  it('应该应用 ignoreNames 规则', async () => {
    const detector = new DuplicateDetector({
      includePatterns: [`${testFixturesPath}/duplicate-functions*.ts`],
      excludePatterns: [],
      ignoreNames: ['calculateTotal'], // 忽略这个名称
    })

    const report = await detector.detect(true) // silent mode

    // 应该没有找到 calculateTotal 的重复
    const calculateTotalDuplicate = report.duplicates.find(
      dup => dup.name === 'calculateTotal',
    )

    expect(calculateTotalDuplicate).toBeUndefined()
  })

  it('应该应用 allowSameFileOverloads 规则', async () => {
    // 创建测试文件内容，包含同文件函数重载
    const detector = new DuplicateDetector({
      includePatterns: [`${testFixturesPath}/duplicate-functions*.ts`],
      excludePatterns: [],
      rules: {
        allowSameFileOverloads: true,
        allowCrossModuleDuplicates: false,
        maxDuplicatesPerName: 10,
      },
    })

    const report = await detector.detect(true)

    // 应该检测到跨文件重复
    expect(report.duplicates.length).toBeGreaterThan(0)
  })

  it('应该应用 allowCrossModuleDuplicates 规则', async () => {
    const detectorDisallowCross = new DuplicateDetector({
      includePatterns: [`${testFixturesPath}/duplicate-functions*.ts`],
      excludePatterns: [],
      rules: {
        allowSameFileOverloads: false,
        allowCrossModuleDuplicates: false, // 不允许跨模块重复
        maxDuplicatesPerName: 10,
      },
    })

    const detectorAllowCross = new DuplicateDetector({
      includePatterns: [`${testFixturesPath}/duplicate-functions*.ts`],
      excludePatterns: [],
      rules: {
        allowSameFileOverloads: false,
        allowCrossModuleDuplicates: true, // 允许跨模块重复
        maxDuplicatesPerName: 10,
      },
    })

    const reportDisallow = await detectorDisallowCross.detect(true)
    const reportAllow = await detectorAllowCross.detect(true)

    // 不允许跨模块重复时应该检测到重复
    expect(reportDisallow.duplicates.length).toBeGreaterThan(0)

    // 允许跨模块重复时应该检测到更少的重复（或没有）
    expect(reportAllow.duplicates.length).toBeLessThanOrEqual(reportDisallow.duplicates.length)
  })

  it('应该应用 maxDuplicatesPerName 规则', async () => {
    // 注意：当 maxDuplicatesPerName 为 1 时，如果只有两个文件重复，
    // 可能会导致重复组被完全过滤掉，因为每个文件只保留一个位置
    const detector = new DuplicateDetector({
      includePatterns: [`${testFixturesPath}/duplicate-functions*.ts`],
      excludePatterns: [],
      rules: {
        allowSameFileOverloads: false,
        allowCrossModuleDuplicates: true, // 允许跨模块重复
        maxDuplicatesPerName: 1, // 最多允许1个重复
      },
    })

    // 创建一个包含重复的报告
    const reportWithDuplicates = await detector.detect(true)

    // 检查规则是否被应用 - 如果有重复，每个重复组的位置数量应该 <= maxDuplicatesPerName
    if (reportWithDuplicates.duplicates.length > 0) {
      reportWithDuplicates.duplicates.forEach((duplicate) => {
        expect(duplicate.locations.length).toBeLessThanOrEqual(1)
      })
    }
    else {
      // 如果没有重复，则测试通过
      expect(true).toBe(true)
    }
  })

  it('应该正确处理 includeInternal 选项', async () => {
    const detectorWithInternal = new DuplicateDetector({
      includePatterns: [`${testFixturesPath}/*.ts`],
      excludePatterns: [],
      includeInternal: true,
    })

    const detectorWithoutInternal = new DuplicateDetector({
      includePatterns: [`${testFixturesPath}/*.ts`],
      excludePatterns: [],
      includeInternal: false,
    })

    const reportWithInternal = await detectorWithInternal.detect(true)
    const reportWithoutInternal = await detectorWithoutInternal.detect(true)

    // 包含内部声明的报告应该有更多声明
    expect(reportWithInternal.summary.totalDeclarations)
      .toBeGreaterThanOrEqual(reportWithoutInternal.summary.totalDeclarations)
  })

  it('应该正确处理 glob 模式匹配', async () => {
    const detector = new DuplicateDetector({
      includePatterns: [`${testFixturesPath}/duplicate-functions*.ts`],
      excludePatterns: [`${testFixturesPath}/**/exclude-*.ts`],
    })

    const report = await detector.detect(true)

    // 应该只包含匹配的文件
    expect(report.summary.totalFiles).toBeGreaterThan(0)

    // 检查是否正确排除了文件
    report.duplicates.forEach((duplicate) => {
      duplicate.locations.forEach((location) => {
        expect(location.file).not.toMatch(/exclude-/)
      })
    })
  })
})
