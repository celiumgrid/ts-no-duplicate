// 测试用例：没有重复命名的文件

export function uniqueFunction(): string {
  return 'unique'
}

export class UniqueClass {
  private value: string

  constructor(value: string) {
    this.value = value
  }

  getValue(): string {
    return this.value
  }
}

export interface UniqueInterface {
  id: string
  name: string
}

export type UniqueType = {
  timestamp: number
  data: any
}

export enum UniqueEnum {
  OPTION_A = 'a',
  OPTION_B = 'b',
  OPTION_C = 'c',
}
