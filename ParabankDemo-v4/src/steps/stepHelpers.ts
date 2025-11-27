import type { Page } from '@playwright/test';
import { LoginFlow } from '../flows/LoginFlow';

export type StepWorld = {
  page?: Page;
  loginFlow?: LoginFlow;
  authenticatedUser?: string;
  [key: string]: unknown;
};

export const DEFAULT_USERNAME = process.env.PARABANK_USERNAME ?? 'john';
export const DEFAULT_PASSWORD = process.env.PARABANK_PASSWORD ?? 'demo';

export const getLoginFlow = (world: StepWorld): LoginFlow => {
  if (!world.page) {
    throw new Error('Playwright page instance is not available on the World context.');
  }

  if (!world.loginFlow) {
    world.loginFlow = new LoginFlow(world.page);
  }

  return world.loginFlow;
};

export const ensureAuthenticated = async (
  world: StepWorld,
  username: string = DEFAULT_USERNAME,
  password: string = DEFAULT_PASSWORD
): Promise<void> => {
  const cacheKey = `${username}::${password}`;
  if (world.authenticatedUser === cacheKey) {
    return;
  }

  const loginFlow = getLoginFlow(world);
  await loginFlow.loginWithCredentials(username, password);
  world.authenticatedUser = cacheKey;
};

export const clearAuthenticationCache = (world: StepWorld): void => {
  delete world.authenticatedUser;
};
