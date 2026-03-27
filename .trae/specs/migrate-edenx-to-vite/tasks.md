# Tasks

- [x] Task 1: 环境准备与依赖安装：在 `argos-test` 项目中安装 `react-router-dom` 及其类型定义。
  - [x] SubTask 1.1: 运行命令安装 `react-router-dom`。
- [x] Task 2: 迁移数据模型与状态管理层：将 `e2e_test` 中的数据和 Context 迁移过来。
  - [x] SubTask 2.1: 复制 `e2e_test/src/data/products.ts` 到 `argos-test/src/data/products.ts`。
  - [x] SubTask 2.2: 复制并调整 `e2e_test/src/context/CartContext.tsx` 到 `argos-test/src/context/CartContext.tsx`，在关键操作（如 `addToCart`）中添加规范的 `console.log`。
- [x] Task 3: 迁移 UI 组件层：完整迁移所有可复用组件及其样式。
  - [x] SubTask 3.1: 将 `e2e_test/src/components` 下的所有文件（`.tsx` 和 `.css`）复制到 `argos-test/src/components`。
  - [x] SubTask 3.2: 检查并修复所有组件内部的引入路径（如果需要）。
- [x] Task 4: 页面路由重构与全局布局集成：使用 `react-router-dom` 重建路由。
  - [x] SubTask 4.1: 创建 `argos-test/src/pages/Home.tsx`，将原 `e2e_test/src/routes/page.tsx` 和 `page.css` 的逻辑迁移过来，并替换 `@edenx/runtime/router` 的 `useNavigate` 为 `react-router-dom` 的。
  - [x] SubTask 4.2: 创建 `argos-test/src/pages/ProductDetail.tsx`，将原 `e2e_test/src/routes/product/[id]/page.tsx` 和 `page.css` 的逻辑迁移过来，同样替换路由 API。
  - [x] SubTask 4.3: 创建 `argos-test/src/layouts/MainLayout.tsx`，将原 `e2e_test/src/routes/layout.tsx` 的逻辑（包含 Header 和 `CartDropdown`）迁移过来，使用 `<Outlet />` 承载子路由。
  - [x] SubTask 4.4: 迁移全局样式，将原 `e2e_test/src/routes/index.css` 内容合并或替换到 `argos-test/src/index.css`。
- [x] Task 5: 顶层入口配置：在 `App.tsx` 和 `main.tsx` 中配置路由和 Provider。
  - [x] SubTask 5.1: 重写 `argos-test/src/App.tsx`，引入 `BrowserRouter`，配置路由表（根路由为 `MainLayout`，子路由为 `Home` 和 `ProductDetail`）。
  - [x] SubTask 5.2: 在 `argos-test/src/main.tsx` 或 `App.tsx` 中包裹 `<CartProvider>` 以提供全局状态。

# Task Dependencies
- Task 2 依赖于 Task 1
- Task 3 依赖于 Task 2（部分组件可能引用了类型或数据）
- Task 4 依赖于 Task 3 和 Task 2（页面需要使用组件、Context 和数据）
- Task 5 依赖于 Task 4（需要引入配置好的页面和 Layout 组件）
