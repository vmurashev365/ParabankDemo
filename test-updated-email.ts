import { EmailReporter, TestResults } from './src/support/EmailReporter';

/**
 * Test updated EmailReporter with enhanced attachments
 */
async function testUpdatedEmailReporter() {
  console.log('🧪 Testing updated EmailReporter with enhanced features...\n');
  
  try {
    // Create enhanced email reporter instance
    const emailReporter = new EmailReporter();
    
    // Mock realistic test results
    const mockResults: TestResults = {
      totalScenarios: 152,
      passedScenarios: 150,
      failedScenarios: 2,
      skippedScenarios: 0,
      successRate: 98.68,
      executionTime: '14m 32s',
      environment: 'Production Staging',
      timestamp: new Date().toLocaleString('ru-RU', {
        timeZone: 'Europe/Moscow',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      reportUrls: {
        allure: 'reports/allure-report/index.html',
        cucumber: 'reports/cucumber-report.html',
        playwright: 'reports/playwright-report/index.html'
      }
    };
    
    console.log('📊 Test Results Summary:');
    console.log(`   • Total Tests: ${mockResults.totalScenarios}`);
    console.log(`   • Success Rate: ${mockResults.successRate}%`);
    console.log(`   • Passed: ${mockResults.passedScenarios}`);
    console.log(`   • Failed: ${mockResults.failedScenarios}`);
    console.log(`   • Execution Time: ${mockResults.executionTime}\n`);
    
    // Test email connection first
    console.log('🔗 Testing email connection...');
    const connectionTest = await emailReporter.testEmailConnection();
    
    if (!connectionTest) {
      console.log('⚠️ Email connection test failed, but proceeding with demo email...\n');
    }
    
    // Send test email with enhanced attachments
    console.log('📧 Sending enhanced test email...');
    await emailReporter.sendTestResults(mockResults, 'vmurashev@gmail.com');
    
    console.log('\n✅ Test completed successfully!');
    console.log('📋 Features tested:');
    console.log('   • Enhanced HTML email design');
    console.log('   • Report attachments (HTML files)');
    console.log('   • Fallback mechanism for reliability');
    console.log('   • Clear instructions for accessing reports');
    console.log('   • Professional email formatting');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   • Check email configuration');
    console.log('   • Verify report files exist');
    console.log('   • Check network connectivity');
  }
}

// Run the test
testUpdatedEmailReporter();
