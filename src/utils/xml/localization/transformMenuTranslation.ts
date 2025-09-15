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
  const isTranslated = firstTranslation !== lastTranslation;
  const isDescription = id.includes('_desc');

  if (!hasDualSubs || !isTranslated) {
    return firstTranslation;
  }

  return isDescription
    ? `${firstTranslation}${BR}${BR}${lastTranslation}`
    : firstTranslation;
};
