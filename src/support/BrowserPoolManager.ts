/**
 * Browser Pool Manager
 * Контролирует максимальное количество одновременно запущенных браузеров
 */

import { Browser, BrowserContext, Page, chromium } from 'playwright';

class BrowserPoolManager {
  private static instance: BrowserPoolManager;
  private activeBrowsers: Map<string, Browser> = new Map();
  private maxBrowsers: number = 5; // Максимум 5 браузеров
  private waitingQueue: Array<() => void> = [];

  private constructor() {}

  static getInstance(): BrowserPoolManager {
    if (!BrowserPoolManager.instance) {
      BrowserPoolManager.instance = new BrowserPoolManager();
    }
    return BrowserPoolManager.instance;
  }

  async acquireBrowser(sessionId: string): Promise<Browser> {
    console.log(`🎯 Requesting browser for session: ${sessionId}`);
    console.log(`📊 Active browsers: ${this.activeBrowsers.size}/${this.maxBrowsers}`);

    // Если браузер уже существует для этой сессии, возвращаем его
    if (this.activeBrowsers.has(sessionId)) {
      console.log(`♻️  Reusing existing browser for session: ${sessionId}`);
      return this.activeBrowsers.get(sessionId)!;
    }

    // СТРОГАЯ ПРОВЕРКА: НЕ ПРЕВЫШАЕМ ЛИМИТ
    if (this.activeBrowsers.size >= this.maxBrowsers) {
      console.log(`⏳ БЛОКИРУЕМ создание браузера! Лимит ${this.maxBrowsers} достигнут (${this.activeBrowsers.size})`);
      
      // Ждем до 30 секунд освобождения слота
      const startTime = Date.now();
      while (this.activeBrowsers.size >= this.maxBrowsers && (Date.now() - startTime) < 30000) {
        console.log(`⏳ Ожидаем освобождения браузера... (${this.activeBrowsers.size}/${this.maxBrowsers})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Если все еще превышен лимит - выбрасываем ошибку
      if (this.activeBrowsers.size >= this.maxBrowsers) {
        throw new Error(`BROWSER POOL LIMIT EXCEEDED: ${this.activeBrowsers.size}/${this.maxBrowsers}`);
      }
    }

    // Создаем новый браузер
    const browser = await this.createStealthBrowser();
    this.activeBrowsers.set(sessionId, browser);
    
    console.log(`✅ Created new browser for session: ${sessionId} (${this.activeBrowsers.size}/${this.maxBrowsers})`);
    return browser;
  }

  async releaseBrowser(sessionId: string): Promise<void> {
    const browser = this.activeBrowsers.get(sessionId);
    if (browser) {
      await browser.close();
      this.activeBrowsers.delete(sessionId);
      console.log(`🗑️  Released browser for session: ${sessionId} (${this.activeBrowsers.size}/${this.maxBrowsers})`);
      
      // Уведомляем ожидающих
      if (this.waitingQueue.length > 0) {
        const nextWaiting = this.waitingQueue.shift();
        if (nextWaiting) nextWaiting();
      }
    }
  }

  private async waitForSlot(): Promise<void> {
    return new Promise((resolve) => {
      this.waitingQueue.push(resolve);
    });
  }

  private async createStealthBrowser(): Promise<Browser> {
    const browserOptions = {
      headless: false,
      slowMo: 300, // Увеличиваем задержку для более естественного поведения
      args: [
        // Core anti-detection arguments
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--no-first-run',
        '--start-maximized',
        '--disable-dev-shm-usage',
        
        // Enhanced Cloudflare bypass - MAXIMUM STEALTH
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-plugins-discovery',
        '--disable-extensions-file-access-check',
        '--disable-extensions-http-throttling',
        '--aggressive-cache-discard',
        '--disable-component-extensions-with-background-pages',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-pings',
        '--password-store=basic',
        '--use-mock-keychain',
        '--disable-gpu-sandbox',
        '--disable-software-rasterizer',
        '--log-level=3',
        '--silent-debugger-extension-api',
        
        // Additional Cloudflare evasion
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-domain-reliability',
        '--disable-features=TranslateUI',
        '--disable-hang-monitor',
        '--disable-prompt-on-repost',
        '--disable-background-networking',
        '--disable-breakpad',
        '--disable-preconnect',
        '--disable-prefetch',
        '--disable-chrome-tracing',
        '--disable-logging',
        '--disable-web-resources',
        '--disable-desktop-notifications',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-print-preview',
        '--disable-speech-api',
        '--disable-file-system',
        '--disable-presentation-api',
        '--disable-permissions-api',
        '--disable-new-bookmark-apps',
        '--disable-new-avatar-menu',
        '--disable-new-profile-management',
        '--disable-new-task-manager',
        '--disable-search-geolocation-disclosure',
        '--no-experiments',
        '--no-proxy-server',
        '--allow-running-insecure-content',
        '--ignore-certificate-errors',
        '--ignore-ssl-errors',
        '--ignore-certificate-errors-spki-list',
        '--ignore-certificate-errors-skip-list',
        '--disable-site-isolation-trials',
        '--disable-features=VizServiceDisplayCompositor,VizDisplayCompositor,UseSurfaceLayerForVideo',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--no-zygote',
        
        // Latest Chrome user agent
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      ]
    };

    const browser = await chromium.launch(browserOptions);
    
    return browser;
  }

  async closeAllBrowsers(): Promise<void> {
    console.log(`🧹 Closing all browsers (${this.activeBrowsers.size})`);
    const closePromises = Array.from(this.activeBrowsers.values()).map(browser => browser.close());
    await Promise.all(closePromises);
    this.activeBrowsers.clear();
  }

  getActiveBrowserCount(): number {
    return this.activeBrowsers.size;
  }
}

export default BrowserPoolManager;
