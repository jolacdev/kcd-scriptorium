import { AppState } from '../../core/AppState.ts';
import { gameFolderMenu } from './gameFolderMenu.ts';
import { languageMenu } from './languageMenu.ts';

export const setupMenu = async () => {
  const state = AppState.getInstance();

  if (!state.language) {
    await languageMenu();
  }

  if (!state.language) {
    state.requestExit();
    return;
  }

  if (!state.gamePath) {
    await gameFolderMenu();
  }

  if (!state.gamePath) {
    state.requestExit();
    return;
  }
};
