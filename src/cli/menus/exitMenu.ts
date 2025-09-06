import i18next from 'i18next';

import { AppState } from '../../AppState.ts';
import { prompt } from '../prompt.ts';

export const exitMenu = async () => {
  const t = i18next.getFixedT(null, null, 'exitMenu');

  const { isExit } = await prompt({
    active: t('options.yes'),
    inactive: t('options.no'),
    initial: false,
    message: t('title'),
    name: 'isExit',
    type: 'toggle',
  });

  if (isExit) {
    AppState.getInstance().requestExit();
  }
};
