import fs from 'fs';
import i18next from 'i18next';

import { AppState } from '../../core/AppState.ts';
import { isValidGamePath } from '../../utils/validators/isValidGamePath.ts';
import { prompt } from '../prompt.ts';

const DEFAULT_INSTALL_PATH =
  'C:\\Program Files (x86)\\Steam\\steamapps\\common\\KingdomComeDeliverance';

export const gameFolderMenu = async () => {
  const state = AppState.getInstance();
  const t = i18next.getFixedT(null, null, 'gameFolderMenu');

  const defaultInstallPath = fs.existsSync(DEFAULT_INSTALL_PATH)
    ? DEFAULT_INSTALL_PATH
    : undefined;
  const initial = state.gamePath ?? defaultInstallPath;

  const { value } = await prompt({
    initial,
    message: t('title'),
    name: 'value',
    type: 'text',
    validate: (input: string) => {
      if (!input.trim()) {
        return t('validations.emptyPath');
      }

      if (!fs.existsSync(input)) {
        return t('validations.nonExistentPath');
      }

      if (!isValidGamePath(input)) {
        return t('validations.invalidKCDFolder');
      }

      return true;
    },
  });

  if (value) {
    state.setGamePath(value);
  }
};
