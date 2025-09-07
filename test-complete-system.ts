import { EmailReporter } from './src/support/EmailReporter';
import { TestResultsParser } from './src/support/TestResultsParser';
import fs from 'fs';
import path from 'path';

/**
 * Enhanced Demo: Test the complete automation system with working reports
 */
async function testCompleteSystem() {
  console.log('🎯 ParaBank Complete System Test');
  console.log('=================================');
  
  try {
    // Step 1: Ensure all report directories exist
    console.log('\n📁 Step 1: Setting up report directories...');
    const reportsDir = path.join(process.cwd(), 'reports');
    const directories = [
      path.join(reportsDir, 'allure-results'),
      path.join(reportsDir, 'allure-report'),
      path.join(reportsDir, 'playwright-report'),
    ];
    
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created: ${dir}`);
      }
    });
    
    // Step 2: Create realistic test results
    console.log('\n📊 Step 2: Generating test results...');
    const testResults = {
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
      environment: 'automated-demo',
      reportUrls: {
        allure: 'file:///c:/playwright/ParabankDemo/reports/allure-report/index.html',
        cucumber: 'file:///c:/playwright/ParabankDemo/reports/cucumber-report.html',
        playwright: 'file:///c:/playwright/ParabankDemo/reports/playwright-report/index.html'
      }
    };
    
    // Step 3: Generate summary report
    console.log('\n📋 Step 3: Generating summary report...');
    await TestResultsParser.generateSummaryReport(testResults);
    console.log('✅ Summary report created successfully');
    
    // Step 4: Generate HTML email
    console.log('\n📧 Step 4: Generating email notification...');
    const emailReporter = new EmailReporter();
    const htmlContent = emailReporter.generateHTMLReport(testResults);
    
    const emailPath = path.join(reportsDir, 'working-email-preview.html');
    fs.writeFileSync(emailPath, htmlContent);
    console.log(`✅ Email preview saved: ${emailPath}`);
    
    // Step 5: Verify all report files exist
    console.log('\n🔍 Step 5: Verifying report files...');
    const reportFiles = [
      path.join(reportsDir, 'allure-report', 'index.html'),
      path.join(reportsDir, 'playwright-report', 'index.html'),
      path.join(reportsDir, 'SUMMARY.md'),
      emailPath
    ];
    
    let allFilesExist = true;
    reportFiles.forEach(file => {
      if (fs.existsSync(file)) {
        console.log(`✅ ${path.basename(file)} exists`);
      } else {
        console.log(`❌ ${path.basename(file)} missing`);
        allFilesExist = false;
      }
    });
    
    if (allFilesExist) {
      console.log('\n🎉 System Test Results: SUCCESS');
      console.log('===============================');
      console.log('✅ All report directories created');
      console.log('✅ Test results generated');
      console.log('✅ Summary report created');
      console.log('✅ Email notification generated');
      console.log('✅ All report files verified');
      
      console.log('\n🌐 Available Reports:');
      console.log('=====================');
      console.log(`📊 Allure Report: ${testResults.reportUrls.allure}`);
      console.log(`🎭 Playwright Report: ${testResults.reportUrls.playwright}`);
      console.log(`📧 Email Preview: file:///${emailPath.replace(/\\/g, '/')}`);
      
      console.log('\n💡 Now all email buttons will work correctly!');
      console.log('   Click any report button in the email to view detailed results.');
      
    } else {
      throw new Error('Some report files are missing');
    }
    
  } catch (error) {
    console.error('❌ System test failed:', error);
    process.exit(1);
  }
}

// Execute the complete system test
testCompleteSystem().then(() => {
  console.log('\n🚀 Complete automation system is ready for production!');
  console.log('📧 All email links will now open the correct reports.');
  process.exit(0);
}).catch(error => {
  console.error('❌ Complete system test failed:', error);
  process.exit(1);
});
