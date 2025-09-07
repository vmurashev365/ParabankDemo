#!/usr/bin/env node

import { EmailReporter } from './src/support/EmailReporter';
import { TestResultsParser } from './src/support/TestResultsParser';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test email sending functionality
 */
async function testEmailSending() {
  console.log('📧 ParaBank Email System Test');
  console.log('=============================');
  
  // Check environment variables
  const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'RECIPIENT_EMAIL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n💡 To fix this:');
    console.error('1. Update .env file with real Gmail credentials:');
    console.error('   EMAIL_USER=your-email@gmail.com');
    console.error('   EMAIL_PASS=your-16-char-app-password');
    console.error('2. Get Gmail App Password:');
    console.error('   - Enable 2FA in Google Account');
    console.error('   - Go to "App passwords" in settings');
    console.error('   - Generate password for "Mail"');
    console.error('3. Run: npm run email:test');
    return;
  }
  
  console.log('✅ Environment configuration found');
  console.log(`📧 From: ${process.env.EMAIL_USER}`);
  console.log(`📫 To: ${process.env.RECIPIENT_EMAIL}`);
  console.log(`🌐 SMTP: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
  
  // Check if credentials look real
  if (process.env.EMAIL_USER?.includes('test-email') || 
      process.env.EMAIL_PASS?.includes('test-app-password')) {
    console.warn('\n⚠️  WARNING: Detected test credentials!');
    console.warn('Current settings:');
    console.warn(`   EMAIL_USER: ${process.env.EMAIL_USER}`);
    console.warn(`   EMAIL_PASS: ${process.env.EMAIL_PASS?.substring(0, 4)}...`);
    console.warn('\n❌ These won\'t work for real email sending.');
    console.warn('Please update .env with real Gmail credentials.');
    return;
  }
  
  try {
    // Create realistic test results
    const testResults = {
      totalScenarios: 152,
      passedScenarios: 149,
      failedScenarios: 3,
      skippedScenarios: 0,
      executionTime: '6m 12s',
      successRate: 98.03,
      timestamp: new Date().toLocaleString('en-US', {
        timeZone: 'Europe/Moscow',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      environment: 'email-test',
      reportUrls: {
        allure: 'file:///c:/playwright/ParabankDemo/reports/allure-report/index.html',
        cucumber: 'file:///c:/playwright/ParabankDemo/reports/cucumber-report.html',
        playwright: 'file:///c:/playwright/ParabankDemo/reports/playwright-report/index.html'
      }
    };
    
    console.log('\n📊 Preparing test results...');
    console.log(`   - Total Scenarios: ${testResults.totalScenarios}`);
    console.log(`   - Success Rate: ${testResults.successRate}%`);
    console.log(`   - Duration: ${testResults.executionTime}`);
    
    console.log('\n📧 Sending email notification...');
    const emailReporter = new EmailReporter();
    
    // This will actually attempt to send the email
    await emailReporter.sendTestResults(testResults);
    
    console.log('✅ Email sent successfully!');
    console.log(`📫 Check inbox: ${process.env.RECIPIENT_EMAIL}`);
    console.log('\n🎯 Email should contain:');
    console.log('   - Executive summary with 98.03% success rate');
    console.log('   - Detailed test statistics');
    console.log('   - Working links to all reports');
    console.log('   - Professional HTML formatting');
    
  } catch (error: any) {
    console.error('\n❌ Email sending failed:');
    console.error(error.message);
    
    if (error.message?.includes('Invalid login')) {
      console.error('\n💡 Authentication error solutions:');
      console.error('1. Verify Gmail App Password (not regular password)');
      console.error('2. Check 2FA is enabled on Google Account');
      console.error('3. Ensure EMAIL_PASS is the 16-character app password');
    } else if (error.message?.includes('ENOTFOUND')) {
      console.error('\n💡 Network error solutions:');
      console.error('1. Check internet connection');
      console.error('2. Verify EMAIL_HOST is correct (smtp.gmail.com)');
      console.error('3. Check firewall/proxy settings');
    } else {
      console.error('\n💡 General troubleshooting:');
      console.error('1. Double-check all .env values');
      console.error('2. Try generating new Gmail App Password');
      console.error('3. Test with different email address');
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
📧 ParaBank Email Test Tool

Usage:
  npm run email:test              # Test email sending
  npm run email:test -- --help    # Show this help

Environment Setup Required:
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_USER=your-email@gmail.com
  EMAIL_PASS=your-gmail-app-password
  RECIPIENT_EMAIL=vmurashev@gmail.com

Gmail App Password Setup:
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Search "App passwords" in settings
4. Select "Mail" and your device
5. Copy the 16-character password
6. Use it as EMAIL_PASS in .env file

Example .env:
  EMAIL_USER=myemail@gmail.com
  EMAIL_PASS=abcd efgh ijkl mnop
  RECIPIENT_EMAIL=vmurashev@gmail.com
`);
  process.exit(0);
}

// Run the email test
testEmailSending().then(() => {
  console.log('\n✨ Email test completed!');
}).catch((error) => {
  console.error('\n💥 Email test failed:', error.message);
  process.exit(1);
});
