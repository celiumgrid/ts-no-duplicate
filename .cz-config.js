export default {
  types: [
    { value: 'feat', name: '✨ feat:     新功能' },
    { value: 'fix', name: '🐛 fix:      修复bug' },
    { value: 'docs', name: '📚 docs:     文档更新' },
    { value: 'style', name: '💎 style:    代码格式化（不影响功能）' },
    { value: 'refactor', name: '📦 refactor: 重构（既不是新增功能，也不是修改bug的代码变动）' },
    { value: 'perf', name: '🚀 perf:     性能优化' },
    { value: 'test', name: '🚨 test:     添加测试或修改现有测试' },
    { value: 'build', name: '🛠  build:    构建系统或外部依赖的变动' },
    { value: 'ci', name: '⚙️  ci:       CI/CD配置文件和脚本的变动' },
    { value: 'chore', name: '♻️  chore:    其他不修改src或测试文件的变动' },
    { value: 'revert', name: '🗑  revert:   回滚之前的commit' },
    { value: 'wip', name: '💪 wip:      进行中的工作' },
    { value: 'deps', name: '📌 deps:     依赖更新' },
    { value: 'patch', name: '🔧 patch:    补丁版本发布 (0.0.x) - 修复bug' },
    { value: 'minor', name: '🎯 minor:    次要版本发布 (0.x.0) - 新功能，向后兼容' },
    { value: 'major', name: '💥 major:    主要版本发布 (x.0.0) - 破坏性变更' }
  ],

  scopes: [
    { name: 'core' },
    { name: 'cli' },
    { name: 'detector' },
    { name: 'config' },
    { name: 'test' },
    { name: 'docs' },
    { name: 'build' }
  ],

  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  // 可以设置为 true, 否则会被忽略
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  // 当type为feat、fix时才询问
  skipQuestions: [],

  // subject文字长度默认是72
  subjectLimit: 100,
  breaklineChar: '|', // 支持body和footer
  footerPrefix: 'ISSUES CLOSED:',
  askForBreakingChangeFirst: true
}