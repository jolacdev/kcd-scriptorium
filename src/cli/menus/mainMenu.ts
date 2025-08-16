import { t } from 'i18next';

import { getStoreSetting, hasStoreSetting } from '../../config/store.ts';
import { prompt } from '../prompt.ts';
import { exitMenu } from './exitMenu.ts';
import { gameFolderMenu } from './gameFolderMenu.ts';
import { languageMenu } from './languageMenu.ts';
import { modMenu } from './modMenu.ts';

const isGamePathSet = hasStoreSetting('gamePath');

enum OptionKey {
  CHANGE_LANGUAGE = 'changeLanguage',
  EXIT = 'exit',
  MODDING_TOOLKIT = 'moddingToolkit',
  SELECT_INSTALL_FOLDER = 'selectInstallFolder',
}

const menuOptions: Record<OptionKey, () => Promise<void>> = {
  changeLanguage: languageMenu,
  exit: exitMenu,
  moddingToolkit: modMenu,
  selectInstallFolder: gameFolderMenu,
};

export const mainMenu = async () => {
  // TODO: Update game directory selection in a global variable or somewhere so it can be updated without restarting the app.
  const { value } = <{ value: OptionKey }>await prompt({
    message: t('appTitle'),
    name: 'value',
    type: 'select',
    choices: [
      ...(isGamePathSet
        ? [
            {
              title: t('mainMenu.options.moddingToolkit'),
              value: OptionKey.MODDING_TOOLKIT,
            } as const,
          ]
        : []),
      {
        title: `${t('mainMenu.options.selectInstallFolder')}${isGamePathSet ? ` (${getStoreSetting('gamePath')})` : ''}`,
        value: OptionKey.SELECT_INSTALL_FOLDER,
      },
      {
        title: t('mainMenu.options.changeLanguage'),
        value: OptionKey.CHANGE_LANGUAGE,
      },
      {
        title: t('mainMenu.options.exit'),
        value: OptionKey.EXIT,
      },
    ],
  });

  if (menuOptions[value]) {
    await menuOptions[value]();
  }
};
