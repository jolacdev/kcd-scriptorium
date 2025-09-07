import fs from 'fs';
import i18next from 'i18next';

import { AppState } from '../../AppState.ts';
import { isValidGamePath } from '../../utils/validators/isValidGamePath.ts';
import { prompt } from '../prompt.ts';

export const gameFolderMenu = async () => {
  const t = i18next.getFixedT(null, null, 'gameFolderMenu');

  const { value } = await prompt({
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
    AppState.getInstance().setGamePath(value);
  }
};
