import { GREATER_THAN, LESS_THAN } from '../constants.ts';

/**
 * Wraps a text in a font color tag if an actual `color` is provided.
 *
 * @param {string} text - The text to wrap with a color.
 * @param {string} color - The color to apply (e.g., `"#FF0000"` or `"red"`).
 * @returns {string} The text wrapped in a font color tag, or the original text if no color is provided.
 */
export const applyFontColor = (text: string, color?: string): string =>
  text && color
    ? `${LESS_THAN}font color='${color}'${GREATER_THAN}${text}${LESS_THAN}/font${GREATER_THAN}`
    : text;
