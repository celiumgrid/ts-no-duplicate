// 测试用例：重复的函数名

export function calculateTotal(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0)
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export class MathUtils {
  static add(a: number, b: number): number {
    return a + b
  }
}
