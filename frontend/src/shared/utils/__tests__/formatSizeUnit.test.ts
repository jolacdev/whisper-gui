import { describe, expect, it } from 'vitest';

import { formatSizeUnit } from '@utils/formatSizeUnit';

describe('formatSizeUnit', () => {
  const MB_IN_BYTES = 1024 ** 2;

  it('should return "0 Bytes" for invalid or zero values', () => {
    const invalidValues = [0, -100, NaN, '', 'test', undefined, null, {}, []];
    invalidValues.forEach((value) => {
      // @ts-expect-error Invalid type
      expect(formatSizeUnit(value)).toBe('0 Bytes');
    });
  });

  it('should format bytes to MB by default', () => {
    expect(formatSizeUnit(MB_IN_BYTES)).toBe('1.00 MB');
    expect(formatSizeUnit(MB_IN_BYTES / 2)).toBe('0.50 MB');
  });

  it('should format with custom decimals', () => {
    expect(formatSizeUnit(MB_IN_BYTES, 'Bytes', 'MB', 0)).toBe('1 MB');
    expect(formatSizeUnit(MB_IN_BYTES / 2, 'Bytes', 'MB', 5)).toBe(
      '0.50000 MB',
    );
    expect(formatSizeUnit(MB_IN_BYTES * 1.5, 'Bytes', 'MB', 1)).toBe('1.5 MB');
  });

  it('should handle negative decimals', () => {
    expect(formatSizeUnit(MB_IN_BYTES, 'Bytes', 'MB', -1)).toBe('1.00 MB');
    expect(formatSizeUnit(MB_IN_BYTES / 2, 'Bytes', 'MB', -20)).toBe('0.50 MB');
  });

  it('should handle same unit conversion', () => {
    expect(formatSizeUnit(100, 'MB', 'MB')).toBe('100.00 MB');
    expect(formatSizeUnit(500, 'KB', 'KB')).toBe('500.00 KB');
  });

  it('should convert between different units', () => {
    expect(formatSizeUnit(MB_IN_BYTES)).toBe('1.00 MB');
    expect(formatSizeUnit(1, 'GB', 'MB')).toBe('1024.00 MB');
    expect(formatSizeUnit(1024, 'KB', 'MB')).toBe('1.00 MB');
    expect(formatSizeUnit(1, 'MB', 'KB')).toBe('1024.00 KB');
    expect(formatSizeUnit(67633152, 'Bytes', 'MB')).toBe('64.50 MB');
  });
});
