import { BR, INLINE_SEPARATOR } from './constants.ts';
import type { SoulTransformerOptions } from './types.ts';

/**
 * @note This function is intended to work with `text_ui_soul.xml` translations.
 *
 * Transforms a translation:
 * - Adds dual-language (for descriptions) if `hasDualLanguage` is true and a translation exists.
 *
 * @param {SoulTransformerOptions} options - The options for transforming the translation.
 * @returns {string} The transformed string to be placed in the third cell of the corresponding row.
 */
export const transformSoulTranslation = ({
  id,
  firstTranslation,
  lastTranslation,
  hasDualLanguage,
  isTranslated,
}: SoulTransformerOptions) => {
  // TODO: TEMP Comment: blackList = ['ui_fac_', 'stat_']
  if (!hasDualLanguage || !isTranslated) {
    return firstTranslation;
  }

  const isCharacterName = id.endsWith('_uiName');
  const isCodexName = id.startsWith('ui_codex_name_');

  if (isCharacterName || isCodexName) {
    return `${firstTranslation}${INLINE_SEPARATOR}${lastTranslation}`;
  }

  const isPlayerStat = id.includes('ui_stat_');
  const isPerk = id.includes('perk_');
  const isBuff = id.includes('buff_');
  const isSkill = id.includes('ui_skill_');

  if (isPlayerStat || isPerk || isBuff || isSkill) {
    const isDescription = id.includes('_desc');

    if (isDescription) {
      return `${firstTranslation}${BR}${BR}${lastTranslation}`;
    }

    return firstTranslation;
  }

  return firstTranslation;
};
