import i18next from 'i18next';

import { processUserOptions } from '../../utils/processUserOptions.ts';
import { prompt } from '../prompt.ts';
import { modPromptsMenu } from './modMenu/modPromptsMenu.ts';

enum OptionKey {
  CATEGORIZE_ITEMS = 'categorizeItems',
  DUAL_LANGUAGE = 'dualLanguage',
  DUAL_LANGUAGE_WITH_COLOR = 'dualLanguageWithColor',
  REMOVE_TIMERS = 'removeTimers',
}

export const modMenu = async () => {
  const t = i18next.getFixedT(null, null, 'moddingMenu');

  const modOptions: { title: string; value: OptionKey }[] = [
    { title: t('options.dualLanguage'), value: OptionKey.DUAL_LANGUAGE },
    {
      title: t('options.dualLanguageWithColor'),
      value: OptionKey.DUAL_LANGUAGE_WITH_COLOR,
    },
    { title: t('options.categorizeItems'), value: OptionKey.CATEGORIZE_ITEMS },
    {
      title: t('options.removeTimers'),
      value: OptionKey.REMOVE_TIMERS,
    },
  ];

  const { selectedOptions = [] } = <{ selectedOptions?: OptionKey[] }>(
    await prompt({
      choices: modOptions,
      message: t('title'),
      min: 1,
      name: 'selectedOptions',
      type: 'multiselect',
    })
  );

  const isSelected = (key: OptionKey) => selectedOptions.includes(key);

  const { dialogColor, mainLanguage, secondaryLanguage } = await modPromptsMenu(
    {
      hasColorOption: isSelected(OptionKey.DUAL_LANGUAGE_WITH_COLOR),
      hasSecondaryLanguageOption:
        isSelected(OptionKey.DUAL_LANGUAGE) ||
        isSelected(OptionKey.DUAL_LANGUAGE_WITH_COLOR),
    },
  );

  processUserOptions({
    localization: {
      dialogColor,
      mainLanguage,
      secondaryLanguage,
      hasCategories: isSelected(OptionKey.CATEGORIZE_ITEMS),
    },
    timers: {
      hasRemoveTimers: isSelected(OptionKey.REMOVE_TIMERS),
    },
  });
};
