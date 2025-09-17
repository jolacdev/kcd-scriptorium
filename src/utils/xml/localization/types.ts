import { GameSupportedLanguage } from '../../../constants/constants.ts';

// TODO: Add a type to accept all the different attributes and limit the specific ones.
type TransformerOptions = {
  id: string;
  firstTranslation: string;
  lastTranslation: string;
  hasDualSubs: boolean;
};

export type DialogTransformerOptions = TransformerOptions & {
  color?: string;
};

export type ItemTransformerOptions = TransformerOptions & {
  language: GameSupportedLanguage;
  hasCategories: boolean;
};

export type QuestTransformerOptions = TransformerOptions;

export type MenuTransformerOptions = TransformerOptions;

export type SoulTransformerOptions = TransformerOptions;

export type IngameTransformerOptions = TransformerOptions & {
  color?: string;
};

export type HUDTransformerOptions = TransformerOptions;
