import { findLocalizedCategoryByItemId } from '../../findLocalizedCategoryByItemId.ts';
import { BR } from './constants.ts';
import type { ItemTransformerOptions } from './types.ts';

const MIN_CHARACTERS_TO_BE_DESCRIPTION = 50;

/**
 * @note This function is intended to work with `text_ui_items.xml` translations.
 *
 * Transforms a translation:
 * - Adds dual-language only for item descriptions, detected by a minimum character threshold.
 * - Prepends item categories only for items to improve in-game sorting, based on character threshold and category availability.
 *
 * @param {ItemTransformerOptions} options - The options for transforming the translation.
 * @returns {string} The transformed string to be placed in the third cell of the corresponding row.
 */
export const transformItemTranslation = ({
  id,
  firstTranslation,
  language,
  lastTranslation,
  hasCategories,
  hasDualLanguage,
  isTranslated,
}: ItemTransformerOptions) => {
  const category = findLocalizedCategoryByItemId(id, language);
  const isItemCategorized = !!category;
  const isDescription =
    !isItemCategorized &&
    firstTranslation.length >= MIN_CHARACTERS_TO_BE_DESCRIPTION;

  // NOTE: Item descriptions are not categorized. If dual-language is enabled and a translation exists, it is appended after two line breaks.
  if (isDescription) {
    return isTranslated && hasDualLanguage
      ? `${firstTranslation}${BR}${BR}${lastTranslation}`
      : firstTranslation;
  }

  // NOTE: Items are not translated due to space constraints, but their category is prepended if available.
  return isItemCategorized && hasCategories
    ? `[${category}] ${firstTranslation}`
    : firstTranslation;
};
