import { t } from 'i18next';

import { AppState } from '../../AppState.ts';
import { getStoreSetting, hasStoreSetting } from '../../config/store.ts';
import { prompt } from '../prompt.ts';
import { exitMenu } from './exitMenu.ts';
import { gameFolderMenu } from './gameFolderMenu.ts';
import { languageMenu } from './languageMenu.ts';
import { modMenu } from './modMenu.ts';

export enum OptionKey {
  CHANGE_INSTALL_FOLDER = 'changeInstallFolder',
  CHANGE_LANGUAGE = 'changeLanguage',
  EXIT = 'exit',
  MODDING_TOOLKIT = 'moddingToolkit',
}

const menuOptions: Record<OptionKey, () => Promise<void>> = {
  changeInstallFolder: gameFolderMenu,
  changeLanguage: languageMenu,
  exit: exitMenu,
  moddingToolkit: modMenu,
};

export const mainMenu = async () => {
  const isGamePathSet = hasStoreSetting('gamePath');

  const { value } = <{ value: OptionKey }>await prompt(
    {
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
          title: `${t('mainMenu.options.changeInstallFolder')}${isGamePathSet ? ` (${getStoreSetting('gamePath')})` : ''}`,
          value: OptionKey.CHANGE_INSTALL_FOLDER,
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
    },
    {
      onCancel: () => {
        AppState.getInstance().requestExit();
      },
    },
  );

  if (menuOptions[value]) {
    await menuOptions[value]();
  }
};
