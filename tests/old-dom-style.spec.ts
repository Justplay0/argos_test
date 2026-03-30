import { test, expect } from '@playwright/test';

/**
 * 【风格二：旧版 DOM 测试思维 (反面教材)】
 * 
 * 痛点展示：
 * 1. 结构脆弱：使用极度依赖 CSS 层级和 DOM 树结构的选择器。只要前端重构加了个 div，测试直接崩溃。
 * 2. 异步死等：大量使用 sleep (waitForTimeout)，无法感知 React 真实的渲染状态。
 * 3. 面条代码：所有的 DOM 查找、点击、断言都揉在同一个文件里，没有复用性。
 * 4. 无法测边界：它必须依赖真实后端返回的数据（这里我们强行去点第三个商品，假定第三个是无库存的）。
 */

test.describe('旧版 DOM 风格 E2E 测试 (反面教材)', () => {

  test('商品加入购物车流程 (结构极度脆弱版)', async ({ page }) => {
    // 痛点 2：异步死等。强行等待页面加载，而不知道网络请求是否真的完成
    await page.goto('/');
    await page.waitForTimeout(2000); // 垃圾做法：死等 2 秒

    // 痛点 1：结构脆弱。查户口式的定位器
    // 如果开发者把 .index-grid 改成了 .product-list，这个测试就挂了
    const firstProductBtn = page.locator('.layout-container > .layout-main > div.index-container > div.index-grid > div:nth-child(1) > div.product-card-content > div.product-card-footer > button.action-button-primary');
    
    // 点击按钮加入购物车
    await firstProductBtn.click();
    
    // 再次死等，假设这期间 React 已经把购物车数量更新了
    await page.waitForTimeout(1000);

    // 痛点 1：结构脆弱。定位右上角的购物车徽标
    const cartBadge = page.locator('header.header > div > div.cart-badge');
    await cartBadge.click();

    // 痛点 2：死等下拉框弹出动画
    await page.waitForTimeout(1000);

    // 断言购物车里有商品
    const cartItemName = page.locator('.cart-dropdown > div.cart-items-list > div.cart-item > div.cart-item-info > p.cart-item-name');
    await expect(cartItemName).toHaveText('Wireless Noise Cancelling Headphones');
  });

  test('边界测试困难：如何测 500 报错？', async ({ page }) => {
    // 痛点 3 & 4：旧版 DOM 测试无法轻易干预网络，也无法像 React 一样传 Props
    // 只能强行去访问一个不存在的路由（假设它能抛出 404）
    await page.goto('/product/invalid-id');
    await page.waitForTimeout(1000);
    
    const errorMsg = page.locator('.not-found-container > h2');
    await expect(errorMsg).toHaveText('Product not found');
    // 如果要测接口 500 崩溃的 UI，纯传统 DOM 手段基本无能为力
  });
});
