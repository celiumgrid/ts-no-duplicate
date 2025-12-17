// 测试用例：重复的类型和枚举

export type ApiResponse<T> = {
  data: T
  status: number
  message: string
}

export interface Config {
  apiUrl: string
  timeout: number
  retries: number
}

export enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4,
}

export const DEFAULT_CONFIG: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
}
