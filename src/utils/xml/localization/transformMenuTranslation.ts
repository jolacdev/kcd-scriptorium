import { BR } from './constants.ts';
import type { MenuTransformerOptions } from './types.ts';

/**
 * @note This function is intended to work with `text_ui_menus.xml` translations.
 *
 * Transforms a translation:
 * - Adds dual subtitles (for descriptions) if `hasDualSubs` is true and a translation exists.
 *
 * @param {MenuTransformerOptions} options - The options for transforming the translation.
 * @returns {string} The transformed string to be placed in the third cell of the corresponding row.
 */
export const transformMenuTranslation = ({
  id,
  firstTranslation,
  lastTranslation,
  hasDualSubs,
}: MenuTransformerOptions) => {
  // TODO: To confirm – The L-Shift key is displayed twice in the vanilla game? e.g. gallop in a horse
  const isTranslated = firstTranslation !== lastTranslation;
  const isDescription = id.includes('_desc');
  const isCodexContent = id.startsWith('ui_codex_cont_');
  const isCodexTutorialContent = id.startsWith('ui_tutorial_cont_');
  const isCodexCharacter = id.startsWith('ui_codex_char_');

  if (!hasDualSubs || !isTranslated) {
    return firstTranslation;
  }
  const shouldAddDualSubs =
    isDescription ||
    isCodexContent ||
    isCodexTutorialContent ||
    isCodexCharacter;

  return shouldAddDualSubs
    ? `${firstTranslation}${BR}${BR}${lastTranslation}`
    : firstTranslation;
};
