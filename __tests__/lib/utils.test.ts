import { describe, it, expect } from 'vitest';
import { cn, normalizeCurrencyFormat } from '@/lib/utils';

describe('Utils - cn (className utility)', () => {
  it('should merge class names correctly', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle conditional classes', () => {
    expect(cn('text-red-500', false && 'text-blue-500')).toBe('text-red-500');
    expect(cn('text-red-500', true && 'text-blue-500')).toBe('text-blue-500');
  });
});

describe('Utils - normalizeCurrencyFormat', () => {
  it('should format raw numbers with $ prefix', () => {
    expect(normalizeCurrencyFormat(1000)).toBe('$1000');
    expect(normalizeCurrencyFormat('1000')).toBe('$1000');
    expect(normalizeCurrencyFormat(0)).toBe('$0');
  });

  it('should preserve existing currency symbols', () => {
    expect(normalizeCurrencyFormat('$1000')).toBe('$1000');
    expect(normalizeCurrencyFormat('€1000')).toBe('€1000');
    expect(normalizeCurrencyFormat('£1000')).toBe('£1000');
  });

  it('should handle numbers with suffixes', () => {
    expect(normalizeCurrencyFormat('2.5B')).toBe('$2.5B');
    expect(normalizeCurrencyFormat('1.2M')).toBe('$1.2M');
  });

  it('should return N/A for invalid values', () => {
    expect(normalizeCurrencyFormat(null)).toBe('N/A');
    expect(normalizeCurrencyFormat(undefined)).toBe('N/A');
    expect(normalizeCurrencyFormat('')).toBe('N/A');
    expect(normalizeCurrencyFormat(NaN)).toBe('N/A');
  });

  it('should preserve formatted strings', () => {
    expect(normalizeCurrencyFormat('USD 1000')).toBe('USD 1000');
    expect(normalizeCurrencyFormat('€1,234.56')).toBe('€1,234.56');
  });
});

