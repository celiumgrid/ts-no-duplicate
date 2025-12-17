// 测试用例：与第一个文件重复的类型和枚举

export type ApiResponse<T> = {
  result: T
  success: boolean
  error?: string
}

export interface DatabaseConfig {
  host: string
  port: number
  database: string
}

export enum Priority {
  CRITICAL = 0,
  HIGH = 1,
  NORMAL = 2,
  LOW = 3,
}

export const API_ENDPOINTS = {
  users: '/api/users',
  posts: '/api/posts',
}
