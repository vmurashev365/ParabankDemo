import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export interface TestResults {
  totalScenarios: number;
  passedScenarios: number;
  failedScenarios: number;
  skippedScenarios: number;
  executionTime: string;
  successRate: number;
  timestamp: string;
  environment: string;
  reportUrls: {
    allure?: string;
    playwright?: string;
    cucumber?: string;
  };
}

export class EmailReporter {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Конфигурация для Gmail (можно изменить для других провайдеров)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD || 'your-app-password'
      }
    });
  }

  async sendTestResults(results: TestResults, recipientEmail: string = 'vmurashev@gmail.com'): Promise<void> {
    console.log('📧 Preparing enhanced email with report attachments...');

    try {
      // Import enhanced reporter
      const { enhancedEmailReporter } = await import('./EnhancedEmailReporter');
      
      // Generate enhanced email with working attachments
      const { html, attachments } = await enhancedEmailReporter.generateEmailWithWorkingLinks(results);
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'parabank-automation@gmail.com',
        to: recipientEmail,
        subject: this.generateEmailSubject(results),
        html: html,
        attachments: attachments.map(att => ({
          filename: att.name,
          path: att.path,
          contentType: att.contentType
        }))
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Enhanced email sent successfully with report attachments!');
      console.log('📧 Message ID:', info.messageId);
      console.log('📎 Attachments included:', attachments.length);
      
    } catch (error) {
      console.error('❌ Error sending enhanced email:', error);
      
      // Fallback to basic email if enhanced version fails
      console.log('🔄 Attempting fallback to basic email...');
      const htmlContent = this.generateHTMLReport(results);
      const basicAttachments = await this.collectReportAttachments();

      const basicMailOptions = {
        from: process.env.EMAIL_USER || 'parabank-automation@gmail.com',
        to: recipientEmail,
        subject: this.generateEmailSubject(results),
        html: htmlContent,
        attachments: basicAttachments
      };

      try {
        const info = await this.transporter.sendMail(basicMailOptions);
        console.log('✅ Basic email sent successfully:', info.messageId);
      } catch (fallbackError) {
        console.error('❌ Fallback email also failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  private generateEmailSubject(results: TestResults): string {
    const status = results.successRate >= 95 ? '✅ PASSED' : '❌ FAILED';
    const rate = results.successRate.toFixed(1);
    return `${status} ParaBank Nightly Tests - ${rate}% Success Rate (${results.passedScenarios}/${results.totalScenarios})`;
  }

  public generateHTMLReport(results: TestResults): string {
    const statusIcon = results.successRate >= 95 ? '✅' : results.successRate >= 80 ? '⚠️' : '❌';
    const statusColor = results.successRate >= 95 ? '#28a745' : results.successRate >= 80 ? '#ffc107' : '#dc3545';

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>ParaBank Test Results</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .status { font-size: 1.2em; margin-top: 10px; }
        .content { padding: 30px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid ${statusColor}; }
        .metric-value { font-size: 2em; font-weight: bold; color: ${statusColor}; }
        .metric-label { color: #6c757d; margin-top: 5px; }
        .section { margin: 30px 0; }
        .section h3 { color: #495057; border-bottom: 2px solid #e9ecef; padding-bottom: 10px; }
        .progress-bar { background: #e9ecef; border-radius: 10px; overflow: hidden; height: 20px; margin: 10px 0; }
        .progress-fill { background: ${statusColor}; height: 100%; width: ${results.successRate}%; transition: width 0.3s ease; }
        .links { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .link-button { background: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; text-align: center; display: block; }
        .link-button:hover { background: #0056b3; }
        .footer { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; color: #6c757d; }
        .timestamp { font-style: italic; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusIcon} ParaBank Test Results</h1>
          <div class="status">Environment: ${results.environment}</div>
          <div class="timestamp">Executed: ${results.timestamp}</div>
        </div>
        
        <div class="content">
          <div class="section">
            <h3>📊 Test Execution Summary</h3>
            <div class="metrics">
              <div class="metric">
                <div class="metric-value">${results.successRate.toFixed(1)}%</div>
                <div class="metric-label">Success Rate</div>
              </div>
              <div class="metric">
                <div class="metric-value">${results.totalScenarios}</div>
                <div class="metric-label">Total Tests</div>
              </div>
              <div class="metric">
                <div class="metric-value">${results.passedScenarios}</div>
                <div class="metric-label">Passed</div>
              </div>
              <div class="metric">
                <div class="metric-value">${results.failedScenarios}</div>
                <div class="metric-label">Failed</div>
              </div>
              <div class="metric">
                <div class="metric-value">${results.executionTime}</div>
                <div class="metric-label">Duration</div>
              </div>
            </div>
            
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>

          <div class="section">
            <h3>📋 Test Status Breakdown</h3>
            <ul>
              <li><strong>✅ Passed:</strong> ${results.passedScenarios} scenarios</li>
              <li><strong>❌ Failed:</strong> ${results.failedScenarios} scenarios</li>
              <li><strong>⏭️ Skipped:</strong> ${results.skippedScenarios} scenarios</li>
            </ul>
          </div>

          <div class="section">
            <h3>📄 Detailed Reports</h3>
            <div class="report-info" style="background: #e8f4fd; border: 2px solid #007bff; border-radius: 8px; padding: 20px; margin: 15px 0;">
              <h4 style="color: #007bff; margin-top: 0;">📎 Reports Attached to This Email</h4>
              <p style="margin: 10px 0;">All detailed test reports are attached to this email for easy access:</p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>📊 allure-report.html</strong> - Interactive dashboard with detailed analytics</li>
                <li><strong>🥒 cucumber-report.html</strong> - BDD scenario breakdown and step details</li>
                <li><strong>🎭 playwright-report.html</strong> - Cross-browser test results</li>
                <li><strong>📋 SUMMARY.md</strong> - Executive summary</li>
              </ul>
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 10px; margin: 15px 0;">
                <strong>📖 How to view:</strong> Download the HTML files from email attachments and open them in your web browser.
              </div>
            </div>
            <p><em>Note: For security reasons, report links in emails don't work directly. Please download the attached HTML files.</em></p>
          </div>

          <div class="section">
            <h3>🎯 Recommendations</h3>
            ${this.generateRecommendations(results)}
          </div>
        </div>
        
        <div class="footer">
          <p>🤖 Generated by ParaBank Unified Test Framework v3.0</p>
          <p>This is an automated email. For questions, contact the QA team.</p>
        </div>
      </div>
    </body>
    </html>`;
  }

  private generateRecommendations(results: TestResults): string {
    if (results.successRate >= 95) {
      return `<p style="color: #28a745;">🎉 <strong>Excellent!</strong> All tests are performing well. The application is stable and ready for deployment.</p>`;
    } else if (results.successRate >= 80) {
      return `<p style="color: #ffc107;">⚠️ <strong>Attention needed:</strong> Some tests are failing. Review the detailed reports to identify issues.</p>`;
    } else {
      return `<p style="color: #dc3545;">🚨 <strong>Critical:</strong> Multiple test failures detected. Immediate investigation required before any deployments.</p>`;
    }
  }

  private async collectReportAttachments(): Promise<any[]> {
    const attachments: any[] = [];
    const reportsDir = path.join(process.cwd(), 'reports');

    try {
      // Attach HTML reports
      const htmlReport = path.join(reportsDir, 'cucumber-report.html');
      if (fs.existsSync(htmlReport)) {
        attachments.push({
          filename: 'cucumber-report.html',
          path: htmlReport,
          contentType: 'text/html'
        });
      }

      // Attach JSON results
      const jsonReport = path.join(reportsDir, 'cucumber-report.json');
      if (fs.existsSync(jsonReport)) {
        attachments.push({
          filename: 'test-results.json',
          path: jsonReport,
          contentType: 'application/json'
        });
      }

      // Attach screenshots if any failures
      const screenshotsDir = path.join(reportsDir, 'screenshots');
      if (fs.existsSync(screenshotsDir)) {
        const screenshots = fs.readdirSync(screenshotsDir).slice(0, 5); // Limit to 5 screenshots
        screenshots.forEach(screenshot => {
          attachments.push({
            filename: screenshot,
            path: path.join(screenshotsDir, screenshot),
            contentType: 'image/png'
          });
        });
      }

    } catch (error) {
      console.warn('⚠️ Warning: Could not collect all report attachments:', error);
    }

    return attachments;
  }

  async testEmailConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email transporter configuration is valid');
      return true;
    } catch (error) {
      console.error('❌ Email transporter configuration error:', error);
      return false;
    }
  }
}
