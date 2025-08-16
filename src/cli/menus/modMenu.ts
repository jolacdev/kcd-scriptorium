import i18next from 'i18next';

import { prompt } from '../prompt.ts';

export const modMenu = async () => {
  const t = i18next.getFixedT(null, null, 'moddingMenu');

  enum OptionKey {
    CATEGORIZE_ITEMS = 'categorizeItems',
    DUAL_SUBS = 'dualSubs',
    REMOVE_TIMERS = 'removeTimers',
  }

  const modOptions = [
    { title: t('options.dualSubs'), value: OptionKey.DUAL_SUBS },
    { title: t('options.categorizeItems'), value: OptionKey.CATEGORIZE_ITEMS },
    {
      title: t('options.removeTimers'),
      value: OptionKey.REMOVE_TIMERS,
    },
  ];

  const { value } = <{ value: OptionKey[] }>await prompt({
    choices: modOptions,
    message: t('title'),
    min: 1,
    name: 'value',
    type: 'multiselect',
  });

  if (value.length) {
    console.log({ selectedItems: value }); // TODO: Change
  }
};
