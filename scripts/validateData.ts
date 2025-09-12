import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readParseJson = (filePath: string) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(
      `❌ Failed to read or parse JSON from ${filePath}:`,
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
};

const validateData = () => {
  const categories = readParseJson(
    path.join(__dirname, '../data/categories.json'),
  );
  const categorizedItems = readParseJson(
    path.join(__dirname, '../data/categorizedItems.json'),
  );

  const categoriesKeys = Object.keys(categories);
  const categorizedItemsKeys = Object.keys(categorizedItems);

  const missingInCategories = categorizedItemsKeys.filter(
    (key) => !categoriesKeys.includes(key),
  );
  const unusedCategories = categoriesKeys.filter(
    (key) => !categorizedItemsKeys.includes(key),
  );
  const emptyOrDuplicateItems = categorizedItemsKeys.filter((key) => {
    const items = categorizedItems[key];
    return items.length === 0 || new Set(items).size !== items.length;
  });

  const hasMissingCategories = missingInCategories.length > 0;
  const hasEmptyOrDuplicateItems = emptyOrDuplicateItems.length > 0;
  const hasUnusedCategories = unusedCategories.length > 0;

  const hasErrors =
    hasMissingCategories || hasEmptyOrDuplicateItems || hasUnusedCategories;

  if (!hasErrors) {
    console.log('✅ All files have been validated correctly.');
    return;
  }

  if (hasMissingCategories) {
    console.error(
      '❌ There are missing categories in categories.json:',
      missingInCategories,
    );
  }

  if (hasEmptyOrDuplicateItems) {
    console.error(
      '❌ There are categories with empty or duplicate items in categorizedItems.json:',
      emptyOrDuplicateItems,
    );
  }

  if (hasUnusedCategories) {
    console.warn(
      '⚠️ There are unused categories in categorizedItems.json:',
      unusedCategories,
    );
  }
};

validateData();
