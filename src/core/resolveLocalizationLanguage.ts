import { GameSupportedLanguage } from '../constants/constants.ts';

/**
 * Resolves the effective language for:
 * - Selecting the input/output localization PAK file (e.g., `Spanish_xml.pak`, `English_xml.pak`).
 * - Inform the user on which in-game language to select so the mod takes effect.
 *
 * Rules:
 * - Selects the secondary language if provided and not English, otherwise, it defaults to the main language.
 *
 * @param mainLanguage - Main language.
 * @param secondaryLanguage - Optional secondary language for dual-language.
 * @returns The language to be used for PAK file operations and in-game selection.
 */
export const resolveEffectiveLocalizationLanguage = (
  mainLanguage: GameSupportedLanguage,
  secondaryLanguage?: GameSupportedLanguage,
): GameSupportedLanguage =>
  secondaryLanguage && secondaryLanguage !== GameSupportedLanguage.ENGLISH
    ? secondaryLanguage
    : mainLanguage;
