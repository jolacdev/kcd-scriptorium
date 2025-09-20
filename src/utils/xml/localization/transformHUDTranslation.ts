import { INLINE_SEPARATOR } from './constants.ts';
import type { HUDTransformerOptions } from './types.ts';

/**
 * @note This function is intended to work with `text_ui_HUD.xml` translations.
 *
 * Transforms a translation:
 * - Adds dual-language (for descriptions) if `hasDualLanguage` is true and a translation exists.
 *
 * @param {HUDTransformerOptions} options - The options for transforming the translation.
 * @returns {string} The transformed string to be placed in the third cell of the corresponding row.
 */
export const transformHUDTranslation = ({
  firstTranslation,
  lastTranslation,
  hasDualLanguage,
  isTranslated,
}: HUDTransformerOptions) => {
  const shouldAddDualLanguage = hasDualLanguage && isTranslated;

  return shouldAddDualLanguage
    ? `${firstTranslation}${INLINE_SEPARATOR}${lastTranslation}`
    : firstTranslation;
};
