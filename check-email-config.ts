#!/usr/bin/env node

import * as dotenv from 'dotenv';

dotenv.config();

console.log('🔍 ParaBank Email Configuration Check');
console.log('====================================');

const configs = [
  { name: 'EMAIL_HOST', value: process.env.EMAIL_HOST, required: true },
  { name: 'EMAIL_PORT', value: process.env.EMAIL_PORT, required: true },
  { name: 'EMAIL_USER', value: process.env.EMAIL_USER, required: true },
  { name: 'EMAIL_PASS', value: process.env.EMAIL_PASS, required: true },
  { name: 'RECIPIENT_EMAIL', value: process.env.RECIPIENT_EMAIL, required: true },
  { name: 'EMAIL_FROM_NAME', value: process.env.EMAIL_FROM_NAME, required: false },
];

let hasIssues = false;

console.log('\n📋 Current Configuration:');
console.log('=========================');

configs.forEach(config => {
  const status = config.value ? '✅' : '❌';
  const maskedValue = config.name === 'EMAIL_PASS' && config.value 
    ? `${config.value.substring(0, 4)}...` 
    : config.value || 'NOT SET';
  
  console.log(`${status} ${config.name}: ${maskedValue}`);
  
  if (config.required && !config.value) {
    hasIssues = true;
  }
  
  // Check for test values
  if (config.value && (
    config.value.includes('test-') || 
    config.value === 'test-app-password' ||
    config.value === 'test-email@gmail.com'
  )) {
    console.log(`   ⚠️  WARNING: This looks like a test value!`);
    hasIssues = true;
  }
});

console.log('\n🔧 Configuration Analysis:');
console.log('==========================');

if (!hasIssues) {
  console.log('✅ All required configurations are set');
  console.log('✅ No test values detected');
  console.log('\n🚀 Ready to send emails!');
  console.log('   Run: npm run email:test');
} else {
  console.log('❌ Configuration issues detected');
  console.log('\n💡 To fix:');
  console.log('1. Edit .env file with real Gmail credentials');
  console.log('2. Get Gmail App Password (see EMAIL_SETUP_GUIDE.md)');
  console.log('3. Run: npm run config:check again');
}

console.log('\n📖 For detailed setup instructions:');
console.log('   See: EMAIL_SETUP_GUIDE.md');

if (process.env.EMAIL_USER && process.env.RECIPIENT_EMAIL) {
  console.log(`\n📧 Email Flow:`);
  console.log(`   From: ${process.env.EMAIL_USER}`);
  console.log(`   To: ${process.env.RECIPIENT_EMAIL}`);
  console.log(`   Subject: ParaBank Test Results`);
}
