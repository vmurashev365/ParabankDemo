import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Status } from '@cucumber/cucumber';
import {
  collectGherkinStepKeywords,
  colorStatus,
  formatDuration,
  formatScenarioFooter,
  formatStepLine,
  formatStepStatus,
  isTerminalColorEnabled,
  keywordForPickleStep,
  resolveTerminalMode,
} from '../src/support/terminalReporter';

describe('terminalReporter', () => {
  it('formats durations across ms, seconds, and minutes', () => {
    assert.equal(formatDuration(42), '42ms');
    assert.equal(formatDuration(1460), '1.5s');
    assert.equal(formatDuration(65000), '1m 5s');
  });

  it('maps Cucumber step statuses to compact badges', () => {
    assert.equal(formatStepStatus(Status.PASSED), 'PASS');
    assert.equal(formatStepStatus(Status.FAILED), 'FAIL');
    assert.equal(formatStepStatus(Status.SKIPPED), 'SKIP');
  });

  it('extracts Gherkin step keywords from astNodeIds', () => {
    const keywords = collectGherkinStepKeywords({
      feature: {
        children: [
          {
            scenario: {
              steps: [
                { id: 's1', keyword: 'Given ', text: 'user is on the login page' },
                { id: 's2', keyword: 'Then ', text: 'user should be logged in' },
              ],
            },
          },
        ],
      },
    });
    assert.equal(keywordForPickleStep(keywords, ['s1']), 'Given');
    assert.equal(keywordForPickleStep(keywords, ['s2']), 'Then');
    assert.equal(keywordForPickleStep(keywords, ['missing']), 'Step');
  });

  it('formats compact step and scenario footer lines without color when disabled', () => {
    assert.equal(
      formatStepLine({
        status: 'PASS',
        elapsedMs: 120,
        keyword: 'When',
        text: 'user transfers "25.37" from account "54321" to account "13344"',
        colorEnabled: false,
      }),
      '  PASS · 120ms   When user transfers "25.37" from account "54321" to account "13344"',
    );
    assert.equal(
      formatScenarioFooter({ status: 'PASS', elapsedMs: 1250, colorEnabled: false }),
      '└─ PASS · 1.3s  Scenario completed',
    );
    assert.equal(colorStatus('PASS', true), '\u001b[32mPASS\u001b[0m');
  });

  it('respects PARABANK_TERMINAL_MODE and NO_COLOR / FORCE_COLOR', () => {
    assert.equal(resolveTerminalMode({}), 'compact');
    assert.equal(resolveTerminalMode({ PARABANK_TERMINAL_MODE: 'silent' }), 'silent');
    assert.equal(isTerminalColorEnabled({ NO_COLOR: '1' }, true), false);
    assert.equal(isTerminalColorEnabled({ FORCE_COLOR: '1' }, false), true);
  });
});
