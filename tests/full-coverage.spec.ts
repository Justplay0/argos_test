import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';

test.describe('全量页面视觉回归测试', () => {
  // 1. 首页
  test('首页 (Home Page)', async ({ page }) => {
    await page.goto('/');
    // 等待所有网络请求完成（如图片加载）
    await page.waitForLoadState('networkidle');
    await argosScreenshot(page, 'homepage');
  });

  // 2. 详情页（有库存）
  test('商品详情页 - 有库存 (In Stock)', async ({ page }) => {
    await page.goto('/product/1');
    await page.waitForLoadState('networkidle');
    // 确保页面加载出具体内容
    await expect(page.locator('.detail-title')).toBeVisible();
    await argosScreenshot(page, 'product-detail-instock');
  });

  // 3. 详情页（无库存）
  test('商品详情页 - 无库存 (Out of Stock)', async ({ page }) => {
    await page.goto('/product/3');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.detail-title')).toBeVisible();
    // 确保显示 Out of Stock 按钮
    await expect(page.locator('button', { hasText: 'Out of Stock' })).toBeVisible();
    await argosScreenshot(page, 'product-detail-outofstock');
  });

  // 4. 购物车（空）
  test('购物车 - 空状态 (Empty Cart)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 点击购物车徽标展开下拉框
    await page.click('[data-testid="cart-badge"]');
    // 等待下拉框元素出现
    await page.waitForSelector('.cart-dropdown');
    // 确保空状态文案可见
    await expect(page.locator('.cart-empty-message')).toBeVisible();
    
    await argosScreenshot(page, 'cart-dropdown-empty');
  });

  // 5. 购物车（有商品）
  test('购物车 - 有商品状态 (Cart with Items)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 找到第一个商品卡片，点击 Add to Cart
    await page.click('[data-testid="product-card-1"] button');
    
    // 点击购物车徽标展开下拉框
    await page.click('[data-testid="cart-badge"]');
    await page.waitForSelector('.cart-dropdown');
    // 确保购物车内有商品
    await expect(page.locator('.cart-item')).toBeVisible();
    
    await argosScreenshot(page, 'cart-dropdown-with-items');
  });

  // 6. 404 页面
  test('404 商品未找到页面 (Not Found)', async ({ page }) => {
    await page.goto('/product/invalid-id');
    await page.waitForLoadState('networkidle');
    
    // 确保显示未找到的提示
    await expect(page.locator('.not-found-container')).toBeVisible();
    await argosScreenshot(page, 'product-not-found');
  });
});
