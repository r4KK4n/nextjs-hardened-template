import { describe, it, expect } from 'vitest';
import { formatDate, formatCurrency, truncate, capitalize } from './format';

describe('format utilities', () => {
  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should format date string correctly', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('January');
    });
  });

  describe('formatCurrency', () => {
    it('should format USD by default', () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe('$1,234.56');
    });

    it('should format other currencies', () => {
      const result = formatCurrency(1234.56, 'EUR');
      expect(result).toContain('1,234.56');
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toBe('$0.00');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text';
      const result = truncate(text, 10);
      expect(result).toBe('This is a ...');
    });

    it('should not truncate short text', () => {
      const text = 'Short';
      const result = truncate(text, 10);
      expect(result).toBe('Short');
    });

    it('should handle empty string', () => {
      const result = truncate('', 10);
      expect(result).toBe('');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      const result = capitalize('hello');
      expect(result).toBe('Hello');
    });

    it('should handle already capitalized text', () => {
      const result = capitalize('Hello');
      expect(result).toBe('Hello');
    });

    it('should handle empty string', () => {
      const result = capitalize('');
      expect(result).toBe('');
    });
  });
});
