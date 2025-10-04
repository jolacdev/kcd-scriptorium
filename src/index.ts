import { t } from 'i18next';

import { mainMenu } from './cli/menus/mainMenu.ts';
import { setupMenu } from './cli/menus/setupMenu.ts';
import { initI18n, SupportedLanguage } from './config/i18n.ts';
import { AppState } from './core/AppState.ts';

const state = AppState.getInstance();
await initI18n(state.language ?? SupportedLanguage.ENGLISH);

if (!state.language || !state.gamePath) {
  await setupMenu();
}

while (!state.exit) {
  await mainMenu();
}

console.log(t('feedback.pressAnyKeyToExit'));
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', () => process.exit(0));
