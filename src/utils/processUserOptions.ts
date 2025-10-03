import { t } from 'i18next';
import { AppState } from '../AppState.ts';
import {
  GameSupportedLanguage,
  KCD_MODS_FOLDER,
  LocalizationFile,
  localizationFilesMap,
  ModFolder,
} from '../constants/constants.ts';
import { generateLocalizationFiles } from './generateLocalizationFiles.ts';
import { generateTimersFile } from './generateTimersFile.ts';
import { resolveEffectiveLocalizationLanguage } from './resolveLocalizationLanguage.ts';
import { removeModFolder } from './xml/fileUtils.ts';
import path from 'path';

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

      console.log(t('feedback.fileProcessing.removeTimers'));
    }

    const hasDualLanguage = Boolean(mainLanguage && secondaryLanguage);
    if (mainLanguage && (hasDualLanguage || hasCategories)) {
      const effectiveInGameLanguage = resolveEffectiveLocalizationLanguage(
        mainLanguage,
        secondaryLanguage,
      );
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
        pakLanguage: effectiveInGameLanguage,
        hasCategories,
        hasDualLanguage,
      });

      console.log(
        t('feedback.fileProcessing.localization', {
          language: t(
            `common.gameSupportedLanguages.${effectiveInGameLanguage}`,
          ),
        }),
      );
    }

    console.log(
      t('feedback.modReady', {
        modFolderName: ModFolder.Root,
        modsFullPath: path.join(appState.gamePath!, KCD_MODS_FOLDER),
      }),
    );
  } catch (error) {
    removeModFolder();
    console.error(error);
    process.exit(1);
  }

  appState.requestExit();
};
