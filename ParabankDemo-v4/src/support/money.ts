// ParaBank renders USD amounts with two decimal places, including negative balances.
export function usdToCents(value: string): number {
  const normalized = value.trim().replace(/[$,]/g, '');
  const match = /^([+-]?)(\d+)(?:\.(\d{1,2}))?$/.exec(normalized);
  if (!match) {
    throw new Error(`Expected a USD amount, received "${value}"`);
  }
  const cents = Number(match[2]) * 100 + Number((match[3] ?? '').padEnd(2, '0'));
  if (!Number.isSafeInteger(cents)) {
    throw new Error(`USD amount is out of safe integer range: "${value}"`);
  }
  if (cents === 0) {
    return 0;
  }
  return match[1] === '-' ? -cents : cents;
}

export function numberToCents(amount: number): number {
  if (!Number.isFinite(amount)) {
    throw new Error(`Expected a finite numeric USD amount, received ${String(amount)}`);
  }
  const cents = Math.round(amount * 100);
  return Object.is(cents, -0) ? 0 : cents;
}

export function centsToUsd(cents: number): string {
  if (!Number.isSafeInteger(cents)) {
    throw new Error(`Expected an integer cent value, received ${String(cents)}`);
  }
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const dollars = Math.trunc(abs / 100);
  const remainder = String(abs % 100).padStart(2, '0');
  return `${sign}$${dollars}.${remainder}`;
}

export function formatUsdAmount(value: string): string {
  return centsToUsd(usdToCents(value));
}
