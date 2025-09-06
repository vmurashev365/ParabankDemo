import { Before, After } from '@cucumber/cucumber';
import BrowserPoolManager from './BrowserPoolManager';

Before(async function(scenario) {
  console.log(`🚀 Enhanced test starting: ${scenario.pickle.name}`);
  
  // Browser initialization will happen in first step if needed
});

After(async function(scenario) {
  // Clean up browser from pool
  if (this.sessionId) {
    const browserPool = BrowserPoolManager.getInstance();
    await browserPool.releaseBrowser(this.sessionId);
  }
  
  const status = scenario.result?.status === 'PASSED' ? '✅ PASSED' : '❌ FAILED';
  const duration = scenario.result?.duration?.nanos ? Math.round(scenario.result.duration.nanos / 1000000) : 0;
  
  console.log(`🏁 Enhanced test completed: ${status} (${duration}ms)`);
});
