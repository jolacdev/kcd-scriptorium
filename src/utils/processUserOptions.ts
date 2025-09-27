import { AppState } from '../AppState.ts';
import {
  GameSupportedLanguage,
  LocalizationFile,
  localizationFilesMap,
} from '../constants/constants.ts';
import { generateLocalizationFiles } from './generateLocalizationFiles.ts';
import { generateTimersFile } from './generateTimersFile.ts';
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
  const appState = AppState.getInstance();

  removeModFolder();

  try {
    if (hasRemoveTimers) {
      await generateTimersFile();
    }

    const hasDualLanguage = Boolean(mainLanguage && secondaryLanguage);
    if (mainLanguage && (hasDualLanguage || hasCategories)) {
      let localizationFiles: LocalizationFile[];

      // NOTE: Rules to determine which localization files to generate.
      // - If isDebugMode, generate all files.
      // - If hasDualLanguage, generate only the dual-language supported files.
      // - Otherwise, means only hasCategories is true, generate only Items file.
      if (appState.isDebugMode) {
        localizationFiles = Object.values(LocalizationFile);
      } else if (hasDualLanguage) {
        localizationFiles = (
          Object.keys(localizationFilesMap) as LocalizationFile[]
        ).filter((key) => localizationFilesMap[key].supported);
      } else {
        localizationFiles = [LocalizationFile.Items];
      }

      await generateLocalizationFiles({
        dialogColor,
        localizationFiles,
        mainLanguage,
        secondaryLanguage,
        hasCategories,
        hasDualLanguage,
      });
    }
  } catch (error) {
    removeModFolder();
    console.error(error);
    process.exit(1);
  }

  // TODO: Inform user that the mod is ready and tell them which in-game language to select for it to work.
  appState.requestExit();
};
