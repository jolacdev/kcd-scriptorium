import { SupportedLanguage } from '../../config/i18n.ts';

export const isValidLanguage = (
  language: string | SupportedLanguage,
): language is SupportedLanguage =>
  Object.values(SupportedLanguage).includes(language as SupportedLanguage);
