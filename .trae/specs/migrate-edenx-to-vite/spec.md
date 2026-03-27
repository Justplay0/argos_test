# Migrate EdenX to Vite Spec

## Why
需要将现有的使用 EdenX 框架（类似 Modern.js，采用约定式路由）构建的前端 React + TS 项目 (`e2e_test`)，完整地迁移到一个纯净的 Vite + React + TS 项目 (`argos-test`) 中。目标是在 `argos-test` 中完全复现 `e2e_test` 的功能、UI 以及状态管理逻辑，以便在 Vite 环境下继续开发和测试。

## What Changes
- 将 `e2e_test` 中的业务代码（`components`, `context`, `data`, `routes` 等）迁移到 `argos-test` 的 `src` 目录下。
- **BREAKING**: 将 EdenX 的文件系统约定式路由 (`@edenx/runtime/router`) 替换为标准的 `react-router-dom`，并在 `argos-test` 中手动配置路由表。
- 在 `argos-test` 中安装 `react-router-dom` 依赖。
- 调整并整合 `App.tsx` 和 `main.tsx` 以支持全局路由和 Context Provider (`CartProvider`)。
- 在关键业务节点（如添加到购物车、路由跳转）添加符合规范的 `console.log` 输出以辅助调试。

## Impact
- Affected specs: 路由配置、状态管理注入、组件引入路径。
- Affected code: 
  - 新增：`src/components/*`, `src/context/*`, `src/data/*`, `src/pages/*` (由原 `routes` 迁移而来)
  - 修改：`src/App.tsx`, `src/main.tsx`, `package.json` (新增依赖)

## ADDED Requirements
### Requirement: 路由适配与页面重建
系统应当使用 `react-router-dom` 提供与原项目一致的页面导航功能。

#### Scenario: 首页展示与跳转
- **WHEN** 用户访问根路径 `/`
- **THEN** 应该展示包含商品列表的首页，布局包含全局的 Header（带有购物车图标）。
- **WHEN** 用户点击某个商品卡片
- **THEN** 应该跳转到对应的商品详情页 `/product/:id`。

### Requirement: 购物车状态管理
系统应当在 Vite 环境中复现全局的购物车状态管理。

#### Scenario: 添加商品到购物车
- **WHEN** 用户在商品详情页或列表页点击 "Add to Cart" 按钮
- **THEN** 商品应该被添加到全局购物车 Context 中，Header 上的购物车数量指示器应实时更新，同时控制台应输出规范的日志，例如：`[argos-test] [2026-03-27] [cart] - 添加商品，参数：{productId: "1"}, 结果：成功加入购物车，当前总数: 1`。

## MODIFIED Requirements
### Requirement: 样式引入与适配
原项目中直接引入的 CSS 文件（如 `ActionButton.css` 等）应当在 Vite 项目中正确引入并生效，不破坏原有样式。

## REMOVED Requirements
### Requirement: 移除 EdenX 特定配置与依赖
**Reason**: 目标项目是纯 Vite 环境，不需要也不支持 EdenX 的特定配置（如 `edenx.config.ts`, `edenx.runtime.ts`, `edenx-app-env.d.ts` 等）。
**Migration**: 仅迁移纯 React/TS 业务代码和样式文件，忽略上述 EdenX 配置文件。
