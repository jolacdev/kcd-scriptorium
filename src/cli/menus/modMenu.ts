import i18next from 'i18next';

import { AppState } from '../../AppState.ts';
import { generateLocalizationFiles } from '../../utils/generateLocalizationFiles.ts';
import { getCorrespondingLocalizationPakPath } from '../../utils/getCorrespondingLocalizationPakPath.ts';
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

  const hasDualLanguage = selectedOptions.includes(OptionKey.DUAL_LANGUAGE);
  const hasDualLanguageWithColor = selectedOptions.includes(
    OptionKey.DUAL_LANGUAGE_WITH_COLOR,
  );
  const hasCategories = selectedOptions.includes(OptionKey.CATEGORIZE_ITEMS);

  const { dialogColor, mainLanguage, secondaryLanguage } = await modPromptsMenu(
    {
      hasCategories,
      hasDialogColor: hasDualLanguageWithColor,
      hasDualLanguage: hasDualLanguage || hasDualLanguageWithColor,
    },
  );

  if (!mainLanguage) {
    return;
  }

  const inputPak = getCorrespondingLocalizationPakPath(
    appState.gamePath!,
    mainLanguage,
    secondaryLanguage,
  );

  if (!inputPak) {
    // TODO: Handle
    return;
  }

  generateLocalizationFiles({
    dialogColor,
    inputPak,
    mainLanguage,
    hasCategories,
    hasDualLanguage: Boolean(mainLanguage && secondaryLanguage),
  });
};
