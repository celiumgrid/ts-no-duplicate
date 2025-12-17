# TypeScript Duplicate Detector

[中文文档](./README.zh-CN.md)

🔍 A powerful TypeScript cross-file duplicate name detection tool that helps you maintain naming consistency in your codebase.

## ✨ Features

- 🚀 **Fast Detection** - Efficient scanning based on TypeScript AST
- 🎯 **Multiple Type Support** - Detects functions, classes, interfaces, types, variables, enums, and namespaces
- 🔧 **Flexible Configuration** - Supports various filtering and rule configurations
- 📊 **Multiple Output Formats** - Console, JSON, and Markdown formats
- 🎨 **Beautiful Display** - Colorful output with clear hierarchical structure
- ⚙️ **Rule Engine** - Intelligently handles function overloads, cross-module duplicates, and more

## 📦 Installation

```bash
# Global installation
pnpm install -g @myceliumgrid/ts-no-duplicate

# Project installation
pnpm install --save-dev @myceliumgrid/ts-no-duplicate
```

## 🚀 Quick Start

```bash
# Basic usage
tsnd

# Specify config file
tsnd --config ts-no-duplicate.ts

# Output as JSON format
tsnd --format json

# Save report to file
tsnd --format markdown --output report.md
```

## ⚙️ Configuration

### Configuration File

Create `ts-no-duplicate.ts` in your project root:

```bash
# Auto-create config file using init command
tsnd init
# Or use full command
ts-no-duplicate init
# Or use npx
npx @myceliumgrid/ts-no-duplicate init
```

Configuration example:

```typescript
import type { DetectorOptions } from "@myceliumgrid/ts-no-duplicate";

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

### Configuration Options

#### Basic Configuration

| Option            | Type     | Default                   | Description                                             |
| ----------------- | -------- | ------------------------- | ------------------------------------------------------- |
| `tsConfigPath`    | string   | `"./tsconfig.json"`       | Path to TypeScript configuration file                   |
| `includeInternal` | boolean  | `false`                   | Whether to include internal (non-exported) declarations |
| `excludePatterns` | string[] | `["**/*.test.ts", ...]`   | File patterns to exclude                                |
| `includePatterns` | string[] | `["**/*.ts", "**/*.tsx"]` | File patterns to include                                |

#### Important Note about `tsConfigPath`

The `tsConfigPath` option specifies the path to your TypeScript configuration file, but note:

**✅ What it does:**

- Provides TypeScript compiler options (like `paths`, `baseUrl`, `strict`, etc.)
- Ensures the tool can correctly resolve path aliases (e.g., `@/lib/xxx` → `src/lib/xxx`)
- Provides type checking and module resolution configuration

**❌ What it doesn't control:**

- File scanning scope (doesn't use tsconfig.json's `include` and `exclude`)
- Which files to detect (controlled by `includePatterns` and `excludePatterns`)

**Why this design?**

This design allows the detection tool's configuration to be independent of your project's TypeScript configuration:

- Your project's tsconfig.json defines compilation scope (may include test files, scripts, etc.)
- The detection tool's configuration defines detection scope (usually only source code)
- They don't interfere with each other, providing more flexibility

**Example:**

```typescript
// tsconfig.json - Project compilation config
{
  "include": ["src", "tests", "scripts"],  // Compile all these directories
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }  // ← Detection tool will use this
  }
}

// ts-no-duplicate.ts - Detection tool config
{
  tsConfigPath: "./tsconfig.json",  // Read compiler options
  includePatterns: ["src/**/*.ts"],  // But only detect src directory
  excludePatterns: ["**/*.test.ts"]  // Exclude test files
}
```

#### Filter Configuration

| Option        | Type     | Default | Description                 |
| ------------- | -------- | ------- | --------------------------- |
| `ignoreTypes` | string[] | `[]`    | Declaration types to ignore |
| `ignoreNames` | string[] | `[]`    | Specific names to ignore    |

**Supported Declaration Types:**

- `function` - Functions
- `class` - Classes
- `interface` - Interfaces
- `type` - Type aliases
- `variable` - Variables
- `enum` - Enums
- `namespace` - Namespaces

#### Rule Configuration

| Option                       | Type    | Default | Description                                                             |
| ---------------------------- | ------- | ------- | ----------------------------------------------------------------------- |
| `allowSameFileOverloads`     | boolean | `true`  | Allow function overloads in the same file                               |
| `allowCrossModuleDuplicates` | boolean | `false` | Allow duplicates across modules                                         |
| `maxDuplicatesPerName`       | number  | `2`     | Limit the number of locations shown per duplicate group (0 = unlimited) |

**About `maxDuplicatesPerName`:**

This option limits the number of locations displayed in the report for each duplicate group, not the "allowed number of duplicates".

- If set to `2`, when there are 5 duplicates, only the first 2 locations will be shown in the report
- Setting to `0` or not setting means show all duplicate locations
- This option is mainly used to control report verbosity and avoid overly long output

## 🎯 Command Line Options

```bash
tsnd [options]

Commands:
  init                          Create default configuration file

Options:
  -c, --config <path>           Configuration file path
  -f, --format <format>         Output format (console|json|markdown) (default: "console")
  --output <file>               Output to file
  -h, --help                    Display help information
  -V, --version                 Display version number
```

> Note: All detection-related configuration options (such as include/exclude patterns, ignore types, etc.) can only be set through the configuration file, not via command line arguments.

## 📊 Output Formats

### Console Output

```
🔍 Starting TypeScript duplicate name detection...

📁 Scanning 45 files...

📊 Detection Report

Summary:
  Total Files: 45
  Total Declarations: 234
  Duplicate Groups: 3
  Duplicate Declarations: 8

❌ Found 3 duplicate name groups:

1. function "handleSubmit" (3 duplicates)
   ├─ src/components/Form.ts:15:2
   │    export function handleSubmit(data: FormData) {
   ├─ src/utils/form.ts:8:2
   │    function handleSubmit(formData: any) {
   └─ src/pages/Contact.ts:22:2
        const handleSubmit = (data: ContactForm) => {
```

### JSON Output

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

### Markdown Output

````markdown
# TypeScript Duplicate Name Detection Report

## Summary

- Total Files: 45
- Total Declarations: 234
- Duplicate Groups: 3
- Duplicate Declarations: 8

## Duplicate Name Details

### 1. `function` "handleSubmit" (3 duplicates)

- `src/components/Form.ts:15:2`
  ```typescript
  export function handleSubmit(data: FormData) {
  ```
````

## 🔧 Use Cases

### 1. Code Refactoring

Create a configuration file to detect duplicate names and avoid conflicts during large project refactoring:

```typescript
// ts-no-duplicate.ts
export default {
  includePatterns: ["src/**/*.ts"],
  excludePatterns: ["**/*.test.ts"],
};
```

Then run:

```bash
tsnd --config ts-no-duplicate.ts
```

### 2. Code Review

Integrate into CI/CD pipeline:

```bash
# Exit code will be 1 if duplicates are found
tsnd --format json > duplicates.json
```

### 3. Team Standards

Configure unified naming standards for your team:

```json
{
  "ignoreNames": ["index", "default", "config"],
  "rules": {
    "allowSameFileOverloads": true,
    "allowCrossModuleDuplicates": false
  }
}
```

## 🎨 Advanced Usage

### Custom Rules

```json
{
  "rules": {
    "allowSameFileOverloads": false,
    "allowCrossModuleDuplicates": true,
    "maxDuplicatesPerName": 1
  }
}
```

### Specific Type Detection

Configure in your config file:

```typescript
// ts-no-duplicate.ts
export default {
  // Only detect function duplicates, ignore other types
  ignoreTypes: ["class", "interface", "type", "variable", "enum", "namespace"],

  // Ignore test files
  excludePatterns: ["**/*.test.ts", "**/*.spec.ts"],
};
```

### Generate Reports

```bash
# Generate Markdown report
tsnd --format markdown --output duplicate-report.md

# Generate JSON data for further processing
tsnd --format json --output duplicates.json
```

## 🤝 Contributing

Issues and Pull Requests are welcome!

### Development Setup

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Run tests
pnpm test

# Build
pnpm build
```

### Commit Convention

Use Conventional Commits:

```bash
# Interactive commit
pnpm commit

# Version release
git commit -m "patch: fix some bug"    # Patch version
git commit -m "minor: add new feature" # Minor version
git commit -m "major: breaking change" # Major version
```

## 📄 License

MIT License

## 🙏 Acknowledgments

- [ts-morph](https://github.com/dsherret/ts-morph) - TypeScript AST manipulation
- [commander](https://github.com/tj/commander.js) - Command-line tool
- [chalk](https://github.com/chalk/chalk) - Terminal color output
