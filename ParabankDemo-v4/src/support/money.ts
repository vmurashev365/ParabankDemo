// ParaBank renders USD amounts with two decimal places, including negative balances.
export function usdToCents(value: string): number {
  const normalized = value.trim().replace(/[$,]/g, '');
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(normalized);
  if (!match) throw new Error(`Expected a USD amount, received "${value}"`);
  const cents = Number(match[2]) * 100 + Number((match[3] ?? '').padEnd(2, '0'));
  return match[1] === '-' ? -cents : cents;
}
