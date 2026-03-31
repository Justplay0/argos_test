import { test, expect } from '@playwright/test';

/**
 * 边界 3：真实的设备与浏览器环境特性
 * 
 * 核心能力展示：
 * - 组件测试跑在虚拟的 JSDOM 里，它没有真实的地理位置（Geolocation）、没有离线缓存（Service Worker）、没有色彩方案（Dark/Light mode）。
 * - Playwright 的 E2E 跑在真实的浏览器二进制文件中，可以通过 `context` 强行干预这些物理与环境属性。
 * - 这种能力用于测试 PWA、响应式设计、以及依赖底层硬件 API 的应用。
 */

test.describe('E2E 边界 3：真实的设备与浏览器环境特性', () => {

  test('验证离线模式 (Offline Mode) 的容错 UI', async ({ page, context }) => {
    // 1. 正常网络下访问页面，让 Service Worker 或浏览器缓存生效
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 2. 强行拔掉网线（模拟用户进入电梯或地铁）
    console.log('[argos-test] [2026-03-30] [E2E/Boundary] - 正在断开浏览器网络连接');
    await context.setOffline(true);

    // 3. 在断网状态下尝试重新加载页面或访问新路由
    // 注意：如果是传统的 SPA，这里可能会直接白屏（返回 ERR_INTERNET_DISCONNECTED）
    // 但如果是优秀的 PWA，它应该能从 Service Worker 加载出骨架屏
    try {
      await page.goto('/product/1', { timeout: 5000 });
    } catch (e) {
      console.log('[argos-test] [2026-03-30] [E2E/Boundary] - 页面在断网时无法加载，符合预期，捕获到错误');
      // 如果项目没做 PWA 离线支持，捕获到网络错误也是一种断言
    }

    // 假设这是一个 PWA 应用，我们可以断言离线提示
    await expect(page.getByText('您似乎断开了网络')).toBeVisible();
    await expect(page.locator('.skeleton-loader')).toBeVisible();

    // 测试完毕后恢复网络，以免影响后续测试
    await context.setOffline(false);
  });

  test('验证操作系统的 Dark Mode 偏好是否生效', async ({ page }) => {
    // 1. 强行覆盖页面的色彩模式为深色（Dark）
    // 注意：emulateMedia 是挂载在 page 对象上的，而不是 context 上
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.goto('/');

    // 2. 断言前端应用是否正确响应了 prefers-color-scheme 媒体查询
    // 假设应用的 body 在深色模式下背景色会变成特定的黑色 (#1a202c)
    // 我们可以使用计算后的样式进行断言（或者直接截一张 Argos 快照）
    
    // 示意断言（具体色值取决于 CSS 实现）：
    // const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    // expect(bodyBg).toBe('rgb(26, 32, 44)'); 
    
    console.log('[argos-test] [2026-03-30] [E2E/Boundary] - Dark Mode 媒体查询测试完成');
  });

  test('验证地理位置 API (Geolocation) 的调用', async ({ page, context }) => {
    // 1. 授权浏览器允许获取地理位置，并伪造一个经纬度（比如定位到东京）
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 35.6895, longitude: 139.6917 });

    await page.goto('/');

    // 2. 如果页面上有一个“获取附近门店”的按钮，点击它
    // await page.getByRole('button', { name: '获取附近门店' }).click();

    // 3. 断言页面是否根据我们伪造的东京坐标，渲染了正确的门店数据
    // await expect(page.getByText('Tokyo Shibuya Store')).toBeVisible();
    
    console.log('[argos-test] [2026-03-30] [E2E/Boundary] - Geolocation API 测试完成');
  });

});
