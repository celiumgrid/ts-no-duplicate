export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复bug
        'docs',     // 文档更新
        'style',    // 代码格式化
        'refactor', // 重构
        'perf',     // 性能优化
        'test',     // 测试相关
        'build',    // 构建相关
        'ci',       // CI/CD相关
        'chore',    // 其他杂项
        'revert',   // 回滚
        'wip',      // 进行中的工作
        'deps',     // 依赖更新
        'patch',    // 补丁版本 (0.0.x)
        'minor',    // 次要版本 (0.x.0)
        'major',    // 主要版本 (x.0.0)
        'release'   // 发布版本 用于ci发布完成后自动commit
      ]
    ],
    'subject-case': [0], // 不限制subject的大小写
    'subject-max-length': [2, 'always', 100],
    // body 每行最大长度
    'body-max-line-length': [2, 'always', 200],
  }
}
