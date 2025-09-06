import { AppState } from './AppState.ts';
import { mainMenu } from './cli/menus/mainMenu.ts';
import { setupMenu } from './cli/menus/setupMenu.ts';
import { initI18n, SupportedLanguage } from './config/i18n.ts';

const state = AppState.getInstance();
await initI18n(state.language ?? SupportedLanguage.ENGLISH);

if (!state.gamePath || !state.language) {
  await setupMenu();
}

while (!state.exit) {
  await mainMenu();
}
