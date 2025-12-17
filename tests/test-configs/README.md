# 测试配置文件

此目录包含用于测试的固定配置文件，避免在测试中动态创建和删除临时文件。

## 配置文件说明

### ConfigLoader 测试

- `config-1.ts` - 完整配置示例，包含所有选项
- `config-2.ts` - 最小配置，只设置 includeInternal
- `config-3.ts` - 部分配置，测试配置合并
- `config-invalid.ts` - 无效的配置文件，测试错误处理

### API 测试

- `api-config.ts` - 基本 API 测试配置
- `api-ignore-types.ts` - 测试 ignoreTypes 选项

### CLI 测试

- `cli-basic.ts` - 基本 CLI 测试配置（有重复）
- `cli-no-duplicates.ts` - 无重复的测试配置
- `cli-ignore-types.ts` - 测试 ignoreTypes 选项
- `cli-include-internal.ts` - 测试 includeInternal 选项

## 注意事项

- 这些文件会被 Git 跟踪，不要在测试中修改它们
- 如果需要新的测试场景，添加新的配置文件而不是修改现有文件
- 所有路径使用相对于项目根目录的路径（如 `tests/fixtures/...`）
