import { t } from 'i18next';

import { appState } from '../../appState.ts';
import { runMenu } from '../runMenu.ts';
import { gameFolderMenu } from './gameFolderMenu.ts';
import { languageMenu } from './languageMenu.ts';

export const mainMenu = async () => {
  await runMenu(t('appTitle'), [
    {
      action: gameFolderMenu,
      key: 'selectInstallFolder',
      label: t('mainMenu.options.selectInstallFolder'),
    },
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
