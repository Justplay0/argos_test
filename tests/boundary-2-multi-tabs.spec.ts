import { test, expect } from '@playwright/test';

/**
 * 边界 2：持久化状态与多标签页协同
 * 
 * 核心能力展示：
 * - Playwright 的 `context` 代表一个隔离的浏览器会话（类似于隐身模式）。
 * - 在同一个 `context` 下，你可以同时打开多个 `page`（即标签页 Tab）。
 * - 这些标签页共享 LocalStorage、SessionStorage 和 Cookies。
 * - 这种能力用于测试“多开防串号”、“跨标签页通信（BroadcastChannel）”等高级前端架构场景。
 */

test.describe('E2E 边界 2：持久化状态与多标签页协同', () => {

  test('验证 LocalStorage 在多标签页间的状态同步', async ({ context }) => {
    // 1. 在当前会话（Context）中打开第一个标签页
    const page1 = await context.newPage();
    await page1.goto('/');
    
    // 2. 在第一个标签页中操作（例如：将商品加入购物车）
    // 假设应用的购物车数据是保存在 LocalStorage 里的
    const addBtn = page1.locator('.product-card').first().getByRole('button', { name: /Add to Cart/i });
    await addBtn.click();
    
    // 验证标签页 1 的购物车数量为 1
    await expect(page1.getByTestId('cart-count')).toHaveText('1');

    // 3. 在同一个浏览器会话中，新开第二个标签页（模拟用户右键“在新标签页中打开”）
    console.log('[argos-test] [2026-03-30] [E2E/Boundary] - 正在创建新的标签页以测试状态持久化');
    const page2 = await context.newPage();
    await page2.goto('/');

    // 4. 断言核心边界能力：第二个标签页是否继承了第一个标签页的持久化状态？
    // 如果应用正确使用了 LocalStorage 或 IndexedDB，新开的页面应该直接显示购物车里有 1 件商品
    await expect(page2.getByTestId('cart-count')).toHaveText('1');

    // 进阶场景：如果你的 React 应用使用了 Window 'storage' 事件监听
    // 我们甚至可以测试“不刷新页面的状态同步”：
    
    // 在页面 2 再加一件商品
    await page2.locator('.product-card').nth(1).getByRole('button', { name: /Add to Cart/i }).click();
    await expect(page2.getByTestId('cart-count')).toHaveText('2');

    // 切回页面 1，断言页面 1 的 UI 自动更新成了 2（不需要主动刷新页面 1）
    await page1.bringToFront();
    await expect(page1.getByTestId('cart-count')).toHaveText('2');
  });
});
