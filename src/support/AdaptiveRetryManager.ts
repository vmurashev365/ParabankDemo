/**
 * Adaptive Retry System with Exponential Backoff
 * Intelligently handles transient failures with context-aware retry strategies
 */

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  exponentialBase: number;
  jitterFactor: number;
  retryableErrors: string[];
  contextSpecificRules: Map<string, Partial<RetryConfig>>;
}

export interface RetryAttempt {
  attempt: number;
  delay: number;
  error: Error | null;
  timestamp: string;
  context: string;
}

export interface RetryResult<T> {
  success: boolean;
  result?: T;
  attempts: RetryAttempt[];
  totalDuration: number;
  finalError?: Error;
}

export class AdaptiveRetryManager {
  private defaultConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    exponentialBase: 2,
    jitterFactor: 0.1,
    retryableErrors: [
      'TimeoutError',
      'NetworkError', 
      'CloudflareError',
      'ElementNotFoundError',
      'NavigationTimeout',
      'Target closed',
      'Connection refused'
    ],
    contextSpecificRules: new Map([
      ['browser_spawn', {
        maxRetries: 5,
        baseDelay: 2000,
        maxDelay: 15000
      }],
      ['navigation', {
        maxRetries: 4,
        baseDelay: 3000,
        maxDelay: 20000
      }],
      ['element_interaction', {
        maxRetries: 3,
        baseDelay: 500,
        maxDelay: 5000
      }],
      ['cloudflare_bypass', {
        maxRetries: 6,
        baseDelay: 5000,
        maxDelay: 45000,
        exponentialBase: 1.5
      }]
    ])
  };

  constructor(customConfig?: Partial<RetryConfig>) {
    if (customConfig) {
      this.defaultConfig = { ...this.defaultConfig, ...customConfig };
    }
  }

  /**
   * Execute function with adaptive retry logic
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string = 'default',
    customConfig?: Partial<RetryConfig>
  ): Promise<RetryResult<T>> {
    const config = this.getConfigForContext(context, customConfig);
    const attempts: RetryAttempt[] = [];
    const startTime = Date.now();

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      const attemptStart = Date.now();
      
      try {
        const result = await operation();
        
        attempts.push({
          attempt,
          delay: 0,
          error: null,
          timestamp: new Date().toISOString(),
          context
        });

        return {
          success: true,
          result,
          attempts,
          totalDuration: Date.now() - startTime
        };

      } catch (error) {
        const errorObj = error as Error;
        const shouldRetry = this.shouldRetry(errorObj, attempt, config);
        
        attempts.push({
          attempt,
          delay: 0,
          error: errorObj,
          timestamp: new Date().toISOString(),
          context
        });

        if (!shouldRetry || attempt === config.maxRetries) {
          return {
            success: false,
            attempts,
            totalDuration: Date.now() - startTime,
            finalError: errorObj
          };
        }

        // Calculate adaptive delay
        const delay = this.calculateDelay(attempt, config, context, errorObj);
        attempts[attempts.length - 1].delay = delay;
        
        console.log(`🔄 Retry ${attempt + 1}/${config.maxRetries} for ${context} after ${delay}ms - ${errorObj.message}`);
        await this.sleep(delay);
      }
    }

    // Should never reach here, but TypeScript needs it
    throw new Error('Unexpected retry loop termination');
  }

  /**
   * Specialized retry for browser operations
   */
  async retryBrowserOperation<T>(
    operation: () => Promise<T>,
    operationType: 'spawn' | 'navigation' | 'interaction' | 'cleanup'
  ): Promise<T> {
    const contextMap = {
      spawn: 'browser_spawn',
      navigation: 'navigation', 
      interaction: 'element_interaction',
      cleanup: 'cleanup'
    };

    const result = await this.executeWithRetry(
      operation,
      contextMap[operationType]
    );

    if (!result.success) {
      throw new Error(`Browser ${operationType} failed after ${result.attempts.length} attempts: ${result.finalError?.message}`);
    }

    return result.result!;
  }

  /**
   * Circuit breaker pattern for repeated failures
   */
  createCircuitBreaker<T>(
    operation: () => Promise<T>,
    context: string,
    failureThreshold: number = 5,
    resetTimeout: number = 60000
  ) {
    let failures = 0;
    let lastFailureTime = 0;
    let state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

    return async (): Promise<T> => {
      const now = Date.now();

      // Reset circuit breaker after timeout
      if (state === 'OPEN' && now - lastFailureTime > resetTimeout) {
        state = 'HALF_OPEN';
        failures = 0;
      }

      if (state === 'OPEN') {
        throw new Error(`Circuit breaker OPEN for ${context} - too many failures`);
      }

      try {
        const result = await this.executeWithRetry(operation, context);
        
        if (result.success) {
          // Reset on success
          if (state === 'HALF_OPEN') {
            state = 'CLOSED';
          }
          failures = 0;
          return result.result!;
        } else {
          throw result.finalError || new Error('Operation failed');
        }

      } catch (error) {
        failures++;
        lastFailureTime = now;

        if (failures >= failureThreshold) {
          state = 'OPEN';
          console.log(`⚡ Circuit breaker OPENED for ${context} after ${failures} failures`);
        }

        throw error;
      }
    };
  }

  /**
   * Smart delay calculation based on context and error type
   */
  private calculateDelay(
    attempt: number,
    config: RetryConfig,
    context: string,
    error: Error
  ): number {
    let baseDelay = config.baseDelay;

    // Error-specific delay adjustments
    if (error.message.includes('Cloudflare') || error.message.includes('Rate limit')) {
      baseDelay *= 3; // Longer delays for rate limiting
    } else if (error.message.includes('Network') || error.message.includes('timeout')) {
      baseDelay *= 1.5; // Moderate delays for network issues
    }

    // Context-specific multipliers
    const contextMultipliers: Record<string, number> = {
      'cloudflare_bypass': 2.0,
      'browser_spawn': 1.5,
      'navigation': 1.2,
      'element_interaction': 0.8
    };

    const multiplier = contextMultipliers[context] || 1.0;
    baseDelay *= multiplier;

    // Exponential backoff
    const exponentialDelay = baseDelay * Math.pow(config.exponentialBase, attempt);
    
    // Add jitter to prevent thundering herd
    const jitter = exponentialDelay * config.jitterFactor * (Math.random() - 0.5);
    const finalDelay = Math.min(exponentialDelay + jitter, config.maxDelay);

    return Math.max(finalDelay, 0);
  }

  private shouldRetry(error: Error, attempt: number, config: RetryConfig): boolean {
    if (attempt >= config.maxRetries) {
      return false;
    }

    // Check if error type is retryable
    const isRetryable = config.retryableErrors.some(retryableError => 
      error.name.includes(retryableError) || 
      error.message.includes(retryableError)
    );

    // Never retry certain critical errors
    const nonRetryablePatterns = [
      'Authentication failed',
      'Permission denied',
      'Invalid credentials',
      'Access forbidden',
      'Page not found'
    ];

    const isNonRetryable = nonRetryablePatterns.some(pattern => 
      error.message.includes(pattern)
    );

    return isRetryable && !isNonRetryable;
  }

  private getConfigForContext(
    context: string,
    customConfig?: Partial<RetryConfig>
  ): RetryConfig {
    const contextConfig = this.defaultConfig.contextSpecificRules.get(context);
    
    return {
      ...this.defaultConfig,
      ...contextConfig,
      ...customConfig
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate retry performance report
   */
  generateRetryReport(attempts: RetryAttempt[][]): {
    totalOperations: number;
    successfulOperations: number;
    averageRetries: number;
    mostProblematicContexts: string[];
    recommendations: string[];
  } {
    const totalOperations = attempts.length;
    const successfulOperations = attempts.filter(ops => 
      ops[ops.length - 1].error === null
    ).length;

    const totalRetries = attempts.reduce((sum, ops) => sum + (ops.length - 1), 0);
    const averageRetries = totalRetries / totalOperations;

    // Analyze contexts with most retries
    const contextRetries: Record<string, number> = {};
    attempts.forEach(ops => {
      const context = ops[0]?.context || 'unknown';
      contextRetries[context] = (contextRetries[context] || 0) + (ops.length - 1);
    });

    const mostProblematicContexts = Object.entries(contextRetries)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([context]) => context);

    const recommendations: string[] = [];
    
    if (averageRetries > 1) {
      recommendations.push('High retry rate - investigate root causes');
    }
    
    if (successfulOperations / totalOperations < 0.95) {
      recommendations.push('Success rate below 95% - review error handling');
    }

    mostProblematicContexts.forEach(context => {
      recommendations.push(`Optimize retry strategy for context: ${context}`);
    });

    return {
      totalOperations,
      successfulOperations,
      averageRetries,
      mostProblematicContexts,
      recommendations
    };
  }
}

// Usage example in step definitions:
/*
const retryManager = new AdaptiveRetryManager();

// Browser spawn with retries
await retryManager.retryBrowserOperation(
  () => this.initBrowser(),
  'spawn'
);

// Navigation with retries  
await retryManager.retryBrowserOperation(
  () => this.page.goto(url),
  'navigation'
);

// Element interaction with retries
await retryManager.retryBrowserOperation(
  () => this.page.click('button'),
  'interaction'
);
*/
