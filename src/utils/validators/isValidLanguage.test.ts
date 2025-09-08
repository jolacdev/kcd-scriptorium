import { describe, expect, it } from 'vitest';

import { SupportedLanguage } from '../../config/i18n.ts';
import { isValidLanguage } from './isValidLanguage.ts';

describe('isValidLanguage', () => {
  it('returns true for each supported language', () => {
    Object.values(SupportedLanguage).forEach((lang) => {
      expect(isValidLanguage(lang)).toBeTruthy();
    });
  });

  it('returns false for strings not in SupportedLanguage', () => {
    ['fr', 'de', 'it', 'test', '', ' '].forEach((lang) => {
      expect(isValidLanguage(lang)).toBeFalsy();
    });
  });

  it('returns false for invalid input types', () => {
    [null, undefined, 123, {}, [], true, false].forEach((input) => {
      // @ts-expect-error testing invalid input
      expect(isValidLanguage(input)).toBeFalsy();
    });
  });
});
