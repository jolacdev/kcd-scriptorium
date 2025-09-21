import i18next from 'i18next';

import { AppState } from '../../AppState.ts';
import { generateLocalizationFiles } from '../../utils/generateLocalizationFiles.ts';
import { removeModFolder } from '../../utils/xml/fileUtils.ts';
import { prompt } from '../prompt.ts';
import { modPromptsMenu } from './modMenu/modPromptsMenu.ts';

enum OptionKey {
  CATEGORIZE_ITEMS = 'categorizeItems',
  DUAL_LANGUAGE = 'dualLanguage',
  DUAL_LANGUAGE_WITH_COLOR = 'dualLanguageWithColor',
  REMOVE_TIMERS = 'removeTimers',
}

export const modMenu = async () => {
  const appState = AppState.getInstance();
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

  const { selectedOptions } = <{ selectedOptions?: OptionKey[] }>await prompt({
    choices: modOptions,
    message: t('title'),
    min: 1,
    name: 'selectedOptions',
    type: 'multiselect',
  });

  if (!selectedOptions || !selectedOptions.length) {
    return;
  }

  const hasSelectedDualLanguage = selectedOptions.includes(
    OptionKey.DUAL_LANGUAGE,
  );
  const hasSelectedDualLanguageWithColor = selectedOptions.includes(
    OptionKey.DUAL_LANGUAGE_WITH_COLOR,
  );
  const hasSelectedCategories = selectedOptions.includes(
    OptionKey.CATEGORIZE_ITEMS,
  );

  const { dialogColor, mainLanguage, secondaryLanguage } = await modPromptsMenu(
    {
      hasSelectedCategories,
      hasSelectedDualLanguage:
        hasSelectedDualLanguage || hasSelectedDualLanguageWithColor,
      hasSelectedDualLanguageWithColor,
    },
  );

  removeModFolder();

  const hasDualLanguage = Boolean(mainLanguage && secondaryLanguage);
  if (mainLanguage && (hasDualLanguage || hasSelectedCategories)) {
    generateLocalizationFiles({
      dialogColor,
      mainLanguage,
      secondaryLanguage,
      hasCategories: hasSelectedCategories,
      hasDualLanguage,
    });
  }
};
