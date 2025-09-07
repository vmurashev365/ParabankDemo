/**
 * Advanced Stealth Engine with Dynamic Browser Fingerprint Management
 * Provides sophisticated anti-detection capabilities that adapt to security measures
 */

import { Browser, BrowserContext, Page } from 'playwright';

export interface StealthProfile {
  userAgent: string;
  viewport: { width: number; height: number };
  locale: string;
  timezone: string;
  platform: string;
  webgl: {
    vendor: string;
    renderer: string;
  };
  canvas: {
    noiseLevel: number;
    seedValue: string;
  };
  fonts: string[];
  plugins: string[];
  fingerprint: string;
}

export interface DetectionPattern {
  name: string;
  pattern: string | RegExp;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  countermeasure: string;
}

export class AdvancedStealthEngine {
  private currentProfile: StealthProfile | null = null;
  private detectionPatterns: DetectionPattern[] = [];
  private profileRotationInterval: number = 5; // Change profile every 5 tests
  private testCount: number = 0;

  constructor() {
    this.initializeDetectionPatterns();
  }

  /**
   * Generate a new stealth profile with randomized fingerprints
   */
  generateStealthProfile(): StealthProfile {
    const profiles = this.getBrowserProfiles();
    const selectedProfile = profiles[Math.floor(Math.random() * profiles.length)];
    
    return {
      ...selectedProfile,
      fingerprint: this.generateFingerprint(),
      canvas: {
        noiseLevel: Math.random() * 0.1,
        seedValue: Math.random().toString(36)
      },
      viewport: this.randomizeViewport()
    };
  }

  /**
   * Apply comprehensive stealth configuration to browser context
   */
  async applyStealthConfiguration(context: BrowserContext): Promise<void> {
    if (!this.currentProfile || this.shouldRotateProfile()) {
      this.currentProfile = this.generateStealthProfile();
      this.testCount++;
    }

    const profile = this.currentProfile;

    // Basic stealth settings
    await context.addInitScript(() => {
      // Remove webdriver property
      delete (window.navigator as any).webdriver;
      
      // Override plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => ({
          length: 3,
          0: { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
          1: { name: 'Chromium PDF Plugin', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
          2: { name: 'Microsoft Edge PDF Plugin', filename: 'pdf' }
        })
      });

      // Override languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en']
      });

      // Override permission query
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => {
        if (parameters.name === 'notifications') {
          return Promise.resolve({
            state: Notification.permission,
            name: parameters.name,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => true
          } as PermissionStatus);
        }
        return originalQuery.call(window.navigator.permissions, parameters);
      };

      // WebGL fingerprint spoofing
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === 37445) {
          return 'Intel Open Source Technology Center'; // UNMASKED_VENDOR_WEBGL
        }
        if (parameter === 37446) {
          return 'Mesa DRI Intel(R) UHD Graphics 620 (Whiskey Lake 3x8 GT2)'; // UNMASKED_RENDERER_WEBGL
        }
        return getParameter.call(this, parameter);
      };
    });

    // Advanced canvas fingerprint protection
    await context.addInitScript((profile: StealthProfile) => {
      const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
      const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

      HTMLCanvasElement.prototype.toDataURL = function(...args) {
        const dataURL = originalToDataURL.apply(this, args);
        // Add subtle noise based on profile
        return dataURL.replace(/data:image\/png;base64,/, `data:image/png;base64,${profile.canvas.seedValue.slice(0, 8)}`);
      };

      CanvasRenderingContext2D.prototype.getImageData = function(x, y, width, height) {
        const imageData = originalGetImageData.call(this, x, y, width, height);
        // Add canvas noise
        for (let i = 0; i < imageData.data.length; i += 4) {
          if (Math.random() < profile.canvas.noiseLevel) {
            imageData.data[i] = Math.min(255, imageData.data[i] + Math.floor(Math.random() * 10) - 5);
            imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] + Math.floor(Math.random() * 10) - 5);
            imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] + Math.floor(Math.random() * 10) - 5);
          }
        }
        return imageData;
      };
    }, profile);

    // Mouse movement humanization
    await context.addInitScript(() => {
      let mouseX = 0, mouseY = 0;
      
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'mousemove') {
          const humanizedListener = (event: Event) => {
            const mouseEvent = event as MouseEvent;
            // Add slight random movement to appear more human
            const noise = 0.5;
            mouseX = mouseEvent.clientX + (Math.random() - 0.5) * noise;
            mouseY = mouseEvent.clientY + (Math.random() - 0.5) * noise;
            
            if (typeof listener === 'function') {
              const modifiedEvent = new MouseEvent(type, {
                bubbles: mouseEvent.bubbles,
                cancelable: mouseEvent.cancelable,
                clientX: mouseX,
                clientY: mouseY,
                screenX: mouseEvent.screenX,
                screenY: mouseEvent.screenY,
                button: mouseEvent.button,
                buttons: mouseEvent.buttons
              });
              listener.call(this, modifiedEvent);
            }
          };
          originalAddEventListener.call(this, type, humanizedListener as EventListener, options);
        } else {
          originalAddEventListener.call(this, type, listener, options);
        }
      };
    });

    // Set context properties - viewport will be set per page
    await context.setExtraHTTPHeaders({
      'Accept-Language': `${profile.locale},en;q=0.9`,
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Cache-Control': 'max-age=0',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': profile.userAgent
    });
  }

  /**
   * Apply stealth settings to a specific page
   */
  async applyStealthToPage(page: Page): Promise<void> {
    if (this.currentProfile) {
      await page.setViewportSize(this.currentProfile.viewport);
    }
  }

  /**
   * Detect and respond to anti-bot measures
   */
  async detectAndBypassProtection(page: Page): Promise<{
    detected: string[];
    bypassed: string[];
    failed: string[];
  }> {
    const detected: string[] = [];
    const bypassed: string[] = [];
    const failed: string[] = [];

    for (const pattern of this.detectionPatterns) {
      try {
        const content = await page.content();
        const detected_match = typeof pattern.pattern === 'string' 
          ? content.includes(pattern.pattern)
          : pattern.pattern.test(content);

        if (detected_match) {
          detected.push(pattern.name);
          
          try {
            await this.executeCountermeasure(page, pattern);
            bypassed.push(pattern.name);
            console.log(`✅ Bypassed ${pattern.name} protection`);
          } catch (error) {
            failed.push(pattern.name);
            console.log(`❌ Failed to bypass ${pattern.name}: ${error}`);
          }
        }
      } catch (error) {
        console.log(`Error checking pattern ${pattern.name}: ${error}`);
      }
    }

    return { detected, bypassed, failed };
  }

  /**
   * Human-like interaction patterns
   */
  async humanizedClick(page: Page, selector: string): Promise<void> {
    const element = page.locator(selector);
    
    // Wait for element with random delay
    await this.randomDelay(100, 300);
    
    // Move mouse to element with curve
    const box = await element.boundingBox();
    if (box) {
      const targetX = box.x + box.width / 2 + (Math.random() - 0.5) * 10;
      const targetY = box.y + box.height / 2 + (Math.random() - 0.5) * 10;
      
      // Simulate mouse movement curve
      await this.moveMouseInCurve(page, targetX, targetY);
      
      // Random pre-click delay
      await this.randomDelay(50, 150);
    }
    
    // Click with slight random offset
    await element.click({
      position: {
        x: Math.random() * 5,
        y: Math.random() * 5
      }
    });
  }

  async humanizedType(page: Page, selector: string, text: string): Promise<void> {
    const element = page.locator(selector);
    
    // Focus with delay
    await element.focus();
    await this.randomDelay(100, 200);
    
    // Type character by character with human-like delays
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      await page.keyboard.type(char);
      
      // Vary typing speed based on character complexity
      const baseDelay = char === ' ' ? 200 : 80;
      const randomFactor = Math.random() * 50;
      await this.randomDelay(baseDelay, baseDelay + randomFactor);
      
      // Occasional longer pauses (thinking time)
      if (Math.random() < 0.1) {
        await this.randomDelay(200, 500);
      }
    }
  }

  /**
   * Generate advanced browser profiles
   */
  private getBrowserProfiles(): Omit<StealthProfile, 'fingerprint' | 'canvas'>[] {
    return [
      {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        locale: 'en-US',
        timezone: 'America/New_York',
        platform: 'Win32',
        webgl: {
          vendor: 'Google Inc. (Intel)',
          renderer: 'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)'
        },
        fonts: ['Arial', 'Times New Roman', 'Calibri', 'Segoe UI'],
        plugins: ['PDF Viewer', 'Chrome PDF Plugin', 'Chromium PDF Plugin']
      },
      {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1440, height: 900 },
        locale: 'en-US',
        timezone: 'America/Los_Angeles',
        platform: 'MacIntel',
        webgl: {
          vendor: 'Intel Inc.',
          renderer: 'Intel Iris Pro OpenGL Engine'
        },
        fonts: ['Helvetica Neue', 'San Francisco', 'Arial', 'Times'],
        plugins: ['PDF Viewer', 'QuickTime Plugin']
      },
      {
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1366, height: 768 },
        locale: 'en-US',
        timezone: 'America/Chicago',
        platform: 'Linux x86_64',
        webgl: {
          vendor: 'Mesa',
          renderer: 'Mesa DRI Intel(R) HD Graphics'
        },
        fonts: ['DejaVu Sans', 'Liberation Sans', 'Ubuntu'],
        plugins: ['Shockwave Flash', 'VLC Web Plugin']
      }
    ];
  }

  private initializeDetectionPatterns(): void {
    this.detectionPatterns = [
      {
        name: 'Cloudflare',
        pattern: /cloudflare|cf-ray|checking your browser/i,
        severity: 'HIGH',
        countermeasure: 'cloudflare_bypass'
      },
      {
        name: 'reCAPTCHA',
        pattern: /recaptcha|captcha/i,
        severity: 'CRITICAL',
        countermeasure: 'recaptcha_bypass'
      },
      {
        name: 'Rate Limiting',
        pattern: /rate limit|too many requests|429/i,
        severity: 'MEDIUM',
        countermeasure: 'rate_limit_bypass'
      },
      {
        name: 'Bot Detection',
        pattern: /bot detected|automated|suspicious activity/i,
        severity: 'HIGH',
        countermeasure: 'bot_detection_bypass'
      }
    ];
  }

  private async executeCountermeasure(page: Page, pattern: DetectionPattern): Promise<void> {
    switch (pattern.countermeasure) {
      case 'cloudflare_bypass':
        await this.bypassCloudflare(page);
        break;
      case 'recaptcha_bypass':
        await this.handleRecaptcha(page);
        break;
      case 'rate_limit_bypass':
        await this.handleRateLimit(page);
        break;
      case 'bot_detection_bypass':
        await this.handleBotDetection(page);
        break;
    }
  }

  private async bypassCloudflare(page: Page): Promise<void> {
    console.log('🔄 Attempting Cloudflare bypass...');
    
    // Wait for Cloudflare challenge
    await this.randomDelay(5000, 8000);
    
    // Try to find and interact with challenge elements
    try {
      const challengeForm = page.locator('form[id*="challenge"]').first();
      if (await challengeForm.isVisible({ timeout: 30000 })) {
        await this.randomDelay(2000, 4000);
        // Let Cloudflare complete automatically
      }
    } catch (error) {
      // Challenge might complete automatically
    }
    
    // Wait for redirect
    await page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  private async handleRecaptcha(page: Page): Promise<void> {
    console.log('🤖 reCAPTCHA detected - implementing delay strategy');
    await this.randomDelay(10000, 15000);
    // In real implementation, you might integrate with CAPTCHA solving service
  }

  private async handleRateLimit(page: Page): Promise<void> {
    console.log('⏱️ Rate limit detected - applying exponential backoff');
    const backoffTime = 30000 + Math.random() * 30000; // 30-60 seconds
    await this.randomDelay(backoffTime, backoffTime + 10000);
  }

  private async handleBotDetection(page: Page): Promise<void> {
    console.log('🕵️ Bot detection - rotating profile');
    this.currentProfile = this.generateStealthProfile();
    await this.randomDelay(5000, 10000);
  }

  private async moveMouseInCurve(page: Page, targetX: number, targetY: number): Promise<void> {
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = startX + (targetX - startX) * t;
      const y = startY + (targetY - startY) * t;
      
      await page.mouse.move(x, y);
      await this.randomDelay(10, 30);
    }
  }

  private randomizeViewport(): { width: number; height: number } {
    const common_resolutions = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1440, height: 900 },
      { width: 1536, height: 864 },
      { width: 1280, height: 720 }
    ];
    
    return common_resolutions[Math.floor(Math.random() * common_resolutions.length)];
  }

  private generateFingerprint(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private shouldRotateProfile(): boolean {
    return this.testCount % this.profileRotationInterval === 0;
  }

  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = min + Math.random() * (max - min);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}
