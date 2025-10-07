import { t } from 'i18next';
import path from 'path';

import {
  GameSupportedLanguage,
  KCD_MODS_FOLDER,
  LocalizationFile,
  ModFolder,
} from '../constants/constants.ts';
import { removeModFolder } from '../utils/fileUtils.ts';
import { AppState } from './AppState.ts';
import { generateLocalizationFiles } from './features/localization/generateLocalizationFiles.ts';
import { generateTimersFile } from './features/timers/generateTimersFile.ts';
import { resolveEffectiveLocalizationLanguage } from './resolveLocalizationLanguage.ts';

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
  const state = AppState.getInstance();

  removeModFolder();

  try {
    if (hasRemoveTimers) {
      await generateTimersFile();

      console.log(t('feedback.fileProcessing.removeTimers'));
    }

    const hasDualLanguage = !!mainLanguage && !!secondaryLanguage;
    const hasSelectedAnyLocalizationOption =
      mainLanguage && (hasDualLanguage || hasCategories);
    const effectiveInGameLanguage = mainLanguage
      ? resolveEffectiveLocalizationLanguage(mainLanguage, secondaryLanguage)
      : undefined;

    if (hasSelectedAnyLocalizationOption && effectiveInGameLanguage) {
      // NOTE: Rules to determine which localization files to generate.
      // - If isDebugMode or hasDualLanguage, generate all files.
      // - Otherwise, means only hasCategories is true, generate only Items file.
      const localizationFiles: LocalizationFile[] =
        state.isDebugMode || hasDualLanguage
          ? Object.values(LocalizationFile)
          : [LocalizationFile.Items];

      await generateLocalizationFiles({
        dialogColor,
        localizationFiles,
        mainLanguage,
        pakLanguage: effectiveInGameLanguage,
        hasCategories,
        hasDualLanguage,
      });

      console.log(t('feedback.fileProcessing.localization'));
    }

    console.log(`\n${t('feedback.modReady.base')}`);
    console.log(
      `${t('feedback.modReady.instructions', {
        modFolderName: ModFolder.Root,
        modsFullPath: path.join(state.gamePath!, KCD_MODS_FOLDER),
      })}`,
    );

    if (effectiveInGameLanguage) {
      console.log(
        t('feedback.modReady.localizationReminder', {
          language: t(
            `common.gameSupportedLanguages.${effectiveInGameLanguage}`,
          ),
        }),
      );
    }
  } catch (error) {
    removeModFolder();
    console.error(error);
    process.exit(1);
  }

  state.requestExit();
};
