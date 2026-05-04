import { DOMAIN_NAMES, DOMAIN_SHORTS } from './constants';

export function formatValue(val: number): string {
    if (val >= 1) return val.toString();
    const denom = Math.round(1 / val);
    return `1/${denom}`;
}

export function getDomainName(code: string): string {
    return DOMAIN_NAMES[code] || code;
}

export function getDomainShort(code: string): string {
    return DOMAIN_SHORTS[code] || code;
}
