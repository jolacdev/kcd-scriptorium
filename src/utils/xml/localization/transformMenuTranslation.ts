import { BR } from './constants.ts';
import type { MenuTransformerOptions } from './types.ts';

/**
 * @note This function is intended to work with `text_ui_menus.xml` translations.
 *
 * Transforms a translation:
 * - Adds dual-language (for descriptions) if `hasDualLanguage` is true and a translation exists.
 *
 * @param {MenuTransformerOptions} options - The options for transforming the translation.
 * @returns {string} The transformed string to be placed in the third cell of the corresponding row.
 */
export const transformMenuTranslation = ({
  id,
  firstTranslation,
  lastTranslation,
  hasDualLanguage,
  isTranslated,
}: MenuTransformerOptions) => {
  // TODO: To confirm – The L-Shift key is displayed twice in the vanilla game? e.g. gallop in a horse
  const isDescription = id.includes('_desc');
  const isCodexContent = id.startsWith('ui_codex_cont_');
  const isCodexTutorialContent = id.startsWith('ui_tutorial_cont_');
  const isCodexCharacter = id.startsWith('ui_codex_char_');

  if (!hasDualLanguage || !isTranslated) {
    return firstTranslation;
  }
  const shouldAddDualLanguage =
    isDescription ||
    isCodexContent ||
    isCodexTutorialContent ||
    isCodexCharacter;

  return shouldAddDualLanguage
    ? `${firstTranslation}${BR}${BR}${lastTranslation}`
    : firstTranslation;
};
