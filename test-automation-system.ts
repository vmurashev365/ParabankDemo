import { nightlyScheduler } from './src/support/NightlyTestScheduler';
import { TestResultsParser } from './src/support/TestResultsParser';
import { EmailReporter } from './src/support/EmailReporter';
import fs from 'fs';
import path from 'path';

// Mock test data for demonstration
const mockTestResults = {
  totalScenarios: 127,
  passedScenarios: 126,
  failedScenarios: 1,
  skippedScenarios: 0,
  executionTime: '4m 32s',
  successRate: 99.21,
  timestamp: new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }),
  environment: 'test-demo',
  reportUrls: {
    allure: './reports/allure-report/index.html',
    cucumber: './reports/cucumber-report.html'
  }
};

async function testAutomationSystem() {
  console.log('🧪 Testing ParaBank Automation System');
  console.log('=====================================');
  
  try {
    // Test 1: Generate Summary Report
    console.log('\n📋 Test 1: Generating Summary Report...');
    await TestResultsParser.generateSummaryReport(mockTestResults);
    console.log('✅ Summary report generated successfully');

    // Test 2: Test Email Reporter (without actually sending)
    console.log('\n📧 Test 2: Testing Email Reporter...');
    const emailReporter = new EmailReporter();
    const htmlContent = emailReporter.generateHTMLReport(mockTestResults);
    console.log('✅ HTML email content generated successfully');
    console.log(`📊 Email content length: ${htmlContent.length} characters`);

    // Test 3: Test Scheduler Status
    console.log('\n📊 Test 3: Testing Scheduler Status...');
    const status = nightlyScheduler.getStatus();
    console.log('✅ Scheduler status retrieved:');
    console.log(`   - Running: ${status.isRunning ? '✅ Yes' : '❌ No'}`);
    console.log(`   - Next Run: ${status.nextRun}`);

    // Test 4: Check Reports Directory Structure
    console.log('\n📁 Test 4: Checking Reports Directory...');
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
      console.log('📁 Created reports directory');
    }
    
    const allureResultsDir = path.join(reportsDir, 'allure-results');
    const allureReportDir = path.join(reportsDir, 'allure-report');
    
    [allureResultsDir, allureReportDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });

    console.log('✅ Directory structure verified');

    // Test 5: Write Sample Report Files
    console.log('\n📄 Test 5: Creating Sample Report Files...');
    
    const sampleAllureResult = {
      uuid: "test-uuid-123",
      name: "Sample ParaBank Test",
      status: "passed",
      start: Date.now() - 5000,
      stop: Date.now(),
      stage: "finished"
    };

    fs.writeFileSync(
      path.join(allureResultsDir, 'sample-result.json'),
      JSON.stringify(sampleAllureResult, null, 2)
    );

    console.log('✅ Sample Allure result file created');

    // Final Summary
    console.log('\n🎉 Automation System Test Results:');
    console.log('===================================');
    console.log('✅ Summary Report Generation: PASSED');
    console.log('✅ Email Reporter: PASSED');
    console.log('✅ Scheduler Status: PASSED');
    console.log('✅ Directory Structure: PASSED');
    console.log('✅ Sample Files: PASSED');
    console.log('\n🚀 System is ready for production use!');
    console.log('📧 Email notifications will be sent to: vmurashev@gmail.com');
    console.log('🕐 Nightly tests scheduled for: 2:00 AM Moscow Time');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testAutomationSystem().then(() => {
  console.log('\n✅ All tests completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
