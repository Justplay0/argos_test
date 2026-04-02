import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
// Midscene 1.6+ 官方的类名是 PlaywrightAgent
import { PlaywrightAgent } from '@midscene/web/playwright';
import * as dotenv from 'dotenv';

// 加载环境变量，确保能读取到大模型的 API Key
dotenv.config();

test.describe('基于 Midscene AI 驱动的全量页面视觉回归测试', () => {
  // 因为 AI 推理（截取 DOM 树发给大模型、大模型返回坐标）需要时间，所以需要调大超时时间
  test.setTimeout(60000);

  // 1. 首页
  test('首页 (Home Page)', async ({ page }) => {
    const mid = new PlaywrightAgent(page);
    await page.goto('/');
    
    // 确保页面主体内容加载出来
    await mid.aiAssert('页面上有一个标题叫做 "Latest Releases" 或 "Latest Products"');
    
    await argosScreenshot(page, 'ai-homepage', { ariaSnapshot: true });
  });

  // 2. 详情页（有库存）
  test('商品详情页 - 有库存 (In Stock)', async ({ page }) => {
    const mid = new PlaywrightAgent(page);
    await page.goto('/');
    
    // 动作：让 AI 自己找第一个商品，点击进入详情页
    await mid.aiAction('点击商品列表中第一个商品的图片或标题，进入详情页');
    
    // 断言：AI 确认页面成功跳转，且该商品处于可购买状态
    await mid.aiAssert('页面展示了商品的详情信息，并且有一个 "Add to Cart" 按钮');
    
    await argosScreenshot(page, 'ai-product-detail-instock', { ariaSnapshot: true });
  });

  // 3. 详情页（无库存）
  test('商品详情页 - 无库存 (Out of Stock)', async ({ page }) => {
    const mid = new PlaywrightAgent(page);
    // 直接访问第三个商品（根据之前的逻辑，id为3的商品无库存）
    await page.goto('/product/3');
    
    // 断言：AI 确认页面状态为缺货
    await mid.aiAssert('页面上有一个 "Out of Stock" 按钮，且它看起来是置灰或不可点击的状态');
    
    await argosScreenshot(page, 'ai-product-detail-outofstock', { ariaSnapshot: true });
  });

  // 4. 购物车（空）
  test('购物车 - 空状态 (Empty Cart)', async ({ page }) => {
    const mid = new PlaywrightAgent(page);
    await page.goto('/');
    
    // 动作：点击购物车
    await mid.aiAction('点击页面右上角的购物车图标');
    
    // 断言：确认购物车为空
    await mid.aiAssert('弹出了购物车面板，且里面显示 "Your cart is empty" 类似的空状态提示文案');
    
    await argosScreenshot(page, 'ai-cart-dropdown-empty', { ariaSnapshot: true });
  });

  // 5. 购物车（有商品）
  test('购物车 - 有商品状态 (Cart with Items)', async ({ page }) => {
    const mid = new PlaywrightAgent(page);
    await page.goto('/');
    
    // 动作：加购并打开购物车（把两条命令合并在一起给 AI）
    await mid.aiAction('找到第一个商品，点击它卡片上的 "Add to Cart" 按钮，然后点击页面右上角的购物车图标');
    
    // 断言：确认加购成功
    await mid.aiAssert('弹出的购物车面板里至少有 1 件商品，并且显示了总价（Total）和一个 "Checkout" 按钮');
    
    await argosScreenshot(page, 'ai-cart-dropdown-with-items', { ariaSnapshot: true });
  });

  // 6. 404 页面
  test('404 商品未找到页面 (Not Found)', async ({ page }) => {
    const mid = new PlaywrightAgent(page);
    await page.goto('/product/invalid-id');
    
    // 断言：确认进入了 404 错误兜底页
    await mid.aiAssert('页面显示了 "Product not found" 或类似的 404 错误提示文案');
    
    await argosScreenshot(page, 'ai-product-not-found', { ariaSnapshot: true });
  });
});
