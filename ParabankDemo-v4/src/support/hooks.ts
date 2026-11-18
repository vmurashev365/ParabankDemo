import { After, Before, Status } from '@cucumber/cucumber';
import type { V4World } from './world';

Before(async function (this: V4World) {
  await this.initPage();
});

After(async function (this: V4World, { result }) {
  try {
    if (result?.status === Status.FAILED && this.page && !this.page.isClosed()) {
      await this.attach(await this.page.screenshot({ timeout: 3000 }), 'image/png');
    }
  } finally {
    await this.cleanup();
  }
});
