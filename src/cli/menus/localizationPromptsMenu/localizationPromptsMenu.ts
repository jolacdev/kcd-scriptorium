import i18next from 'i18next';
import type { Choice } from 'prompts';

import { GameSupportedLanguage } from '../../../constants/constants.ts';
import { prompt } from '../../prompt.ts';

const DEFAULT_DIALOG_COLOR = '#F7E095';
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{6})$/;

type LocalizationPromptResult = {
  dialogColor?: string;
  mainLanguage?: GameSupportedLanguage;
  secondaryLanguage?: GameSupportedLanguage;
};

type LocalizationPromptOptions = {
  hasColorOption: boolean;
  hasSecondaryLanguageOption: boolean;
};

export const localizationPromptsMenu = async ({
  hasColorOption,
  hasSecondaryLanguageOption,
}: LocalizationPromptOptions): Promise<LocalizationPromptResult> => {
  const t = i18next.getFixedT(
    null,
    null,
    'moddingMenu.localizationPromptsMenu',
  );

  const gameLanguageOptions: Choice[] = Object.values(
    GameSupportedLanguage,
  ).map((lang) => ({
    title: i18next.t(`common.gameSupportedLanguages.${lang}`),
    value: lang,
  }));

  const { dialogColor, mainLanguage, secondaryLanguage } = <
    LocalizationPromptResult
  >await prompt([
    {
      choices: gameLanguageOptions,
      message: t('prompts.selectLanguage.main'),
      name: 'mainLanguage',
      type: 'select',
    },
    {
      message: t('prompts.selectLanguage.secondary'),
      name: 'secondaryLanguage',
      choices: (prev: GameSupportedLanguage) =>
        gameLanguageOptions.filter(({ value }) =>
          prev === GameSupportedLanguage.ENGLISH
            ? value !== prev
            : value === GameSupportedLanguage.ENGLISH,
        ),
      type: (prev: GameSupportedLanguage) =>
        hasSecondaryLanguageOption && prev ? 'select' : null,
    },
    {
      initial: DEFAULT_DIALOG_COLOR,
      name: 'dialogColor',
      type: hasColorOption ? 'text' : null,
      message: t('prompts.dialogColor', {
        color: DEFAULT_DIALOG_COLOR,
      }),
      validate: (val: string) =>
        HEX_COLOR_REGEX.test(val) ? true : t('validations.invalidHexColor'),
    },
  ]);

  return { dialogColor, mainLanguage, secondaryLanguage };
};
