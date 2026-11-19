import { Status } from '@cucumber/cucumber';

export type TerminalMode = 'compact' | 'silent';

export function resolveTerminalMode(env: NodeJS.ProcessEnv = process.env): TerminalMode {
  const raw = env.PARABANK_TERMINAL_MODE?.trim().toLowerCase();
  if (raw === 'silent' || raw === 'off' || raw === 'false') {
    return 'silent';
  }
  return 'compact';
}

export function isTerminalColorEnabled(
  env: NodeJS.ProcessEnv = process.env,
  isTTY = Boolean(process.stdout.isTTY),
): boolean {
  if (env.NO_COLOR) {
    return false;
  }
  if (env.FORCE_COLOR && env.FORCE_COLOR !== '0') {
    return true;
  }
  return isTTY;
}

export function formatDuration(elapsedMs: number): string {
  const safeMs = Math.max(0, Math.round(elapsedMs));
  if (safeMs < 1000) {
    return `${safeMs}ms`;
  }
  const seconds = safeMs / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${Math.round(seconds % 60)}s`;
}

export function formatStepStatus(status?: string): string {
  if (status === Status.PASSED) return 'PASS';
  if (status === Status.FAILED) return 'FAIL';
  if (status === Status.SKIPPED) return 'SKIP';
  return (status ?? Status.UNKNOWN).toString().toUpperCase();
}

export function colorStatus(status: string, colorEnabled: boolean): string {
  if (!colorEnabled) {
    return status;
  }
  const code =
    status === 'PASS' || status === 'PASSED'
      ? '\u001b[32m'
      : status === 'FAIL' || status === 'FAILED'
        ? '\u001b[31m'
        : '\u001b[33m';
  return `${code}${status}\u001b[0m`;
}

export function collectGherkinStepKeywords(document: unknown): Map<string, string> {
  const keywords = new Map<string, string>();
  const visit = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== 'object') {
      return;
    }
    const item = value as Record<string, unknown>;
    if (typeof item.id === 'string' && typeof item.keyword === 'string' && typeof item.text === 'string') {
      keywords.set(item.id, item.keyword.trim());
    }
    Object.values(item).forEach(visit);
  };
  visit(document);
  return keywords;
}

export function keywordForPickleStep(
  keywords: Map<string, string> | undefined,
  astNodeIds: readonly string[] = [],
): string {
  return astNodeIds.map((id) => keywords?.get(id)).find(Boolean) ?? 'Step';
}

export function formatStepLine(input: {
  status: string;
  elapsedMs: number;
  keyword: string;
  text: string;
  colorEnabled: boolean;
}): string {
  const badge = colorStatus(input.status, input.colorEnabled);
  const duration = formatDuration(input.elapsedMs).padEnd(7);
  return `  ${badge} · ${duration} ${input.keyword} ${input.text}`;
}

export function formatScenarioFooter(input: { status: string; elapsedMs: number; colorEnabled: boolean }): string {
  const badge = colorStatus(input.status, input.colorEnabled);
  const duration = formatDuration(input.elapsedMs);
  const outcome =
    input.status === 'PASS' ? 'Scenario completed' : input.status === 'FAIL' ? 'Scenario failed' : 'Scenario finished';
  return `└─ ${badge} · ${duration}  ${outcome}`;
}
