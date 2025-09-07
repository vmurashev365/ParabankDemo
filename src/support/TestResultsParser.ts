import fs from 'fs';
import path from 'path';
import { TestResults } from './EmailReporter';

export class TestResultsParser {
  
  static parseeCucumberResults(reportPath: string): TestResults {
    console.log('📊 Parsing Cucumber test results...');
    
    try {
      const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      
      let totalScenarios = 0;
      let passedScenarios = 0;
      let failedScenarios = 0;
      let skippedScenarios = 0;
      let totalDuration = 0;

      reportData.forEach((feature: any) => {
        feature.elements?.forEach((scenario: any) => {
          if (scenario.type === 'scenario') {
            totalScenarios++;
            
            const steps = scenario.steps || [];
            const hasFailedStep = steps.some((step: any) => step.result?.status === 'failed');
            const hasSkippedStep = steps.some((step: any) => step.result?.status === 'skipped');
            const allPassed = steps.every((step: any) => step.result?.status === 'passed');

            if (hasFailedStep) {
              failedScenarios++;
            } else if (hasSkippedStep) {
              skippedScenarios++;
            } else if (allPassed) {
              passedScenarios++;
            }

            // Calculate duration
            steps.forEach((step: any) => {
              if (step.result?.duration) {
                totalDuration += step.result.duration;
              }
            });
          }
        });
      });

      const successRate = totalScenarios > 0 ? (passedScenarios / totalScenarios) * 100 : 0;
      const executionTime = this.formatDuration(totalDuration);

      return {
        totalScenarios,
        passedScenarios,
        failedScenarios,
        skippedScenarios,
        executionTime,
        successRate,
        timestamp: new Date().toLocaleString('en-US', {
          timeZone: 'Europe/Moscow',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        environment: process.env.NODE_ENV || 'test',
        reportUrls: {
          cucumber: './reports/cucumber-report.html',
          allure: './reports/allure-report/index.html'
        }
      };

    } catch (error) {
      console.error('❌ Error parsing Cucumber results:', error);
      return this.getDefaultResults();
    }
  }

  static parsePlaywrightResults(reportPath: string): TestResults {
    console.log('📊 Parsing Playwright test results...');
    
    try {
      const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      
      const totalScenarios = reportData.suites?.reduce((total: number, suite: any) => {
        return total + (suite.specs?.length || 0);
      }, 0) || 0;

      const passedScenarios = reportData.suites?.reduce((total: number, suite: any) => {
        return total + (suite.specs?.filter((spec: any) => 
          spec.tests?.every((test: any) => test.results?.every((result: any) => result.status === 'passed'))
        ).length || 0);
      }, 0) || 0;

      const failedScenarios = totalScenarios - passedScenarios;
      const successRate = totalScenarios > 0 ? (passedScenarios / totalScenarios) * 100 : 0;

      return {
        totalScenarios,
        passedScenarios,
        failedScenarios,
        skippedScenarios: 0,
        executionTime: this.formatDuration(reportData.stats?.duration || 0),
        successRate,
        timestamp: new Date().toLocaleString('en-US', {
          timeZone: 'Europe/Moscow',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        environment: process.env.NODE_ENV || 'test',
        reportUrls: {
          playwright: './reports/playwright-report/index.html',
          allure: './reports/allure-report/index.html'
        }
      };

    } catch (error) {
      console.error('❌ Error parsing Playwright results:', error);
      return this.getDefaultResults();
    }
  }

  static parseAllureResults(resultsDir: string): TestResults {
    console.log('📊 Parsing Allure test results...');
    
    try {
      const resultsFiles = fs.readdirSync(resultsDir)
        .filter(file => file.endsWith('-result.json'));
      
      let totalScenarios = 0;
      let passedScenarios = 0;
      let failedScenarios = 0;
      let skippedScenarios = 0;
      let totalDuration = 0;

      resultsFiles.forEach(file => {
        const resultData = JSON.parse(
          fs.readFileSync(path.join(resultsDir, file), 'utf-8')
        );
        
        totalScenarios++;
        totalDuration += resultData.stop - resultData.start;

        switch (resultData.status) {
          case 'passed':
            passedScenarios++;
            break;
          case 'failed':
          case 'broken':
            failedScenarios++;
            break;
          case 'skipped':
            skippedScenarios++;
            break;
        }
      });

      const successRate = totalScenarios > 0 ? (passedScenarios / totalScenarios) * 100 : 0;

      return {
        totalScenarios,
        passedScenarios,
        failedScenarios,
        skippedScenarios,
        executionTime: this.formatDuration(totalDuration * 1000000), // Convert to nanoseconds
        successRate,
        timestamp: new Date().toLocaleString('en-US', {
          timeZone: 'Europe/Moscow',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        environment: process.env.NODE_ENV || 'test',
        reportUrls: {
          allure: './reports/allure-report/index.html'
        }
      };

    } catch (error) {
      console.error('❌ Error parsing Allure results:', error);
      return this.getDefaultResults();
    }
  }

  private static formatDuration(nanoseconds: number): string {
    const seconds = Math.floor(nanoseconds / 1000000000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  private static getDefaultResults(): TestResults {
    return {
      totalScenarios: 0,
      passedScenarios: 0,
      failedScenarios: 0,
      skippedScenarios: 0,
      executionTime: '0s',
      successRate: 0,
      timestamp: new Date().toLocaleString(),
      environment: 'unknown',
      reportUrls: {}
    };
  }

  static async generateSummaryReport(results: TestResults): Promise<void> {
    console.log('📋 Generating summary report...');
    
    const summaryReport = `
# ParaBank Test Execution Summary

## 📊 Test Results Overview
- **Execution Time**: ${results.timestamp}
- **Environment**: ${results.environment}
- **Total Duration**: ${results.executionTime}

## 🎯 Test Statistics
- **Total Scenarios**: ${results.totalScenarios}
- **Passed**: ${results.passedScenarios} ✅
- **Failed**: ${results.failedScenarios} ❌
- **Skipped**: ${results.skippedScenarios} ⏭️
- **Success Rate**: ${results.successRate.toFixed(2)}%

## 📈 Performance Analysis
${results.successRate >= 95 ? 
  '🎉 **EXCELLENT**: All tests passing successfully!' : 
  results.successRate >= 80 ? 
  '⚠️ **WARNING**: Some test failures detected.' : 
  '🚨 **CRITICAL**: Multiple test failures require immediate attention.'
}

## 📄 Available Reports
${Object.entries(results.reportUrls).map(([type, url]) => `- [${type.toUpperCase()} Report](${url})`).join('\n')}

---
*Generated by ParaBank Unified Test Framework v3.0*
`;

    const summaryPath = path.join(process.cwd(), 'reports', 'SUMMARY.md');
    fs.writeFileSync(summaryPath, summaryReport);
    console.log(`✅ Summary report saved to: ${summaryPath}`);
  }
}
