// 测试用例：与第一个文件重复的类名和接口名

export class UserService {
  private apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl
  }

  async fetchUser(id: number): Promise<User> {
    const response = await fetch(`${this.apiUrl}/users/${id}`)
    return response.json()
  }
}

export interface User {
  uid: string
  displayName: string
  avatar?: string
}

export type UserStatus = 'active' | 'inactive' | 'pending'
