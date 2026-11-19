import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { centsToUsd, formatUsdAmount, numberToCents, usdToCents } from '../src/support/money';

describe('usdToCents', () => {
  it('parses standard, signed, comma-grouped, and single-decimal USD strings', () => {
    assert.equal(usdToCents('25.37'), 2537);
    assert.equal(usdToCents('$1,234.50'), 123450);
    assert.equal(usdToCents('-$0.01'), -1);
    assert.equal(usdToCents('+10.5'), 1050);
    assert.equal(usdToCents(' 100 '), 10000);
    assert.equal(usdToCents('0.00'), 0);
    assert.equal(usdToCents('-0.00'), 0);
  });

  it('rejects malformed or overly precise strings', () => {
    assert.throws(() => usdToCents(''), /Expected a USD amount/);
    assert.throws(() => usdToCents('abc'), /Expected a USD amount/);
    assert.throws(() => usdToCents('12.345'), /Expected a USD amount/);
    assert.throws(() => usdToCents('--5.00'), /Expected a USD amount/);
  });
});

describe('numberToCents', () => {
  it('rounds floating-point USD API values accurately to integer cents', () => {
    assert.equal(numberToCents(25.37), 2537);
    assert.equal(numberToCents(0.1 + 0.2), 30);
    assert.equal(numberToCents(-19.99), -1999);
    assert.equal(numberToCents(-0), 0);
  });

  it('rejects NaN and Infinity', () => {
    assert.throws(() => numberToCents(Number.NaN), /finite numeric USD amount/);
    assert.throws(() => numberToCents(Number.POSITIVE_INFINITY), /finite numeric USD amount/);
  });
});

describe('centsToUsd and formatUsdAmount', () => {
  it('formats integer cents into ParaBank receipt currency strings', () => {
    assert.equal(centsToUsd(0), '$0.00');
    assert.equal(centsToUsd(1), '$0.01');
    assert.equal(centsToUsd(2537), '$25.37');
    assert.equal(centsToUsd(120000), '$1200.00');
    assert.equal(centsToUsd(-1500), '-$15.00');
  });

  it('rejects non-integer cent inputs', () => {
    assert.throws(() => centsToUsd(12.5), /integer cent value/);
  });

  it('normalizes string amounts via integer cents without float drift', () => {
    assert.equal(formatUsdAmount('25.37'), '$25.37');
    assert.equal(formatUsdAmount('50'), '$50.00');
    assert.equal(formatUsdAmount('0.1'), '$0.10');
    assert.equal(formatUsdAmount('$1,200.00'), '$1200.00');
  });
});
