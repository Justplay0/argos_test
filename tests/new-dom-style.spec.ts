import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { HomePage } from './pages/HomePage';
import { HeaderBar } from './pages/HeaderBar';

/**
 * 【风格三：新版 DOM 测试思维 (业界最佳实践)】
 * 
 * 我们如何抹平传统 DOM 测试与 React 测试的 4 大差距？
 * 1. 语义化定位 (Semantic Locators)：利用 getByRole / getByTestId 抹平“结构脆弱性”，即使前端重构加了 div 也不怕。
 * 2. 自动等待 (Auto-waiting)：摒弃所有 sleep，依赖 Playwright 引擎级智能轮询，抹平“异步等待”的痛点。
 * 3. 网络拦截 (Network Mocking)：通过 page.route 截胡请求，直接造出报错/空数据的场景，抹平了“造边界数据难”的差距。
 * 4. 页面对象模型 (POM)：通过引入 HomePage / HeaderBar 类，让测试代码像 React 组件一样高内聚、可复用。
 * 5. 视觉回归 (Visual Regression)：结合 Argos，连 CSS 样式丢失这种逻辑断言测不出的盲区也抹平了。
 */

test.describe('新版 DOM 风格 E2E 测试 (最佳实践)', () => {

  test('商品加入购物车流程 (结构稳固、无死等、代码高复用)', async ({ page }) => {
    console.log('[argos-test] [2026-03-30] [E2E/Cart] - 开始测试正常的加入购物车流程');

    // 抹平痛点 4 (复用差)：使用 POM 实例化页面对象，代码清晰易懂
    const homePage = new HomePage(page);
    const headerBar = new HeaderBar(page);

    // 抹平痛点 2 (异步等待)：goto 内部封装了 waitForLoadState，保证页面加载完才往下走
    await homePage.goto();

    // 抹平痛点 1 (结构脆弱)：纯语义化点击。哪怕卡片结构大变，只要有这个商品名和 Add to Cart 按钮就能工作
    const targetProductName = 'Wireless Noise Cancelling Headphones';
    await homePage.addToCartByName(targetProductName);

    // 抹平痛点 1 (结构脆弱)：使用 data-testid 验证购物车数量更新
    await headerBar.expectCartCount('1');

    // 抹平痛点 2 (异步等待)：打开购物车，内部使用了 expect().toBeVisible()，引擎会自动等下拉框出现再执行下一步
    await headerBar.openCart();

    // 抹平痛点 1 (结构脆弱)：基于文本的断言
    await headerBar.expectItemInCart(targetProductName);

    // 抹平痛点 5 (视觉盲区)：使用 Argos 截取这一完美状态，防御未来的样式 Bug
    await argosScreenshot(page, 'new-dom-cart-with-item');
    
    console.log('[argos-test] [2026-03-30] [E2E/Cart] - 测试成功完成');
  });

  test('边界测试困难的解药：通过拦截网络模拟后端 500 报错', async ({ page }) => {
    console.log('[argos-test] [2026-03-30] [E2E/Network] - 开始测试后端崩溃时的页面边界状态');

    // 抹平痛点 3 (造边界数据难)：直接在网络层拦截！不需要真实后端配合。
    // 假设首页加载时会请求 /api/products (这里项目实际上是硬编码数据，所以我们用假想的拦截举例)
    // 但为了在这个 demo 里展示效果，我们拦截 Vite 的某些请求或者用一个通用的拦截机制
    // 这里我们用拦截一个假想接口展示理念：
    await page.route('**/api/products', async (route) => {
      console.log('[argos-test] [2026-03-30] [Network] - 成功截胡，强制返回 500');
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    // 即使是没有真实的 API，我们在处理图片加载失败时也可以用类似手法
    await page.route('**/*.{png,jpg,jpeg}', async (route) => {
      await route.abort(); // 模拟所有图片加载失败（断网）
    });

    await page.goto('/');

    // 此时页面上图片全挂了，我们可以用 Argos 拍下来，作为“断网/无图片时的降级 UI 基准图”
    await argosScreenshot(page, 'new-dom-broken-images-fallback');

    // 我们还可以验证图片的 alt 文本是否正确显示（语义化）
    const firstImageAlt = page.getByAltText('Wireless Noise Cancelling Headphones').first();
    await expect(firstImageAlt).toBeVisible();

    console.log('[argos-test] [2026-03-30] [E2E/Network] - 边界状态测试完成');
  });
});
