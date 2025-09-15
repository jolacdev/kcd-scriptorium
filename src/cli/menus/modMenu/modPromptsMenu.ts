import i18next from 'i18next';
import type { Choice } from 'prompts';

import { GameSupportedLanguage } from '../../../constants/constants.ts';
import { prompt } from '../../prompt.ts';

type ModPromptsOptions = {
  hasAnyDualSubs: boolean;
  hasCategories: boolean;
  hasDualSubsAdvanced: boolean;
};

type ModPromptResult = {
  mainLanguage?: GameSupportedLanguage;
  secondaryLanguage?: GameSupportedLanguage;
  subtitleColor?: string;
  hasPrefixes?: boolean;
};

const DEFAULT_SUBTITLE_COLOR = '#F7E095';
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{6})$/;

export const modPromptsMenu = async ({
  hasAnyDualSubs,
  hasCategories,
  hasDualSubsAdvanced,
}: ModPromptsOptions): Promise<ModPromptResult> => {
  const t = i18next.getFixedT(null, null, 'moddingMenu.modPromptsMenu');

  const gameLanguageOptions: Choice[] = Object.values(
    GameSupportedLanguage,
  ).map((lang) => ({
    title: t(`gameSupportedLanguages.${lang}`),
    value: lang,
  }));

  const {
    mainLanguage,
    secondaryLanguage,
    subtitleColor,
    hasPrefixes = false,
  } = <
    {
      mainLanguage?: GameSupportedLanguage;
      secondaryLanguage?: GameSupportedLanguage;
      subtitleColor?: string;
      hasPrefixes?: boolean;
    }
  >await prompt([
    {
      choices: gameLanguageOptions,
      message: t('prompts.selectLanguage.main'),
      name: 'mainLanguage',
      type: hasAnyDualSubs || hasCategories ? 'select' : null,
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
        hasAnyDualSubs && prev ? 'select' : null,
    },
    {
      initial: false,
      message: t('prompts.dualSubsAdvanced.hasPrefixes'),
      name: 'hasPrefixes',
      type: hasDualSubsAdvanced ? 'confirm' : null,
    },
    {
      initial: false,
      message: t('prompts.dualSubsAdvanced.hasColor'),
      name: 'hasColor',
      type: hasDualSubsAdvanced ? 'confirm' : null,
    },
    {
      initial: DEFAULT_SUBTITLE_COLOR,
      name: 'subtitleColor',
      message: t('prompts.dualSubsAdvanced.subtitleColor', {
        color: DEFAULT_SUBTITLE_COLOR,
      }),
      type: (prev: boolean) => (hasDualSubsAdvanced && prev ? 'text' : null),
      validate: (val: string) =>
        HEX_COLOR_REGEX.test(val) ? true : t('validations.invalidHexColor'),
    },
  ]);

  return { mainLanguage, secondaryLanguage, subtitleColor, hasPrefixes };
};
