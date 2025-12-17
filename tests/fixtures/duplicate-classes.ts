// 测试用例：重复的类名

export class UserService {
  private users: User[] = []

  addUser(user: User): void {
    this.users.push(user)
  }

  getUsers(): User[] {
    return this.users
  }
}

export interface User {
  id: number
  name: string
  email: string
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}
