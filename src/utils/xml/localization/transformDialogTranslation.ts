import { BR, GREATER_THAN, LESS_THAN } from './constants.ts';
import type { DialogTransformerOptions } from './types.ts';

/**
 * Wraps a text in a font color tag if an actual `color` is provided.
 *
 * @param {string} text - The text to wrap with a color.
 * @param {string} color - The color to apply (e.g., `"#FF0000"` or `"red"`).
 * @returns {string} The text wrapped in a font color tag, or the original text if no color is provided.
 */
const applyFontColor = (text: string, color?: string): string =>
  text && color
    ? `${LESS_THAN}font color='${color}'${GREATER_THAN}${text}${LESS_THAN}/font${GREATER_THAN}`
    : text;

/**
 * @note This function is intended to work with `text_ui_dialog.xml` translations.
 *
 * Transforms an item translation:
 * - Adds dual subtitles if `hasDualSubs` is true and a translation exists.
 * - Applies a custom color to the secondary translation if `color` is provided.
 *
 * @param {DialogTransformerOptions} options - The options for transforming the translation.
 * @returns {string} The transformed string to be placed in the third cell of the corresponding row.
 */
export const transformDialogTranslation = ({
  color,
  firstTranslation,
  lastTranslation,
  hasDualSubs,
}: DialogTransformerOptions) => {
  const isTranslated = firstTranslation !== lastTranslation;

  if (!hasDualSubs || !isTranslated) {
    return firstTranslation;
  }

  return `${firstTranslation}${BR}${applyFontColor(lastTranslation, color)}`;
};
