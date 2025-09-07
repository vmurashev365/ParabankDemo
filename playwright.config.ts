import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration
 * Configured to bypass Cloudflare protection and work as real user
 */
export default defineConfig({
  testDir: './features',
  fullyParallel: false, // Let Cucumber manage parallelism
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1, // Playwright single worker since Cucumber handles parallelism
  reporter: [
    ['html'],
    ['json', { outputFile: 'reports/test-results.json' }]
  ],
  
  use: {
    // Browser settings to appear as real user
    headless: false, // Show browser to avoid headless detection
    
    // User agent and viewport
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    
    // Natural behavior settings
    actionTimeout: 30000, // Увеличиваем до 30 секунд
    navigationTimeout: 60000, // Увеличиваем до 60 секунд
    
    // Screenshots and video for debugging
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    
    // Bypass bot detection
    bypassCSP: true,
    ignoreHTTPSErrors: true,
    
    // Natural delays
    launchOptions: {
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-first-run',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--start-maximized'
      ],
      slowMo: 100, // Add 100ms delay between actions
    },
    
    // Extra headers to appear real
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome', // Use real Chrome browser
      },
    }
  ],

  // Development server (if needed)
  webServer: undefined,
});
