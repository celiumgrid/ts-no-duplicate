/**
 * 重复检测器配置选项
 */
export interface DetectorOptions {
  /** TypeScript 配置文件路径 */
  tsConfigPath?: string
  /** 是否包含内部（非导出）声明 */
  includeInternal?: boolean
  /** 排除的文件模式（glob 格式） */
  excludePatterns?: string[]
  /** 包含的文件模式（glob 格式） */
  includePatterns?: string[]
  /** 忽略的声明类型 */
  ignoreTypes?: string[]
  /** 忽略的具体名称 */
  ignoreNames?: string[]
  /** 检测规则配置 */
  rules?: {
    /** 是否允许同文件内的函数重载 */
    allowSameFileOverloads?: boolean
    /** 是否允许跨模块重复 */
    allowCrossModuleDuplicates?: boolean
    /** 每个名称的最大重复数量 */
    maxDuplicatesPerName?: number
  }
}

/**
 * 重复检测报告
 */
export interface DuplicateReport {
  /** 检测摘要信息 */
  summary: {
    /** 扫描的文件总数 */
    totalFiles: number
    /** 声明总数 */
    totalDeclarations: number
    /** 重复组数 */
    duplicateGroups: number
    /** 重复声明数 */
    duplicateDeclarations: number
  }
  /** 重复项详情列表 */
  duplicates: DuplicateGroup[]
}

/**
 * 重复声明组
 */
export interface DuplicateGroup {
  /** 声明名称 */
  name: string
  /** 声明类型 */
  type: DeclarationType
  /** 重复次数 */
  count: number
  /** 所有重复位置 */
  locations: DeclarationLocation[]
}

/**
 * 声明位置信息
 */
export interface DeclarationLocation {
  /** 文件路径 */
  file: string
  /** 行号 */
  line: number
  /** 列号 */
  column: number
  /** 上下文代码片段 */
  context?: string
}

/**
 * 支持的声明类型
 */
export type DeclarationType = 'function' | 'class' | 'interface' | 'type' | 'variable' | 'enum' | 'namespace'
