import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model (POM): HomePage
 * 将首页的商品列表操作抽象为一个类
 */
export class HomePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * 导航到首页，并等待网络空闲
   */
  async goto() {
    await this.page.goto('/');
    // 抹平异步等待：等待所有网络请求收敛，保证页面完全渲染
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * 根据商品名称，点击对应的 "Add to Cart" 按钮
   * 抹平结构脆弱：完全基于用户能看到的文本（商品名和按钮名）进行定位
   */
  async addToCartByName(productName: string) {
    // 找到包含特定商品名的那个商品卡片块
    const productCard = this.page.locator('.product-card').filter({ hasText: productName });
    
    // 在这个卡片块内部，找到写着 "Add to Cart" 的按钮并点击
    const addBtn = productCard.getByRole('button', { name: /Add to Cart/i });
    
    await addBtn.click();
  }
}
