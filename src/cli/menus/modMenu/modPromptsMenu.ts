import i18next from 'i18next';
import type { Choice } from 'prompts';

import { GameSupportedLanguage } from '../../../constants/constants.ts';
import { prompt } from '../../prompt.ts';

type ModPromptsOptions = {
  hasSelectedCategories: boolean;
  hasSelectedDualLanguage: boolean;
  hasSelectedDualLanguageWithColor: boolean;
};

type ModPromptResult = {
  dialogColor?: string;
  mainLanguage?: GameSupportedLanguage;
  secondaryLanguage?: GameSupportedLanguage;
};

const DEFAULT_DIALOG_COLOR = '#F7E095';
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{6})$/;

export const modPromptsMenu = async ({
  hasSelectedCategories,
  hasSelectedDualLanguage,
  hasSelectedDualLanguageWithColor,
}: ModPromptsOptions): Promise<ModPromptResult> => {
  const t = i18next.getFixedT(null, null, 'moddingMenu.modPromptsMenu');

  const gameLanguageOptions: Choice[] = Object.values(
    GameSupportedLanguage,
  ).map((lang) => ({
    title: i18next.t(`common.gameSupportedLanguages.${lang}`),
    value: lang,
  }));

  const { dialogColor, mainLanguage, secondaryLanguage } = <ModPromptResult>(
    await prompt([
      {
        choices: gameLanguageOptions,
        message: t('prompts.selectLanguage.main'),
        name: 'mainLanguage',
        type:
          hasSelectedDualLanguage || hasSelectedCategories ? 'select' : null,
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
          hasSelectedDualLanguage && prev ? 'select' : null,
      },
      {
        initial: DEFAULT_DIALOG_COLOR,
        name: 'dialogColor',
        type: hasSelectedDualLanguageWithColor ? 'text' : null,
        message: t('prompts.dialogColor', {
          color: DEFAULT_DIALOG_COLOR,
        }),
        validate: (val: string) =>
          HEX_COLOR_REGEX.test(val) ? true : t('validations.invalidHexColor'),
      },
    ])
  );

  return { dialogColor, mainLanguage, secondaryLanguage };
};
