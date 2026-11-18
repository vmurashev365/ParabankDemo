import type { V4World } from '../support/world';

export const defaultUsername = process.env.PARABANK_USERNAME ?? 'john';
export const defaultPassword = process.env.PARABANK_PASSWORD ?? 'demo';

export async function signIn(world: V4World, username = defaultUsername, password = defaultPassword): Promise<void> {
  await world.login.goto();
  await world.login.login(username, password);
}
