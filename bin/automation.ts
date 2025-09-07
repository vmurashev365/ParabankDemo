#!/usr/bin/env node

import { nightlyScheduler } from '../src/support/NightlyTestScheduler';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

console.log('🚀 ParaBank Automated Test System v3.0');
console.log('=====================================');

// Validate required environment variables
const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'RECIPIENT_EMAIL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease set these variables in your .env file or environment.');
  process.exit(1);
}

console.log('✅ Environment configuration validated');
console.log(`📧 Email notifications will be sent to: ${process.env.RECIPIENT_EMAIL}`);

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'start':
    console.log('🌙 Starting nightly test scheduler...');
    nightlyScheduler.start();
    console.log('🕐 Scheduler active - tests will run daily at 2:00 AM Moscow Time');
    console.log('💡 Press Ctrl+C to stop the scheduler');
    break;

  case 'run':
    console.log('⚡ Running immediate test execution...');
    nightlyScheduler.runManualTest().then(() => {
      console.log('✅ Manual test execution completed');
      process.exit(0);
    }).catch((error) => {
      console.error('❌ Manual test execution failed:', error);
      process.exit(1);
    });
    break;

  case 'test':
    console.log('🧪 Scheduling immediate test execution (5 seconds delay)...');
    nightlyScheduler.scheduleImmediate();
    console.log('⏰ Test will start in 5 seconds...');
    break;

  case 'status':
    const status = nightlyScheduler.getStatus();
    console.log('📊 Scheduler Status:');
    console.log(`   - Running: ${status.isRunning ? '✅ Yes' : '❌ No'}`);
    console.log(`   - Next Run: ${status.nextRun}`);
    break;

  case 'help':
  default:
    console.log(`
📖 ParaBank Automated Test System Commands:

🌙 start     - Start the nightly test scheduler (runs daily at 2:00 AM)
⚡ run       - Execute tests immediately and exit
🧪 test      - Schedule immediate test execution (for testing)
📊 status    - Show scheduler status
📖 help      - Show this help message

🔧 Environment Setup:
Create a .env file with the following variables:
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   RECIPIENT_EMAIL=vmurashev@gmail.com

📋 Examples:
   npm run automation start    - Start the scheduler
   npm run automation run      - Run tests now
   npm run automation test     - Test the system
   npm run automation status   - Check status

🔗 For more information, visit: https://github.com/your-repo/parabank-demo
`);
    break;
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Gracefully shutting down...');
  console.log('✅ ParaBank Automated Test System stopped');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  process.exit(0);
});
