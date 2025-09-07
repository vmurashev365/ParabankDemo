import * as cron from 'node-cron';
import { exec } from 'child_process';
import { EmailReporter } from './EmailReporter';
import { TestResultsParser } from './TestResultsParser';
import fs from 'fs';
import path from 'path';

export class NightlyTestScheduler {
  private emailReporter: EmailReporter;
  private isRunning: boolean = false;

  constructor() {
    this.emailReporter = new EmailReporter();
    console.log('🌙 Nightly Test Scheduler initialized');
  }

  /**
   * Start the nightly test scheduler
   * Default: Runs every night at 2:00 AM Moscow time
   */
  start(cronExpression: string = '0 2 * * *'): void {
    console.log(`🕐 Scheduling nightly tests: ${cronExpression} (Moscow Time)`);
    
    cron.schedule(cronExpression, async () => {
      if (this.isRunning) {
        console.log('⏳ Previous test run still in progress, skipping...');
        return;
      }

      console.log('🌙 Starting nightly test execution...');
      await this.executeNightlyTests();
    }, {
      timezone: "Europe/Moscow"
    });

    console.log('✅ Nightly test scheduler started successfully');
  }

  /**
   * Execute manual test run (for testing purposes)
   */
  async runManualTest(): Promise<void> {
    console.log('🔧 Starting manual test execution...');
    await this.executeNightlyTests();
  }

  private async executeNightlyTests(): Promise<void> {
    this.isRunning = true;
    const startTime = new Date();
    
    try {
      console.log('🚀 Beginning test execution suite...');
      
      // Ensure reports directory exists
      this.ensureReportsDirectory();
      
      // Run Cucumber tests with Allure reporting
      console.log('🥒 Executing Cucumber tests...');
      await this.runCucumberTests();
      
      // Run Playwright tests with Allure reporting
      console.log('🎭 Executing Playwright tests...');
      await this.runPlaywrightTests();
      
      // Generate Allure reports
      console.log('📊 Generating Allure reports...');
      await this.generateAllureReports();
      
      // Parse test results
      console.log('📋 Parsing test results...');
      const results = await this.parseResults();
      
      // Generate summary report
      await TestResultsParser.generateSummaryReport(results);
      
      // Send email notification
      console.log('📧 Sending email notification...');
      await this.emailReporter.sendTestResults(results);
      
      const endTime = new Date();
      const totalDuration = ((endTime.getTime() - startTime.getTime()) / 1000 / 60).toFixed(2);
      
      console.log(`✅ Nightly test execution completed successfully in ${totalDuration} minutes`);
      console.log(`📊 Results: ${results.passedScenarios}/${results.totalScenarios} scenarios passed (${results.successRate.toFixed(2)}%)`);
      
    } catch (error) {
      console.error('❌ Nightly test execution failed:', error);
      
      // Send failure notification
      await this.sendFailureNotification(error as Error);
      
    } finally {
      this.isRunning = false;
    }
  }

  private ensureReportsDirectory(): void {
    const reportsDir = path.join(process.cwd(), 'reports');
    const allureResultsDir = path.join(reportsDir, 'allure-results');
    const allureReportDir = path.join(reportsDir, 'allure-report');
    
    [reportsDir, allureResultsDir, allureReportDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }

  private async runCucumberTests(): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = 'npx cucumber-js --config=cucumber.allure.js --profile=nightly';
      
      exec(command, { 
        cwd: process.cwd(),
        env: { 
          ...process.env, 
          NODE_ENV: 'nightly',
          CUCUMBER_PUBLISH_QUIET: 'true'
        }
      }, (error, stdout, stderr) => {
        if (stderr) {
          console.log('🥒 Cucumber output:', stderr);
        }
        if (stdout) {
          console.log('🥒 Cucumber results:', stdout);
        }
        
        // Don't reject on test failures, only on execution errors
        if (error && !error.message.includes('scenarios failed')) {
          console.error('❌ Cucumber execution error:', error);
          reject(error);
        } else {
          console.log('✅ Cucumber tests completed');
          resolve();
        }
      });
    });
  }

  private async runPlaywrightTests(): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = 'npx playwright test --config=playwright.allure.config.ts';
      
      exec(command, { 
        cwd: process.cwd(),
        env: { 
          ...process.env, 
          NODE_ENV: 'nightly',
          CI: 'true'
        }
      }, (error, stdout, stderr) => {
        if (stderr) {
          console.log('🎭 Playwright output:', stderr);
        }
        if (stdout) {
          console.log('🎭 Playwright results:', stdout);
        }
        
        // Don't reject on test failures, only on execution errors
        if (error && !error.message.includes('failed')) {
          console.error('❌ Playwright execution error:', error);
          reject(error);
        } else {
          console.log('✅ Playwright tests completed');
          resolve();
        }
      });
    });
  }

  private async generateAllureReports(): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = 'npx allure generate reports/allure-results --clean -o reports/allure-report';
      
      exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Allure report generation failed:', error);
          reject(error);
        } else {
          console.log('📊 Allure reports generated successfully');
          if (stdout) console.log(stdout);
          resolve();
        }
      });
    });
  }

  private async parseResults(): Promise<any> {
    const allureResultsPath = path.join(process.cwd(), 'reports', 'allure-results');
    const cucumberReportPath = path.join(process.cwd(), 'reports', 'cucumber-report.json');
    
    // Try to parse from different sources
    if (fs.existsSync(allureResultsPath) && fs.readdirSync(allureResultsPath).length > 0) {
      console.log('📊 Parsing Allure results...');
      return TestResultsParser.parseAllureResults(allureResultsPath);
    } else if (fs.existsSync(cucumberReportPath)) {
      console.log('📊 Parsing Cucumber results...');
      return TestResultsParser.parseeCucumberResults(cucumberReportPath);
    } else {
      console.log('⚠️ No test results found, generating default results');
      return TestResultsParser.parseAllureResults(allureResultsPath); // This will return default results
    }
  }

  private async sendFailureNotification(error: Error): Promise<void> {
    try {
      const failureResults = {
        totalScenarios: 0,
        passedScenarios: 0,
        failedScenarios: 1,
        skippedScenarios: 0,
        executionTime: '0s',
        successRate: 0,
        timestamp: new Date().toLocaleString('en-US', {
          timeZone: 'Europe/Moscow',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        environment: 'nightly',
        reportUrls: {},
        errorMessage: error.message
      };

      await this.emailReporter.sendTestResults(failureResults);
      console.log('📧 Failure notification sent');
    } catch (emailError) {
      console.error('❌ Failed to send failure notification:', emailError);
    }
  }

  /**
   * Schedule test for immediate execution (useful for testing)
   */
  scheduleImmediate(): void {
    console.log('⚡ Scheduling immediate test execution...');
    setTimeout(() => {
      this.executeNightlyTests();
    }, 5000); // Run after 5 seconds
  }

  /**
   * Get scheduler status
   */
  getStatus(): { isRunning: boolean; nextRun?: string } {
    return {
      isRunning: this.isRunning,
      nextRun: '2:00 AM Moscow Time (Daily)'
    };
  }
}

// Export a singleton instance
export const nightlyScheduler = new NightlyTestScheduler();
