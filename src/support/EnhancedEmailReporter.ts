import fs from 'fs';
import path from 'path';
import { TestResults } from './EmailReporter';

/**
 * Enhanced Email Reporter with working report links
 */
export class EnhancedEmailReporter {
  
  /**
   * Generate email with embedded reports and working links
   */
  async generateEmailWithWorkingLinks(results: TestResults): Promise<{
    html: string;
    attachments: Array<{name: string, path: string, contentType: string}>;
  }> {
    console.log('📧 Generating enhanced email with working report links...');
    
    // Create attachments array
    const attachments: Array<{name: string, path: string, contentType: string}> = [];
    
    // Check which reports exist and add them as attachments
    const reportPaths = {
      allure: path.join(process.cwd(), 'reports', 'allure-report', 'index.html'),
      cucumber: path.join(process.cwd(), 'reports', 'cucumber-report.html'),
      playwright: path.join(process.cwd(), 'reports', 'playwright-report', 'index.html'),
      summary: path.join(process.cwd(), 'reports', 'SUMMARY.md')
    };
    
    // Add existing reports as attachments
    if (fs.existsSync(reportPaths.allure)) {
      attachments.push({
        name: 'allure-report.html',
        path: reportPaths.allure,
        contentType: 'text/html'
      });
    }
    
    if (fs.existsSync(reportPaths.cucumber)) {
      attachments.push({
        name: 'cucumber-report.html',
        path: reportPaths.cucumber,
        contentType: 'text/html'
      });
    }
    
    if (fs.existsSync(reportPaths.playwright)) {
      attachments.push({
        name: 'playwright-report.html',
        path: reportPaths.playwright,
        contentType: 'text/html'
      });
    }
    
    if (fs.existsSync(reportPaths.summary)) {
      attachments.push({
        name: 'SUMMARY.md',
        path: reportPaths.summary,
        contentType: 'text/markdown'
      });
    }
    
    // Generate enhanced HTML content
    const html = this.generateEnhancedHTML(results, attachments);
    
    return { html, attachments };
  }
  
  private generateEnhancedHTML(results: TestResults, attachments: any[]): string {
    const statusIcon = results.successRate >= 95 ? '🎉' : results.successRate >= 80 ? '⚠️' : '🚨';
    const statusColor = results.successRate >= 95 ? '#28a745' : results.successRate >= 80 ? '#ffc107' : '#dc3545';
    const statusText = results.successRate >= 95 ? 'EXCELLENT' : results.successRate >= 80 ? 'WARNING' : 'CRITICAL';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ParaBank Test Results</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .header h1 {
                margin: 0;
                font-size: 2em;
            }
            .status-banner {
                background: ${statusColor};
                color: white;
                padding: 15px;
                text-align: center;
                font-weight: bold;
                font-size: 1.2em;
            }
            .content {
                padding: 30px;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 20px;
                margin: 30px 0;
            }
            .stat-card {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                border-left: 4px solid #007bff;
            }
            .stat-number {
                font-size: 2.5em;
                font-weight: bold;
                color: #007bff;
                margin: 10px 0;
            }
            .section {
                margin: 30px 0;
            }
            .section h2 {
                color: #333;
                border-bottom: 2px solid #007bff;
                padding-bottom: 10px;
            }
            
            /* Enhanced Report Access Section */
            .report-access {
                background: #e8f4f8;
                border: 2px solid #007bff;
                border-radius: 8px;
                padding: 25px;
                margin: 30px 0;
            }
            .report-access h3 {
                color: #007bff;
                margin-top: 0;
                font-size: 1.3em;
            }
            .attachment-list {
                background: white;
                border-radius: 6px;
                padding: 20px;
                margin: 15px 0;
            }
            .attachment-item {
                display: flex;
                align-items: center;
                padding: 10px;
                margin: 5px 0;
                background: #f8f9fa;
                border-radius: 4px;
                border-left: 3px solid #28a745;
            }
            .attachment-icon {
                font-size: 1.5em;
                margin-right: 10px;
            }
            .attachment-info {
                flex: 1;
            }
            .attachment-name {
                font-weight: bold;
                color: #333;
            }
            .attachment-desc {
                font-size: 0.9em;
                color: #666;
                margin-top: 3px;
            }
            
            .instructions {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
            }
            .instructions h4 {
                color: #856404;
                margin-top: 0;
            }
            .instructions ol {
                margin: 10px 0;
                padding-left: 20px;
            }
            .instructions li {
                margin: 5px 0;
                color: #856404;
            }
            
            .alternative-access {
                background: #d1ecf1;
                border: 1px solid #bee5eb;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
            }
            .alternative-access h4 {
                color: #0c5460;
                margin-top: 0;
            }
            
            .footer {
                background: #333;
                color: white;
                text-align: center;
                padding: 20px;
                border-radius: 0 0 8px 8px;
            }
            .timestamp {
                color: #666;
                font-size: 0.9em;
                margin-top: 20px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${statusIcon} ParaBank Test Report</h1>
                <p>Automated Test Execution Results</p>
            </div>
            
            <div class="status-banner">
                ${statusText}: ${results.successRate.toFixed(1)}% Success Rate (${results.passedScenarios}/${results.totalScenarios} tests)
            </div>
            
            <div class="content">
                <div class="section">
                    <h2>📊 Test Statistics</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${results.totalScenarios}</div>
                            <div>Total Tests</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" style="color: #28a745;">${results.passedScenarios}</div>
                            <div>✅ Passed</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" style="color: #dc3545;">${results.failedScenarios}</div>
                            <div>❌ Failed</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" style="color: #6c757d;">${results.skippedScenarios}</div>
                            <div>⏭️ Skipped</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>⏱️ Execution Details</h2>
                    <p><strong>Duration:</strong> ${results.executionTime}</p>
                    <p><strong>Environment:</strong> ${results.environment}</p>
                    <p><strong>Timestamp:</strong> ${results.timestamp}</p>
                </div>
                
                <div class="report-access">
                    <h3>📄 Detailed Test Reports</h3>
                    <p><strong>📎 Reports are attached to this email!</strong> Download and open them in your browser for detailed analysis.</p>
                    
                    <div class="attachment-list">
                        <h4>📁 Available Attachments:</h4>
                        ${attachments.map(att => `
                        <div class="attachment-item">
                            <div class="attachment-icon">
                                ${att.name.includes('allure') ? '📊' : 
                                  att.name.includes('cucumber') ? '🥒' : 
                                  att.name.includes('playwright') ? '🎭' : '📋'}
                            </div>
                            <div class="attachment-info">
                                <div class="attachment-name">${att.name}</div>
                                <div class="attachment-desc">
                                    ${att.name.includes('allure') ? 'Interactive dashboard with detailed analytics' : 
                                      att.name.includes('cucumber') ? 'BDD scenario breakdown and step details' : 
                                      att.name.includes('playwright') ? 'Cross-browser test results' : 'Executive summary'}
                                </div>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                    
                    <div class="instructions">
                        <h4>📖 How to View Reports:</h4>
                        <ol>
                            <li>Download the attached HTML files from this email</li>
                            <li>Save them to your computer</li>
                            <li>Double-click any HTML file to open in your web browser</li>
                            <li>Navigate through the interactive reports</li>
                        </ol>
                    </div>
                    
                    <div class="alternative-access">
                        <h4>💻 Alternative Access:</h4>
                        <p>If you have access to the test server, reports are also available at:</p>
                        <p><code>\\\\test-server\\ParaBank\\reports\\</code></p>
                        <p>Or contact the QA team for remote access to the live dashboard.</p>
                    </div>
                </div>
                
                <div class="section">
                    <h2>📈 Performance Analysis</h2>
                    ${results.successRate >= 95 ? 
                        '<p style="color: #28a745;"><strong>🎉 EXCELLENT:</strong> All tests are performing well. The application is stable and ready for deployment.</p>' : 
                        results.successRate >= 80 ? 
                        '<p style="color: #ffc107;"><strong>⚠️ WARNING:</strong> Some test failures detected. Review the detailed reports and address any issues.</p>' : 
                        '<p style="color: #dc3545;"><strong>🚨 CRITICAL:</strong> Multiple test failures require immediate attention. Please review the reports urgently.</p>'
                    }
                </div>
                
                <div class="timestamp">
                    Generated by ParaBank Unified Test Framework v3.0<br>
                    This is an automated email. For questions, contact the QA team.
                </div>
            </div>
            
            <div class="footer">
                <p>🌙 Automated Nightly Testing System</p>
                <p>For technical support, contact: QA Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

export const enhancedEmailReporter = new EnhancedEmailReporter();
