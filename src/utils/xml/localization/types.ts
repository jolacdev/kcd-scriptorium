import { GameSupportedLanguage } from '../../../constants/constants.ts';

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
