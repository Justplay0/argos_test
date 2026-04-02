import { test } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { PlaywrightAgent } from '@midscene/web/playwright';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('基于 Midscene 的连贯业务流测试 (Playbook)', () => {
  // 这是一个包含多个步骤的长流程测试，给大模型充足的思考时间
  test.setTimeout(240000); 

  test('电商核心购物全链路及异常兜底测试', async ({ page }) => {
    // 实例化 AI 操作员
    const ai = new PlaywrightAgent(page);

    await test.step('1. 访问首页并验证核心文案', async () => {
      await page.goto('/');
      // AI 智能视觉断言，代替了复杂的 expect(page.getByText(...)).toBeVisible()
      await ai.aiAssert('页面上的大标题包含 "Latest Releases" 或者 "Latest Products"');
    });

    await test.step('2. 验证购物车初始为空', async () => {
      // 核心修改：使用 ai() 代替过时的 aiAction()
      await ai.ai('点击页面右上角的购物车图标，打开购物车面板');
      await ai.aiAssert('弹出的购物车面板里是空的，有一句类似 "Your cart is empty" 的提示');
      
      // 操作完毕后关掉面板，免得挡住后面的商品
      await ai.ai('点击关闭按钮或点击页面空白处，收起购物车面板');
    });

    await test.step('3. 将第一个商品加入购物车', async () => {
      await ai.ai('在商品列表里，找到第一个商品卡片，点击它上面的 "Add to Cart" 按钮');
    });

    await test.step('4. 尝试加购无库存商品并验证标签', async () => {
      // 在之前的截图中我们知道第三个商品（手表）是无库存的
      await ai.aiAssert('商品列表中，第三个商品（或者那个 Smart Fitness Watch）卡片上有一个明显的 "Out of Stock" 标签');
      
      // 让 AI 尝试去点击，或者验证它不可点击
      await ai.aiAssert('这个无库存商品的按钮上写着 "Notify Me" 或类似的文案，并且是禁用（disabled）状态的，无法加入购物车');
    });

    await test.step('5. 购物车商品增量至 5 件并验证总价', async () => {
      await ai.ai('再次点击页面右上角的购物车图标，打开购物车面板');
      
      // 核心复杂交互：让 AI 连续点击增加数量的按钮
      await ai.ai('在购物车面板里，找到刚才添加的商品，连续点击它旁边的 "+" 按钮（或者数量增加按钮）4 次，把数量加到 5 件');
      
      // 验证总价是否输出
      await ai.aiAssert('购物车面板底部输出了 "Total" 总价，并且总价的数字明显变大了（正确计算了 5 件的价格）');
      
      // 留下视觉回归的关键快照
      await argosScreenshot(page, 'cart-with-5-items', { ariaSnapshot: true });
    });

    await test.step('6. 404 异常页面及返回首页兜底链路', async () => {
      // 模拟用户输入了错误的 URL 或点击了死链
      await page.goto('/product/invalid-id');
      
      await ai.aiAssert('页面提示了 "Product not found" 或类似的 404 错误');
      
      // AI 自动寻找返回首页的链接
      await ai.ai('点击页面上的 "Back to Home" 按钮或者链接');
      
      // 验证是否成功返回了首页
      await ai.aiAssert('页面成功跳转，再次看到了 "Latest Releases" 或 "Latest Products" 这个首页大标题');
    });
  });
});
