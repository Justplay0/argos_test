import { test } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';

test('React 首页视觉回归测试', async ({ page }) => {
  // 1. 访问本地页面 (会自动使用我们刚才在 playwright.config.ts 中配置的 baseURL http://localhost:5173)
  await page.goto('/');

  // 2. 确保页面完全加载 (等待网络空闲，防止页面还没渲染完就截图)
  await page.waitForLoadState('networkidle');

  // 3. 截取带有 Argos 标记的页面快照，并将这张截图命名为 "homepage"
  await argosScreenshot(page, 'homepage');
});