#!/usr/bin/env node

import { EmailReporter } from './src/support/EmailReporter';
import { TestResultsParser } from './src/support/TestResultsParser';

// Simulate realistic test results
const simulatedResults = {
  totalScenarios: 152,
  passedScenarios: 150,
  failedScenarios: 2,
  skippedScenarios: 0,
  executionTime: '5m 47s',
  successRate: 98.68,
  timestamp: new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }),
  environment: 'production-nightly',
  reportUrls: {
    allure: 'file:///c:/playwright/ParabankDemo/reports/allure-report/index.html',
    cucumber: 'file:///c:/playwright/ParabankDemo/reports/cucumber-report.html',
    playwright: 'file:///c:/playwright/ParabankDemo/reports/playwright-report/index.html'
  }
};

async function demonstrateEmailSystem() {
  console.log('📧 ParaBank Email Notification Demo');
  console.log('===================================');
  
  const emailReporter = new EmailReporter();
  
  console.log('🔧 Generating comprehensive test report...');
  const htmlContent = emailReporter.generateHTMLReport(simulatedResults);
  
  console.log('✅ Email report generated successfully!');
  console.log(`📊 Report Statistics:`);
  console.log(`   - HTML Length: ${htmlContent.length.toLocaleString()} characters`);
  console.log(`   - Success Rate: ${simulatedResults.successRate}%`);
  console.log(`   - Total Tests: ${simulatedResults.totalScenarios}`);
  console.log(`   - Execution Time: ${simulatedResults.executionTime}`);
  
  // Create a preview file
  const fs = require('fs');
  const path = require('path');
  
  const previewPath = path.join(process.cwd(), 'reports', 'email-preview.html');
  fs.writeFileSync(previewPath, htmlContent);
  
  console.log(`\n📄 Email preview saved to: ${previewPath}`);
  console.log('🌐 You can open this file in a browser to see the email content');
  
  // Generate summary
  await TestResultsParser.generateSummaryReport(simulatedResults);
  console.log('📋 Summary report updated with demo data');
  
  console.log('\n🎯 Email Notification Features:');
  console.log('================================');
  console.log('✅ Executive Summary with Status Icons');
  console.log('✅ Detailed Test Statistics Table');
  console.log('✅ Performance Analysis with Color Coding');
  console.log('✅ Interactive Report Links');
  console.log('✅ Professional HTML Styling');
  console.log('✅ Mobile-Responsive Design');
  console.log('✅ Automatic Report Attachments');
  
  console.log('\n📧 Ready for Production:');
  console.log('========================');
  console.log('🎯 Recipient: vmurashev@gmail.com');
  console.log('🕐 Schedule: Daily at 2:00 AM Moscow Time');
  console.log('📊 Reports: Allure + Cucumber + Playwright');
  console.log('🔄 Automated: Zero manual intervention required');
  
  console.log('\n🚀 To activate the system:');
  console.log('==========================');
  console.log('1. Update .env file with real Gmail credentials');
  console.log('2. Run: npm run automation:start');
  console.log('3. Monitor daily email reports');
  
  console.log('\n✨ Demo completed successfully!');
}

demonstrateEmailSystem().catch(console.error);
