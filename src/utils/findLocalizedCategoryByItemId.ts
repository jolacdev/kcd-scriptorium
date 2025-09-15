import categories from '../../data/categories.json' with { type: 'json' };
import categorizedItems from '../../data/categorizedItems.json' with { type: 'json' };
import { GameSupportedLanguage } from '../constants/constants.ts';

type CategoryKeys = keyof typeof categories;

const findCategoryById = (id: string): CategoryKeys | undefined => {
  const categorizedItemsArray = Object.entries(categorizedItems);

  return categorizedItemsArray.find(
    ([categoryKey, items]) => items.includes(id) && categoryKey in categories,
  )?.[0] as CategoryKeys | undefined;
};

export const findLocalizedCategoryByItemId = (
  id: string,
  language: GameSupportedLanguage,
): string | undefined => {
  const category = findCategoryById(id);

  return category ? categories[category]?.[language] : undefined;
};
