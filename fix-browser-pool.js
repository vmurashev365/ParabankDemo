const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'steps', 'AuthenticationSteps.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Fixing direct browser launches to use BrowserPoolManager...');

// Pattern to find and replace direct browser initialization
const directBrowserPattern = /console\.log\('🚀 Initializing browser manually\.\.\.'\);\s*\n\s*\n\s*this\.browser = await chromium\.launch\(\{[\s\S]*?\}\);\s*\n\s*\n\s*this\.context = await this\.browser\.newContext\(\{[\s\S]*?\}\);\s*\n\s*\n\s*this\.page = await this\.context\.newPage\(\);/g;

const replacement = `console.log('🚀 Initializing browser through BrowserPoolManager...');
    await this.initBrowser();`;

let matches = 0;
content = content.replace(directBrowserPattern, (match) => {
  matches++;
  console.log(`✅ Replaced browser initialization #${matches}`);
  return replacement;
});

// Also handle cases with slightly different patterns
const alternatePattern = /this\.browser = await chromium\.launch\(\{[\s\S]*?\}\);\s*\n\s*this\.context = await this\.browser\.newContext\(\{[\s\S]*?\}\);\s*\n\s*this\.page = await this\.context\.newPage\(\);/g;

content = content.replace(alternatePattern, (match) => {
  matches++;
  console.log(`✅ Replaced alternate browser initialization #${matches}`);
  return 'await this.initBrowser();';
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`🎉 Fixed ${matches} direct browser launches. Now using BrowserPoolManager!`);
