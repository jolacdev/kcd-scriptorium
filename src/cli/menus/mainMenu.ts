import { t } from 'i18next';

import { appState } from '../../appState.ts';
import { runMenu } from '../runMenu.ts';
import { languageMenu } from './languageMenu.ts';

export const mainMenu = async () => {
  await runMenu(t('appTitle'), [
    {
      action: languageMenu,
      key: 'changeLanguage',
      label: t('mainMenu.options.changeLanguage'),
    },
    {
      key: 'exit',
      label: t('mainMenu.options.exit'),
      action: async () => {
        appState.exit = true;
      },
    },
  ]);
};
