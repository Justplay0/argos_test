import { test, expect } from '@playwright/experimental-ct-react';
import { ProductCard } from '../src/components/ProductCard';

/**
 * 【风格一：React 组件级测试思维 (声明式/状态驱动)】
 * 
 * 核心特征：
 * 1. 关注点在“组件”和“状态（Props）”。
 * 2. 根本不需要启动整个项目路由、不需要跑完整的 E2E 流程（如登录、跳转到首页）。
 * 3. 直接利用 Playwright CT 语法把组件“挂载 (mount)”到空白的虚拟 DOM 中。
 * 4. 轻松测试极其极端的边界条件（比如：即使不改数据库，我也能直接测无库存的状态）。
 */

test.describe('React 组件级风格测试', () => {

  // 造一个假的数据对象（Mock State）
  const mockProduct = {
    id: 'test-1',
    name: 'Test Headphone',
    price: 99.99,
    description: 'A mock description',
    image: 'https://via.placeholder.com/150',
    tags: ['Sale'],
    inStock: true, // 初始状态为有库存
  };

  test('状态驱动：当商品有库存时，应显示 Add to Cart', async ({ mount }) => {
    // 1. 挂载组件，直接传入 Props
    const component = await mount(
      <ProductCard product={mockProduct} />
    );

    // 2. 验证基于当前 Props 渲染出的 UI
    // 注意：即使是在组件测试里，我们也推荐用语义化定位（getByRole），而不是用 .action-button
    await expect(component.getByRole('button', { name: 'Add to Cart' })).toBeVisible();
    await expect(component.getByRole('button', { name: 'Add to Cart' })).toBeEnabled();
  });

  test('状态驱动：当商品无库存时，应显示 Out of Stock 并禁用按钮', async ({ mount }) => {
    // 1. 轻松制造“无库存”的边界情况（直接改 Props）
    const outOfStockProduct = { ...mockProduct, inStock: false };
    
    const component = await mount(
      <ProductCard product={outOfStockProduct} />
    );

    // 2. 断言结果
    await expect(component.getByText('Out of Stock')).toBeVisible();
    await expect(component.getByRole('button', { name: 'Notify Me' })).toBeDisabled();
  });
});
