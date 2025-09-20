import path from 'path';

import {
  Folder,
  GameSupportedLanguage,
  localizationPakMap,
} from '../constants/constants.ts';
import { isPakFile, type PakFilePath } from './pakUtils.ts';

/**
 * Returns the full path to the localization PAK file for a given language selection.
 *
 * The function selects the secondary language if provided and not English;
 * otherwise, it defaults to the main language. It then maps the language
 * to the corresponding PAK file and verifies that the file exists.
 *
 * @param gamePath - Root path of the game installation.
 * @param mainLanguage - Primary language to use for localization.
 * @param secondaryLanguage - Optional secondary language to override main (ignored if English).
 * @returns The full path to the corresponding localization PAK if it exists; otherwise `undefined`.
 */
export const getCorrespondingLocalizationPakPath = (
  gamePath: string,
  mainLanguage: GameSupportedLanguage,
  secondaryLanguage?: GameSupportedLanguage,
): PakFilePath | undefined => {
  const pakLanguage =
    secondaryLanguage && secondaryLanguage !== GameSupportedLanguage.ENGLISH
      ? secondaryLanguage
      : mainLanguage;
  const localizationPak = localizationPakMap[pakLanguage];
  const pakPath = path.join(gamePath, Folder.Localization, localizationPak);

  if (!isPakFile(pakPath)) {
    return;
  }

  return pakPath;
};
