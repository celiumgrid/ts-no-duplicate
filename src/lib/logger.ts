import chalk from 'chalk'

/**
 * 日志级别
 */
export enum LogLevel {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  DEBUG = 'debug',
}

/**
 * 日志颜色配置
 */
const LOG_COLORS = {
  [LogLevel.INFO]: chalk.blue,
  [LogLevel.SUCCESS]: chalk.green,
  [LogLevel.WARNING]: chalk.yellow,
  [LogLevel.ERROR]: chalk.red,
  [LogLevel.DEBUG]: chalk.gray,
} as const

/**
 * 特殊符号配置
 */
const LOG_SYMBOLS = {
  [LogLevel.INFO]: '🔍',
  [LogLevel.SUCCESS]: '✅',
  [LogLevel.WARNING]: '⚠️',
  [LogLevel.ERROR]: '❌',
  [LogLevel.DEBUG]: '🐛',
} as const

/**
 * 声明类型颜色配置
 */
const TYPE_COLORS = {
  function: chalk.blue,
  class: chalk.green,
  interface: chalk.magenta,
  type: chalk.cyan,
  enum: chalk.yellow,
  variable: chalk.red,
  namespace: chalk.gray,
} as const

/**
 * 公共日志工具
 */
export class Logger {
  private static silent = false

  /**
   * 设置静默模式
   * @param value 是否启用静默模式
   */
  static setSilent(value: boolean): void {
    this.silent = value
  }

  /**
   * 输出带颜色的日志
   */
  static log(level: LogLevel, message: string, symbol?: boolean): void {
    if (this.silent) return // 静默模式下不输出
    const colorFn = LOG_COLORS[level]
    const symbolStr = symbol ? `${LOG_SYMBOLS[level]} ` : ''
    console.log(colorFn(`${symbolStr}${message}`))
  }

  /**
   * 输出信息日志
   */
  static info(message: string, symbol = true): void {
    this.log(LogLevel.INFO, message, symbol)
  }

  /**
   * 输出成功日志
   */
  static success(message: string, symbol = true): void {
    this.log(LogLevel.SUCCESS, message, symbol)
  }

  /**
   * 输出警告日志
   */
  static warning(message: string, symbol = true): void {
    this.log(LogLevel.WARNING, message, symbol)
  }

  /**
   * 输出错误日志
   */
  static error(message: string, symbol = true): void {
    this.log(LogLevel.ERROR, message, symbol)
  }

  /**
   * 输出调试日志
   */
  static debug(message: string, symbol = true): void {
    this.log(LogLevel.DEBUG, message, symbol)
  }

  /**
   * 获取声明类型的颜色函数
   */
  static getTypeColor(type: string): (text: string) => string {
    return TYPE_COLORS[type as keyof typeof TYPE_COLORS] || chalk.white
  }

  /**
   * 输出带颜色的文本
   */
  static colored(text: string, color: keyof typeof chalk): string {
    return (chalk[color] as any)(text)
  }

  /**
   * 输出灰色文本（用于次要信息）
   */
  static dim(text: string): string {
    return chalk.dim(text)
  }

  /**
   * 输出青色文本（用于标题）
   */
  static cyan(text: string): string {
    return chalk.cyan(text)
  }

  /**
   * 输出黄色文本（用于高亮）
   */
  static yellow(text: string): string {
    return chalk.yellow(text)
  }
}
