import i18next from 'i18next';
import type { TFunction } from 'i18next';
import type { Choice } from 'prompts';

import { AppState } from '../../AppState.ts';
import { SupportedLanguage } from '../../config/i18n.ts';
import { prompt } from '../prompt.ts';

const handleChangeLanguage = async (
  language: SupportedLanguage,
): Promise<void> => {
  await i18next.changeLanguage(language);

  if (i18next.resolvedLanguage === language) {
    AppState.getInstance().setLanguage(language);
  }
};

const generateLanguageOptionLabel = (
  language: SupportedLanguage,
  t: TFunction,
) => {
  const isCurrentLanguage = i18next.resolvedLanguage === language;
  const languageLabel = t(`options.${language}`);
  const currentLabel = isCurrentLanguage ? t('current') : '';

  return `${languageLabel} ${currentLabel}`;
};

export const languageMenu = async () => {
  const t = i18next.getFixedT(null, null, 'languageMenu');

  const languageOptions: Choice[] = Object.values(SupportedLanguage).map(
    (lang) => ({
      title: generateLanguageOptionLabel(lang, t),
      value: lang,
    }),
  );

  const { value } = <{ value: SupportedLanguage }>await prompt({
    choices: languageOptions,
    message: t('title'),
    name: 'value',
    type: 'select',
  });

  if (value) {
    await handleChangeLanguage(value);
  }
};
