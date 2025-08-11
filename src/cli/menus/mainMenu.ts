import i18next from 'i18next';

import { appState } from '../../appState.ts';
import { runMenu } from '../runMenu.ts';

const { changeLanguage, t } = i18next;

export const mainMenu = async () => {
  await runMenu(t('appTitle'), [
    {
      key: 'changeLanguage',
      label: t('mainMenu.options.changeLanguage'),
      action: async () => {
        // TODO: Implement correct language change logic based on user input.
        await changeLanguage(i18next.resolvedLanguage === 'en' ? 'es' : 'en');
      },
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
