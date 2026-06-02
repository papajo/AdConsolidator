import { describe, it, expect } from 'vitest';
import { formatDate, formatNumber, getCategoryBadgeClass, generateStars } from '../src/lib/utils';

describe('formatDate', () => {
  it('returns "Today" for today', () => {
    expect(formatDate(new Date().toISOString())).toBe('Today');
  });

  it('returns "Yesterday" for 1 day ago', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    expect(formatDate(yesterday)).toBe('Yesterday');
  });

  it('returns "X days ago" for recent dates', () => {
    const threeDays = new Date(Date.now() - 3 * 86400000).toISOString();
    expect(formatDate(threeDays)).toBe('3 days ago');
  });

  it('returns formatted date for old dates', () => {
    const old = '2025-01-15T10:00:00Z';
    const result = formatDate(old);
    expect(result).toMatch(/Jan 15, 2025/);
  });
});

describe('formatNumber', () => {
  it('formats millions', () => expect(formatNumber(1500000)).toBe('1.5M'));
  it('formats thousands', () => expect(formatNumber(1234)).toBe('1.2K'));
  it('keeps small numbers as-is', () => expect(formatNumber(999)).toBe('999'));
  it('handles zero', () => expect(formatNumber(0)).toBe('0'));
});

describe('getCategoryBadgeClass', () => {
  it('returns badge-products for Products', () => expect(getCategoryBadgeClass('Products')).toBe('badge-products'));
  it('returns badge-services for Services', () => expect(getCategoryBadgeClass('Services')).toBe('badge-services'));
  it('returns badge-events for Events', () => expect(getCategoryBadgeClass('Events')).toBe('badge-events'));
  it('returns badge-other for unknown', () => expect(getCategoryBadgeClass('Other')).toBe('badge-other'));
});

describe('generateStars', () => {
  it('handles whole numbers', () => {
    const s = generateStars(4);
    expect(s).toEqual({ full: 4, half: 0, empty: 1 });
  });

  it('handles half-star ratings', () => {
    const s = generateStars(3.5);
    expect(s).toEqual({ full: 3, half: 1, empty: 1 });
  });

  it('handles zero', () => {
    const s = generateStars(0);
    expect(s).toEqual({ full: 0, half: 0, empty: 5 });
  });

  it('handles max rating', () => {
    const s = generateStars(5);
    expect(s).toEqual({ full: 5, half: 0, empty: 0 });
  });
});
