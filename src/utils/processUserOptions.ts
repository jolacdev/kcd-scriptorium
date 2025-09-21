import { GameSupportedLanguage } from '../constants/constants.ts';
import { generateLocalizationFiles } from './generateLocalizationFiles.ts';
import { removeModFolder } from './xml/fileUtils.ts';

type UserOptions = {
  localization: {
    dialogColor?: string;
    mainLanguage?: GameSupportedLanguage;
    secondaryLanguage?: GameSupportedLanguage;
    hasCategories: boolean;
  };
  timers: {
    hasRemoveTimers: boolean;
  };
};

export const processUserOptions = async ({
  localization: { dialogColor, mainLanguage, secondaryLanguage, hasCategories },
  timers: { hasRemoveTimers },
}: UserOptions) => {
  removeModFolder();

  if (hasRemoveTimers) {
    // TODO: Remove timers.
  }

  const hasDualLanguage = Boolean(mainLanguage && secondaryLanguage);
  if (mainLanguage && (hasDualLanguage || hasCategories)) {
    try {
      await generateLocalizationFiles({
        dialogColor,
        mainLanguage,
        secondaryLanguage,
        hasCategories,
        hasDualLanguage,
      });
    } catch (error) {
      removeModFolder();
      console.error(error);
    }
  }
};
