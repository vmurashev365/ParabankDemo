import type { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export async function savePageHtml(page: Page, fileName: string): Promise<void> {
  const html = await page.content();
  const outDir = path.join(__dirname, '..', '..', 'debug-html');
  fs.mkdirSync(outDir, { recursive: true });
  const filePath = path.join(outDir, fileName);
  fs.writeFileSync(filePath, html, 'utf-8');
}
