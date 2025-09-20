import { applyFontColor } from './common.ts';
import { BR } from './constants.ts';
import type { DialogTransformerOptions } from './types.ts';

/**
 * @note This function is intended to work with `text_ui_dialog.xml` translations.
 *
 * Transforms a translation:
 * - Adds dual-language if `hasDualLanguage` is true and a translation exists.
 * - Applies a custom color to the secondary translation if `color` is provided.
 *
 * @param {DialogTransformerOptions} options - The options for transforming the translation.
 * @returns {string} The transformed string to be placed in the third cell of the corresponding row.
 */
export const transformDialogTranslation = ({
  color,
  firstTranslation,
  lastTranslation,
  hasDualLanguage,
  isTranslated,
}: DialogTransformerOptions) => {
  if (!hasDualLanguage || !isTranslated) {
    return firstTranslation;
  }

  return `${firstTranslation}${BR}${applyFontColor(lastTranslation, color)}`;
};
