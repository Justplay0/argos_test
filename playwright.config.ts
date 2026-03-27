import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 核心配置文件
 * 官方文档：https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 1. 指定测试文件存放在哪个目录下。Playwright 会去这个目录找所有的测试代码
  testDir: './tests',

  // 2. 是否允许测试文件里的各个测试用例并行（同时）运行。true 表示可以，这样跑得更快
  fullyParallel: true,

  // 3. 这是一个安全机制。如果在代码里写了 `test.only`（只跑某一个测试），在 CI（比如 GitHub Actions）环境下会直接报错，防止把带 `.only` 的调试代码合并到线上。本地运行则允许。
  forbidOnly: !!process.env.CI,

  // 4. 测试失败后的重试次数。在 CI 环境下如果失败了会重试 2 次，本地调试时为了看错误原因，失败了就不重试（0次）。
  retries: process.env.CI ? 2 : 0,

  // 5. 并发运行的“工人”数量（也就是同时开几个浏览器跑测试）。CI 环境下通常资源有限，设置为 1（串行）；本地运行则根据你电脑的 CPU 核心数自动分配。
  workers: process.env.CI ? 1 : undefined,

  // 6. 测试结果报告器（Reporter）配置。决定了测试跑完后，以什么形式把结果展示给你。
  reporter: [
    // 6.1 终端里的输出格式：CI 环境用极简的 'dot'（一个个点），本地用详细的 'list'（列表显示每个用例名字）
    process.env.CI ? ['dot'] : ['list'],
    
    // 6.2 引入 Argos 报告器。它的作用是把测试中截取的图片自动上传到 Argos 平台进行视觉对比
    [
      '@argos-ci/playwright/reporter',
      {
        // 是否上传到 Argos 的开关：只有在 CI 环境下，或者本地运行且你手动设置了 ARGOS_TOKEN 环境变量时，才会触发上传操作。
        uploadToArgos: !!process.env.CI || !!process.env.ARGOS_TOKEN,
      },
    ],
    
    // 6.3 本地生成一份 HTML 格式的测试报告，跑完后可以打开网页看详细结果
    ['html']
  ],

  // 7. 全局共享配置（应用到所有浏览器项目上）
  use: {
    // 7.1 基础网址。配置了这个之后，测试代码里写 `page.goto('/')` 就会自动访问 `http://localhost:5173/`。
    // 这里 5173 是 Vite 默认启动的本地端口。
    baseURL: 'http://localhost:5173',

    // 7.2 收集“追踪(Trace)”文件的策略。Trace 包含了测试运行时的所有截图、网络请求和 DOM 树，是排查报错的神器。
    // 'on-first-retry' 意思是：只有在第一次重试的时候才收集，正常跑过就不收集，节省时间。
    trace: 'on-first-retry',
    
    // 7.3 截图策略。'only-on-failure' 意思是：只有当某个测试步骤失败报错了，才会自动截取当前屏幕的画面，方便你看“死在了什么画面”。
    screenshot: 'only-on-failure',
  },

  // 8. 浏览器项目配置。你可以配置在这里的多个浏览器里分别跑一遍相同的测试。
  projects: [
    {
      name: 'chromium', // 测试谷歌内核的浏览器（Chrome, Edge等）
      use: { ...devices['Desktop Chrome'] }, // 模拟桌面版 Chrome 的设备参数
    },

    {
      name: 'firefox', // 测试火狐浏览器
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit', // 测试苹果 Safari 浏览器的内核
      use: { ...devices['Desktop Safari'] },
    },

    /* 这里被注释掉的是移动端浏览器的测试配置，如果你想测试手机版网页，可以把注释解开 */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // 9. 自动启动本地服务器（Web Server）
  // 这个功能超级实用。有了它，运行测试前 Playwright 会自动帮你把项目启动起来，不用你手动去开另一个终端跑 npm run dev 了。
  webServer: {
    // 9.1 启动项目的命令（Vite 项目默认是 npm run dev）
    command: 'npm run dev',
    
    // 9.2 告诉 Playwright，通过不断检查这个 URL，来判断本地服务是不是已经启动成功、可以开始跑测试了
    url: 'http://localhost:5173',
    
    // 9.3 如果这个端口上已经有服务在跑了，要不要复用它？
    // 在本地环境（!process.env.CI 为 true）会复用你已经跑起来的 npm run dev；在 CI 环境则不会复用，确保每次环境干净。
    reuseExistingServer: !process.env.CI,
  },
});
