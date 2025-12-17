// 测试用例：与第一个文件重复的函数名

export function calculateTotal(values: string[]): string {
  return values.join(',')
}

export function formatDate(date: Date): string {
  return date.toISOString()
}

export class StringUtils {
  static trim(str: string): string {
    return str.trim()
  }
}
