import { BR, INLINE_SEPARATOR } from './constants.ts';
import type { QuestTransformerOptions } from './types.ts';

/**
 * @note This function is intended to work with `text_ui_quest.xml` translations.
 *
 * Transforms a translation:
 * - Adds dual-language if `hasDualLanguage` is true and a translation exists.
 *
 * @param {QuestTransformerOptions} options - The options for transforming the translation.
 * @returns {string} The transformed string to be placed in the third cell of the corresponding row.
 */
export const transformQuestTranslation = ({
  id,
  firstTranslation,
  lastTranslation,
  hasDualLanguage,
  isTranslated,
}: QuestTransformerOptions) => {
  if (!hasDualLanguage || !isTranslated) {
    return firstTranslation;
  }

  const isObjective = id.startsWith('objective_'); // Quest context.
  const isChapter = id.startsWith('chap'); // Quest core objectives.
  const subchapterRegex = /^subchapter_(.+?)_(name|description)$/; // Quest titles and descriptions.

  if (isObjective || isChapter || subchapterRegex.test(id)) {
    const separator = isChapter ? `${INLINE_SEPARATOR}` : `${BR}${BR}`;

    return `${firstTranslation}${separator}${lastTranslation}`;
  }

  return firstTranslation;
};
