import { Command } from 'commander'
import { promises as fs, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { duplicateDetectorApi } from './api'
import { Logger } from './logger'
import chalk from 'chalk'

const program = new Command()

// 获取 package.json 版本号
function getVersion(): string {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const packageJsonPath = join(__dirname, '../../package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
    return packageJson.version
  }
  catch {
    return '1.0.0' // fallback version
  }
}

/**
 * CLI 接口选项
 */
export interface CliOptions {
  config?: string
  format: 'console' | 'json' | 'markdown'
  output?: string
}

/**
 * 创建配置文件
 */
async function initConfig(): Promise<void> {
  const configPath = 'ts-no-duplicate.ts'

  try {
    // 检查文件是否已存在
    try {
      await fs.access(configPath)
      Logger.warning(`配置文件 ${configPath} 已存在`)
      return
    }
    catch {
      // 文件不存在，继续创建
    }

    const configContent = `import type { DetectorOptions } from '@celiumgrid/ts-no-duplicate'

const config: DetectorOptions = {
  tsConfigPath: './tsconfig.json',
  includeInternal: false,
  excludePatterns: [
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/*.d.ts',
    '**/node_modules/**',
    '**/dist/**',
  ],
  includePatterns: ['**/*.ts', '**/*.tsx'],
  ignoreTypes: [],
  ignoreNames: ['index', 'default'],
  rules: {
    allowSameFileOverloads: true,
    allowCrossModuleDuplicates: false,
    maxDuplicatesPerName: 2,
  },
}

export default config
`

    await fs.writeFile(configPath, configContent, 'utf-8')
    Logger.success(`✅ 已创建配置文件: ${configPath}`)
  }
  catch (error) {
    Logger.error(`创建配置文件失败: ${error}`)
    process.exit(1)
  }
}

/**
 * 配置 CLI 程序
 */
export function setupCli(): void {
  // 配置主程序
  program
    .name('tsnd')
    .description('TypeScript 跨文件重复命名检测工具')
    .version(getVersion())
    .option('-c, --config <path>', '加载配置文件路径')
    .option('-f, --format <format>', '输出格式 (console|json|markdown)', 'console')
    .option('--output <file>', '输出到文件')
    .action(async (options: CliOptions) => {
      // 默认操作：执行检测
      await executeCliCommand({
        config: options.config,
        format: options.format || 'console',
        output: options.output,
      })
    })

  // 添加 init 子命令
  program
    .command('init')
    .description('创建默认配置文件 ts-no-duplicate.ts')
    .action(async () => {
      await initConfig()
    })
}

/**
 * 执行CLI命令
 * @param options CLI选项
 */
export async function executeCliCommand(options: CliOptions): Promise<void> {
  try {
    // JSON 模式下启用静默模式，禁用 Logger 输出
    const isJsonMode = options.format === 'json'
    Logger.setSilent(isJsonMode)

    if (!isJsonMode) {
      Logger.info('启动 TypeScript 重复命名检测...\n')
    }

    // 执行检测
    const report = await duplicateDetectorApi.detectWithConfig(options.config)

    // 格式化输出
    const formattedOutput = duplicateDetectorApi.formatReport(report, options.format)

    if (options.output) {
      await fs.writeFile(options.output, formattedOutput)
      if (!isJsonMode) {
        Logger.success(`报告已保存到: ${options.output}`)
      }
    }
    else {
      console.log(formattedOutput)
    }

    // 如果发现重复，退出码为 1
    if (report.duplicates.length > 0) {
      process.exit(1)
    }
  }
  catch (error) {
    Logger.error('检测过程中发生错误:')
    console.error(error)
    process.exit(1)
  }
  finally {
    // 恢复日志输出
    Logger.setSilent(false)
  }
}

/**
 * CLI 主函数
 */
export async function runCli(): Promise<void> {
  setupCli()
  await program.parseAsync()
}

// 处理未捕获的异常
process.on(
  'uncaughtException',
  (error) => {
    console.error(
      chalk.red('未捕获的异常:'),
      error.message,
    )
    process.exit(1)
  },
)

process.on(
  'unhandledRejection',
  (reason) => {
    console.error(
      chalk.red('未处理的Promise拒绝:'),
      reason,
    )
    process.exit(1)
  },
)
