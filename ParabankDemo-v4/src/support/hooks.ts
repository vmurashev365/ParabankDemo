import {
  After,
  AfterAll,
  AfterStep,
  Before,
  BeforeStep,
  Status,
  type ITestCaseHookParameter,
  type ITestStepHookParameter,
} from '@cucumber/cucumber';
import {
  collectGherkinStepKeywords,
  formatScenarioFooter,
  formatStepLine,
  formatStepStatus,
  isTerminalColorEnabled,
  keywordForPickleStep,
  resolveTerminalMode,
} from './terminalReporter';
import { closeSharedBrowser, type V4World } from './world';

const terminalMode = resolveTerminalMode();
const colorEnabled = isTerminalColorEnabled();

const scenarioStartTimes = new WeakMap<V4World, number>();
const stepStartTimes = new WeakMap<V4World, number>();
const gherkinStepKeywords = new WeakMap<V4World, Map<string, string>>();
let scenarioOrdinal = 0;

Before(async function (this: V4World, scenario: ITestCaseHookParameter) {
  scenarioOrdinal += 1;
  scenarioStartTimes.set(this, Date.now());
  gherkinStepKeywords.set(this, collectGherkinStepKeywords(scenario.gherkinDocument));

  if (terminalMode === 'compact') {
    process.stdout.write(`\n[${scenarioOrdinal}] Scenario: ${scenario.pickle.name}\n`);
  }

  await this.initApi();
  const isApiOnly = scenario.pickle.tags.some((tag) => tag.name === '@api');
  if (!isApiOnly) {
    await this.initBrowser();
  }
});

BeforeStep(function (this: V4World) {
  stepStartTimes.set(this, Date.now());
});

AfterStep(function (this: V4World, { pickleStep, result }: ITestStepHookParameter) {
  if (terminalMode !== 'compact') {
    return;
  }
  const startedAt = stepStartTimes.get(this);
  const elapsedMs = startedAt ? Date.now() - startedAt : 0;
  const statusText = formatStepStatus(result?.status);
  const keyword = keywordForPickleStep(gherkinStepKeywords.get(this), pickleStep.astNodeIds);
  process.stdout.write(
    `${formatStepLine({ status: statusText, elapsedMs, keyword, text: pickleStep.text, colorEnabled })}\n`,
  );

  if (result?.status === Status.FAILED && result.message) {
    const firstLine = result.message
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line.length > 0);
    if (firstLine) {
      process.stderr.write(`     ${firstLine}\n`);
    }
  }
});

After(async function (this: V4World, { pickle, result }: ITestCaseHookParameter) {
  const failed = result?.status === Status.FAILED;
  let cleanupError: unknown;
  try {
    if (failed && this.page && !this.page.isClosed()) {
      await this.attach(await this.page.screenshot({ timeout: 3000 }), 'image/png');
    }
  } finally {
    try {
      await this.cleanup(failed, pickle.name);
    } catch (error) {
      cleanupError = error;
    }
  }

  if (terminalMode === 'compact') {
    const elapsedMs = Date.now() - (scenarioStartTimes.get(this) ?? Date.now());
    const statusText = cleanupError ? 'FAIL' : formatStepStatus(result?.status);
    process.stdout.write(`${formatScenarioFooter({ status: statusText, elapsedMs, colorEnabled })}\n`);
  }

  scenarioStartTimes.delete(this);
  stepStartTimes.delete(this);
  gherkinStepKeywords.delete(this);

  if (!failed && cleanupError) {
    throw cleanupError;
  }
});

AfterAll(async function () {
  await closeSharedBrowser();
});
