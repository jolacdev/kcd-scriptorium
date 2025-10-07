import { BR, INLINE_SEPARATOR } from '../constants.ts';
import type { QuestTransformerOptions } from '../types.ts';

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
}: QuestTransformerOptions): string => {
  const isSavename = id.includes('_Savename');
  const isSubchapterName = /^subchapter_.+?_name$/.test(id); // Quest titles

  if (!hasDualLanguage || !isTranslated || isSavename || isSubchapterName) {
    return firstTranslation;
  }

  const isObjective = id.startsWith('objective_'); // Quest context.
  const isQuestLogObjective = isObjective && id.endsWith('_LogStarted'); // TODO: Check if *_LogCompleted entries are log objectives as well.
  const isChapter = id.startsWith('chap'); // Quest core objectives.
  const isSubchapterDescription = /^subchapter_.+?_description$/.test(id); // Quest descriptions

  if (isObjective || isChapter || isSubchapterDescription) {
    const separator =
      isChapter || isQuestLogObjective ? `${INLINE_SEPARATOR}` : `${BR}${BR}`;
    return `${firstTranslation}${separator}${lastTranslation}`;
  }

  return firstTranslation;
};
