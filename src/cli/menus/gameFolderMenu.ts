import fs from 'fs';
import i18next from 'i18next';
import path from 'path';
import prompts from 'prompts';

const RELATIVE_EXE_PATH = 'Bin/Win64/KingdomCome.exe';

export const gameFolderMenu = async () => {
  const t = i18next.getFixedT(null, null, 'gameFolderMenu');

  const response = await prompts({
    message: t('title'),
    name: 'folderPath',
    type: 'text',
    validate: (input: string) => {
      if (!input.trim()) {
        return t('validations.emptyPath');
      }

      if (!fs.existsSync(input)) {
        return t('validations.nonExistentPath');
      }

      const absoluteExePath = path.join(input, RELATIVE_EXE_PATH);
      if (!fs.existsSync(absoluteExePath)) {
        return t('validations.invalidKCDFolder');
      }

      return true;
    },
  });

  return response.folderPath;
};
