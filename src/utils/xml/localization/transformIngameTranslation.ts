import { applyFontColor } from './common.ts';
import { BR, INLINE_SEPARATOR } from './constants.ts';
import type { IngameTransformerOptions } from './types.ts';

/**
 * @note This function is intended to work with `text_ui_ingame.xml` translations.
 *
 * Transforms a translation:
 * - Adds dual-language (for descriptions) if `hasDualLanguage` is true and a translation exists.
 *
 * @param {IngameTransformerOptions} options - The options for transforming the translation.
 * @returns {string} The transformed string to be placed in the third cell of the corresponding row.
 */
export const transformIngameTranslation = ({
  id,
  color,
  firstTranslation,
  lastTranslation,
  hasDualLanguage,
  isTranslated,
}: IngameTransformerOptions) => {
  if (!hasDualLanguage || !isTranslated) {
    return firstTranslation;
  }

  // TODO: Review other UI actions with inconsistent naming, expand whitelist if necessary.
  const whiteList = [
    'ui_door_close',
    'ui_door_open',
    'ui_eat_kettle',
    'ui_pickHerb',
    'ui_put_into_kettle',
    'use_ladder',
  ];
  const isUiAction =
    /^ui_(hud|hint|help|open|use)_/.test(id) || whiteList.includes(id);
  if (isUiAction) {
    return `${firstTranslation}${INLINE_SEPARATOR}${lastTranslation}`;
  }

  const isLoadingScreenHint = id.startsWith('ui_loading_hint_');
  if (isLoadingScreenHint) {
    // NOTE: The last translation doesn’t seem to display.
    return `${firstTranslation}${BR}${lastTranslation}`;
  }

  const isEndDialogOption = id === 'ui_end_topic';
  if (isEndDialogOption) {
    // NOTE:  ui_end_topic is used as dialog option with NPCs to end the conversation.
    return `${firstTranslation}${BR}${applyFontColor(lastTranslation, color)}`;
  }

  const isObjectiveMessage = id.startsWith('ui_objective');
  if (isObjectiveMessage) {
    return firstTranslation;
  }

  return firstTranslation;
};
