# TypeScript Duplicate Detector

🔍 一个强大的 TypeScript 跨文件重复命名检测工具，帮助你维护代码库的命名一致性。

## ✨ 特性

- 🚀 **快速检测** - 基于 TypeScript AST 的高效扫描
- 🎯 **多类型支持** - 检测函数、类、接口、类型、变量、枚举、命名空间
- 🔧 **灵活配置** - 支持多种过滤和规则配置
- � **s 多种输出** - 控制台、JSON、Markdown 格式
- 🎨 **美观展示** - 彩色输出，清晰的层级结构
- ⚙️ **规则引擎** - 智能处理函数重载、跨模块重复等场景

## 📦 安装

```bash
# 全局安装
pnpm install -g @celiumgrid/ts-no-duplicate

# 项目内安装
pnpm install --save-dev @celiumgrid/ts-no-duplicate
```

## 🚀 快速开始

```bash
# 基本使用
tsnd

# 指定配置文件
tsnd --config ts-no-duplicate.ts

# 输出为 JSON 格式
tsnd --format json

# 保存报告到文件
tsnd --format markdown --output report.md
```

## ⚙️ 配置

### 配置文件

在项目根目录创建 `ts-no-duplicate.ts`：

```bash
# 使用 init 脚本自动创建配置文件
tsnd init
# 或使用完整命令
ts-no-duplicate init
# 或使用 npx
npx @celiumgrid/ts-no-duplicate init
```

配置文件示例：

```typescript
import type { DetectorOptions } from "@celiumgrid/ts-no-duplicate";

const config: DetectorOptions = {
  tsConfigPath: "./tsconfig.json",
  includeInternal: false,
  excludePatterns: [
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/*.d.ts",
    "**/node_modules/**",
    "**/dist/**",
  ],
  includePatterns: ["**/*.ts", "**/*.tsx"],
  ignoreTypes: [],
  ignoreNames: ["index", "default"],
  rules: {
    allowSameFileOverloads: true,
    allowCrossModuleDuplicates: false,
    maxDuplicatesPerName: 2,
  },
};

export default config;
```

### 配置选项说明

#### 基础配置

| 选项              | 类型     | 默认值                    | 说明                       |
| ----------------- | -------- | ------------------------- | -------------------------- |
| `tsConfigPath`    | string   | `"./tsconfig.json"`       | TypeScript 配置文件路径    |
| `includeInternal` | boolean  | `false`                   | 是否包含内部（非导出）声明 |
| `excludePatterns` | string[] | `["**/*.test.ts", ...]`   | 排除的文件模式             |
| `includePatterns` | string[] | `["**/*.ts", "**/*.tsx"]` | 包含的文件模式             |

#### 关于 `tsConfigPath` 的重要说明

`tsConfigPath` 配置项用于指定 TypeScript 配置文件的路径，但需要注意：

**✅ 它的作用：**

- 提供 TypeScript 编译选项（如 `paths`、`baseUrl`、`strict` 等）
- 确保工具能正确解析路径别名（如 `@/lib/xxx` → `src/lib/xxx`）
- 提供类型检查和模块解析配置

**❌ 它不控制：**

- 文件扫描范围（不使用 tsconfig.json 的 `include` 和 `exclude`）
- 检测哪些文件（由 `includePatterns` 和 `excludePatterns` 控制）

**为什么这样设计？**

这种设计允许检测工具的配置独立于项目的 TypeScript 配置：

- 项目的 tsconfig.json 定义编译范围（可能包含测试文件、脚本等）
- 检测工具的配置定义检测范围（通常只检测源代码）
- 两者互不干扰，更加灵活

**示例：**

```typescript
// tsconfig.json - 项目编译配置
{
  "include": ["src", "tests", "scripts"],  // 编译所有这些目录
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }  // ← 检测工具会使用这个
  }
}

// ts-no-duplicate.ts - 检测工具配置
{
  tsConfigPath: "./tsconfig.json",  // 读取编译选项
  includePatterns: ["src/**/*.ts"],  // 但只检测 src 目录
  excludePatterns: ["**/*.test.ts"]  // 排除测试文件
}
```

#### 过滤配置

| 选项          | 类型     | 默认值 | 说明           |
| ------------- | -------- | ------ | -------------- |
| `ignoreTypes` | string[] | `[]`   | 忽略的声明类型 |
| `ignoreNames` | string[] | `[]`   | 忽略的具体名称 |

**支持的声明类型：**

- `function` - 函数
- `class` - 类
- `interface` - 接口
- `type` - 类型别名
- `variable` - 变量
- `enum` - 枚举
- `namespace` - 命名空间

#### 规则配置

| 选项                         | 类型    | 默认值  | 说明                                       |
| ---------------------------- | ------- | ------- | ------------------------------------------ |
| `allowSameFileOverloads`     | boolean | `true`  | 允许同文件内的函数重载                     |
| `allowCrossModuleDuplicates` | boolean | `false` | 允许跨模块重复                             |
| `maxDuplicatesPerName`       | number  | `2`     | 限制每个重复组显示的位置数量（0 表示不限） |

**关于 `maxDuplicatesPerName` 的说明：**

此选项用于限制报告中每个重复组显示的位置数量，而不是"允许的重复数量"。

- 如果设置为 `2`，当有 5 个重复时，报告中只显示前 2 个位置
- 设置为 `0` 或不设置表示显示所有重复位置
- 这个选项主要用于控制报告的详细程度，避免输出过长

## 🎯 命令行选项

```bash
tsnd [options]

Commands:
  init                          创建默认配置文件

Options:
  -c, --config <path>           配置文件路径
  -f, --format <format>         输出格式 (console|json|markdown) (default: "console")
  --output <file>               输出到文件
  -h, --help                    显示帮助信息
  -V, --version                 显示版本号
```

> 注意：所有检测相关的配置选项（如包含/排除模式、忽略类型等）只能通过配置文件设置，不再支持命令行参数。

## 📊 输出格式

### 控制台输出

```
🔍 启动 TypeScript 重复命名检测...

� 扫描 45 个文件...

📊 检测报告

摘要:
  文件总数: 45
  声明总数: 234
  重复组数: 3
  重复声明数: 8

❌ 发现 3 组重复命名:

1. function "handleSubmit" (3 次重复)
   ├─ src/components/Form.ts:15:2
   │    export function handleSubmit(data: FormData) {
   ├─ src/utils/form.ts:8:2
   │    function handleSubmit(formData: any) {
   └─ src/pages/Contact.ts:22:2
        const handleSubmit = (data: ContactForm) => {
```

### JSON 输出

```json
{
  "summary": {
    "totalFiles": 45,
    "totalDeclarations": 234,
    "duplicateGroups": 3,
    "duplicateDeclarations": 8
  },
  "duplicates": [
    {
      "name": "handleSubmit",
      "type": "function",
      "count": 3,
      "locations": [
        {
          "file": "src/components/Form.ts",
          "line": 15,
          "column": 2,
          "context": "export function handleSubmit(data: FormData) {"
        }
      ]
    }
  ]
}
```

### Markdown 输出

````markdown
# TypeScript 重复命名检测报告

## 摘要

- 文件总数: 45
- 声明总数: 234
- 重复组数: 3
- 重复声明数: 8

## 重复命名详情

### 1. `function` "handleSubmit" (3 次重复)

- `src/components/Form.ts:15:2`
  ```typescript
  export function handleSubmit(data: FormData) {
  ```
````

````

## 🔧 使用场景

### 1. 代码重构

在大型项目重构时，创建配置文件来检测重复命名避免冲突：

```typescript
// ts-no-duplicate.ts
export default {
  includePatterns: ["src/**/*.ts"],
  excludePatterns: ["**/*.test.ts"]
}
```

然后运行:

```bash
tsnd --config ts-no-duplicate.ts
````

### 2. 代码审查

集成到 CI/CD 流程中：

```bash
# 如果发现重复命名，退出码为 1
tsnd --format json > duplicates.json
```

### 3. 团队规范

配置团队统一的命名规范：

```json
{
  "ignoreNames": ["index", "default", "config"],
  "rules": {
    "allowSameFileOverloads": true,
    "allowCrossModuleDuplicates": false
  }
}
```

## 🎨 高级用法

### 自定义规则

```json
{
  "rules": {
    "allowSameFileOverloads": false,
    "allowCrossModuleDuplicates": true,
    "maxDuplicatesPerName": 1
  }
}
```

### 特定类型检测

在配置文件中设置：

```typescript
// ts-no-duplicate.ts
export default {
  // 只检测函数重复，忽略其他类型
  ignoreTypes: ["class", "interface", "type", "variable", "enum", "namespace"],

  // 忽略测试文件
  excludePatterns: ["**/*.test.ts", "**/*.spec.ts"],
};
```

### 生成报告

```bash
# 生成 Markdown 报告
tsnd --format markdown --output duplicate-report.md

# 生成 JSON 数据用于后续处理
tsnd --format json --output duplicates.json
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发环境

```bash

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 运行测试
pnpm test

# 构建
pnpm build
```

### 提交规范

使用 Conventional Commits 规范：

```bash
# 使用交互式提交
pnpm commit

# 版本发布
git commit -m "patch: 修复某个bug"  # 补丁版本
git commit -m "minor: 添加新功能"   # 次要版本
git commit -m "major: 破坏性变更"   # 主要版本
```

## 📄 许可证

MIT License

## 🙏 致谢

- [ts-morph](https://github.com/dsherret/ts-morph) - TypeScript AST 操作
- [commander](https://github.com/tj/commander.js) - 命令行工具
- [chalk](https://github.com/chalk/chalk) - 终端颜色输出
