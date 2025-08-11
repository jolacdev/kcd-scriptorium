import { appState } from './appState.ts';
import { mainMenu } from './cli/menus/mainMenu.ts';
import { initI18n } from './config/i18n.ts';

await initI18n();

while (!appState.exit) {
  await mainMenu();
}
