import nodemailer from 'nodemailer';
import { enhancedEmailReporter } from './src/support/EnhancedEmailReporter';
import { TestResults } from './src/support/EmailReporter';

/**
 * Demo: Send enhanced email with working report attachments
 */
async function sendEnhancedEmail() {
  console.log('🚀 Creating enhanced email with report attachments...\n');
  
  try {
    // Create test account
    const testAccount = await nodemailer.createTestAccount();
    console.log('📧 Created test account:', testAccount.user);
    
    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    // Mock test results (realistic data)
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
    
    console.log('📊 Processing test results...');
    console.log(`   • Total Tests: ${mockResults.totalScenarios}`);
    console.log(`   • Success Rate: ${mockResults.successRate}%`);
    console.log(`   • Execution Time: ${mockResults.executionTime}\n`);
    
    // Generate enhanced email content
    const { html, attachments } = await enhancedEmailReporter.generateEmailWithWorkingLinks(mockResults);
    
    console.log('📎 Prepared attachments:');
    attachments.forEach(att => {
      console.log(`   • ${att.name} (${att.contentType})`);
    });
    console.log('');
    
    // Send email
    const info = await transporter.sendMail({
      from: '"ParaBank QA Team" <qa@company.com>',
      to: 'vmurashev@gmail.com',
      subject: `✅ ParaBank Nightly Tests - ${mockResults.successRate}% Success Rate (${mockResults.passedScenarios}/${mockResults.totalScenarios})`,
      html: html,
      attachments: attachments.map(att => ({
        filename: att.name,
        path: att.path,
        contentType: att.contentType
      }))
    });
    
    console.log('✅ Enhanced email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('\n📋 Email Features:');
    console.log('   • Interactive HTML report with attachments');
    console.log('   • Professional design with status indicators');
    console.log('   • Clear instructions for accessing reports');
    console.log('   • Multiple report formats included');
    console.log('   • Downloadable HTML reports that work offline');
    console.log('\n💡 Important: Reports are now attached to the email!');
    console.log('   Download the HTML files and open them in your browser.');
    
  } catch (error) {
    console.error('❌ Error sending enhanced email:', error);
  }
}

// Run the demo
sendEnhancedEmail();
