import { GameSupportedLanguage } from '../../../constants/constants.ts';

export type BaseTransformerOptions = {
  firstTranslation: string;
  lastTranslation: string;
  hasDualLanguage: boolean;
  isTranslated: boolean;
};

export type ExtendedTransformerOptions = {
  id: string;
  color: string;
  language: GameSupportedLanguage;
  hasCategories: boolean;
};

export type DialogTransformerOptions = BaseTransformerOptions &
  Pick<ExtendedTransformerOptions, 'color'>;

export type ItemTransformerOptions = BaseTransformerOptions &
  Pick<ExtendedTransformerOptions, 'hasCategories' | 'id' | 'language'>;

export type QuestTransformerOptions = BaseTransformerOptions &
  Pick<ExtendedTransformerOptions, 'id'>;

export type MenuTransformerOptions = BaseTransformerOptions &
  Pick<ExtendedTransformerOptions, 'id'>;

export type SoulTransformerOptions = BaseTransformerOptions &
  Pick<ExtendedTransformerOptions, 'id'>;

export type IngameTransformerOptions = BaseTransformerOptions &
  Pick<ExtendedTransformerOptions, 'color' | 'id'>;

export type HUDTransformerOptions = BaseTransformerOptions;
