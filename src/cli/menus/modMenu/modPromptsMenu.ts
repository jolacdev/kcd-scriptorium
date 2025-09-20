import i18next from 'i18next';
import type { Choice } from 'prompts';

import { GameSupportedLanguage } from '../../../constants/constants.ts';
import { prompt } from '../../prompt.ts';

type ModPromptsOptions = {
  hasCategories: boolean;
  hasDialogColor: boolean;
  hasDualLanguage: boolean;
};

type ModPromptResult = {
  dialogColor?: string;
  mainLanguage?: GameSupportedLanguage;
  secondaryLanguage?: GameSupportedLanguage;
};

const DEFAULT_DIALOG_COLOR = '#F7E095';
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{6})$/;

export const modPromptsMenu = async ({
  hasCategories,
  hasDialogColor,
  hasDualLanguage,
}: ModPromptsOptions): Promise<ModPromptResult> => {
  const t = i18next.getFixedT(null, null, 'moddingMenu.modPromptsMenu');

  const gameLanguageOptions: Choice[] = Object.values(
    GameSupportedLanguage,
  ).map((lang) => ({
    title: t(`gameSupportedLanguages.${lang}`),
    value: lang,
  }));

  const { dialogColor, mainLanguage, secondaryLanguage } = <ModPromptResult>(
    await prompt([
      {
        choices: gameLanguageOptions,
        message: t('prompts.selectLanguage.main'),
        name: 'mainLanguage',
        type: hasDualLanguage || hasCategories ? 'select' : null,
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
          hasDualLanguage && prev ? 'select' : null,
      },
      {
        initial: DEFAULT_DIALOG_COLOR,
        name: 'dialogColor',
        type: hasDialogColor ? 'text' : null,
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
