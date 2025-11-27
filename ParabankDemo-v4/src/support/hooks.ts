import { After, Before } from '@cucumber/cucumber';
import type { V4World } from './world';

Before(async function (this: V4World) {
  await this.initPage();
});

After(async function (this: V4World) {
  await this.cleanup();
});
