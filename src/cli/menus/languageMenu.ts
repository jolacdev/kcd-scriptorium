import i18next from 'i18next';
import type { TFunction } from 'i18next';

import { SupportedLanguage } from '../../config/i18n.ts';
import { runMenu } from '../runMenu.ts';
import type { Option } from '../runMenu.ts';
import { setStoreSetting } from '../../config/store.ts';

const handleChangeLanguage = async (
  language: SupportedLanguage,
): Promise<void> => {
  await i18next.changeLanguage(language);

  if (i18next.resolvedLanguage === language) {
    setStoreSetting('language', language);
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

  const languageOptions: Option[] = Object.values(SupportedLanguage).map(
    (lang) => ({
      key: lang,
      label: generateLanguageOptionLabel(lang, t),
      action: () => handleChangeLanguage(lang),
    }),
  );

  await runMenu(t('languageMenuTitle'), languageOptions);
};
