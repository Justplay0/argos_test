import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model (POM): HeaderBar
 * 将顶部导航栏和购物车的操作抽象为一个类
 */
export class HeaderBar {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartCount: Locator;
  readonly cartDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    // 使用预先埋好的 data-testid，或者语义化属性，抹平结构脆弱性
    this.cartBadge = page.getByTestId('cart-badge');
    this.cartCount = page.getByTestId('cart-count');
    // 尽量使用语义化文本定位
    this.cartDropdown = page.locator('.cart-dropdown'); // 如果有更好的 role/testid 优先用，这里演示过渡期用法
  }

  /**
   * 打开购物车下拉框
   */
  async openCart() {
    await this.cartBadge.click();
    // 依赖 Playwright 的 Auto-waiting 自动等待下拉框出现，无需 sleep
    await expect(this.cartDropdown).toBeVisible();
  }

  /**
   * 断言购物车角标数量
   */
  async expectCartCount(expectedCount: string) {
    await expect(this.cartCount).toHaveText(expectedCount);
  }

  /**
   * 断言购物车内是否包含特定商品
   */
  async expectItemInCart(itemName: string) {
    // 基于文本内容的语义化断言：只要下拉框里出现了这个商品名就算对
    await expect(this.cartDropdown.getByText(itemName)).toBeVisible();
  }
}
