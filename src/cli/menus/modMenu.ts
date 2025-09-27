import i18next from 'i18next';
import type { Choice } from 'prompts';

import { GameSupportedLanguage } from '../../constants/constants.ts';
import { processUserOptions } from '../../utils/processUserOptions.ts';
import { prompt } from '../prompt.ts';

enum OptionKey {
  CATEGORIZE_ITEMS = 'categorizeItems',
  DUAL_LANGUAGE = 'dualLanguage',
  REMOVE_TIMERS = 'removeTimers',
}

const DEFAULT_DIALOG_COLOR = '#F7E095';
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{6})$/;

export const modMenu = async () => {
  const t = i18next.getFixedT(null, null, 'modMenu');

  const gameLanguageOptions: Choice[] = Object.values(
    GameSupportedLanguage,
  ).map((lang) => ({
    title: i18next.t(`common.gameSupportedLanguages.${lang}`),
    value: lang,
  }));

  const choices: { title: string; value: OptionKey }[] = [
    {
      title: t('options.mainFlags.dualLanguage'),
      value: OptionKey.DUAL_LANGUAGE,
    },
    {
      title: t('options.mainFlags.categorizeItems'),
      value: OptionKey.CATEGORIZE_ITEMS,
    },
    {
      title: t('options.mainFlags.removeTimers'),
      value: OptionKey.REMOVE_TIMERS,
    },
  ];

  let hasExit = false;

  const { dialogColor, mainLanguage, mainOptions = [], secondaryLanguage } = <
    {
      dialogColor?: string;
      mainLanguage?: GameSupportedLanguage;
      mainOptions?: OptionKey[];
      secondaryLanguage?: GameSupportedLanguage;
    }
  >await prompt(
    [
      {
        choices,
        message: t('title'),
        min: 1,
        name: 'mainOptions',
        type: 'multiselect',
      },
      {
        choices: gameLanguageOptions,
        message: t('options.selectLanguage.main'),
        name: 'mainLanguage',
        type: (prev?: OptionKey[]) => {
          const shouldAskMainLanguage =
            prev?.includes(OptionKey.DUAL_LANGUAGE) ||
            prev?.includes(OptionKey.CATEGORIZE_ITEMS);

          return shouldAskMainLanguage ? 'select' : null;
        },
      },
      {
        message: t('options.selectLanguage.secondary'),
        name: 'secondaryLanguage',
        // NOTE: If mainLanguage is EN, secondary options exclude EN; otherwise (e.g., ES), secondary options are only EN.
        choices: (prev: GameSupportedLanguage) =>
          gameLanguageOptions.filter(({ value }) =>
            prev === GameSupportedLanguage.ENGLISH
              ? value !== prev
              : value === GameSupportedLanguage.ENGLISH,
          ),
        type: (
          _,
          { mainLanguage: selectedLanguage, mainOptions: selectedOptions },
        ) => {
          const shouldAskSecondaryLanguageOption =
            selectedLanguage &&
            selectedOptions?.includes(OptionKey.DUAL_LANGUAGE);

          return shouldAskSecondaryLanguageOption && selectedLanguage
            ? 'select'
            : null;
        },
      },
      {
        initial: true,
        message: t('options.selectColor.useColor'),
        name: 'useColor',
        type: (
          _,
          {
            mainLanguage: selectedMainLanguage,
            secondaryLanguage: selectedSecondaryLanguage,
          },
        ) =>
          selectedMainLanguage && selectedSecondaryLanguage ? 'confirm' : null,
      },
      {
        initial: DEFAULT_DIALOG_COLOR,
        name: 'dialogColor',
        message: t('options.selectColor.dialogColor', {
          color: DEFAULT_DIALOG_COLOR,
        }),
        type: (_, { useColor: selectedUseColor }) =>
          selectedUseColor ? 'text' : null,
        validate: (val: string) =>
          HEX_COLOR_REGEX.test(val) ? true : t('validations.invalidHexColor'),
      },
    ],
    {
      onCancel: () => {
        hasExit = true;
      },
    },
  );

  if (hasExit) {
    return;
  }

  await processUserOptions({
    localization: {
      dialogColor,
      mainLanguage,
      secondaryLanguage,
      hasCategories: mainOptions.includes(OptionKey.CATEGORIZE_ITEMS),
    },
    timers: {
      hasRemoveTimers: mainOptions.includes(OptionKey.REMOVE_TIMERS),
    },
  });
};
