import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { resolveBaseUrl } from '../src/support/env';

describe('resolveBaseUrl', () => {
  const originalParabank = process.env.PARABANK_BASE_URL;
  const originalBase = process.env.BASE_URL;

  afterEach(() => {
    if (originalParabank === undefined) {
      delete process.env.PARABANK_BASE_URL;
    } else {
      process.env.PARABANK_BASE_URL = originalParabank;
    }
    if (originalBase === undefined) {
      delete process.env.BASE_URL;
    } else {
      process.env.BASE_URL = originalBase;
    }
  });

  it('defaults to the local Docker ParaBank origin', () => {
    delete process.env.PARABANK_BASE_URL;
    delete process.env.BASE_URL;
    assert.equal(resolveBaseUrl(), 'http://127.0.0.1:8081');
  });

  it('prefers PARABANK_BASE_URL over BASE_URL and trims trailing slashes', () => {
    process.env.PARABANK_BASE_URL = ' http://127.0.0.1:9090/// ';
    process.env.BASE_URL = 'http://example.test';
    assert.equal(resolveBaseUrl(), 'http://127.0.0.1:9090');
  });

  it('falls back to BASE_URL when PARABANK_BASE_URL is blank', () => {
    process.env.PARABANK_BASE_URL = '   ';
    process.env.BASE_URL = 'http://127.0.0.1:8082/';
    assert.equal(resolveBaseUrl(), 'http://127.0.0.1:8082');
  });
});
