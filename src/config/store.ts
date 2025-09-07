import Conf from 'conf';

import { SupportedLanguage } from './i18n.ts';

type StoreData = {
  gamePath: string;
  language: SupportedLanguage;
};

type StoreKey = keyof StoreData;

// TODO: Handle parse JSON file errors (e.g. SyntaxError: Unexpected end of JSON input)
const config = new Conf<StoreData>({
  configName: 'kcd-toolkit-config',
  cwd: process.cwd(),
  fileExtension: 'json',
});

export const setStoreSetting = <T extends StoreKey>(
  key: T,
  value: StoreData[T],
): void => {
  config.set(key, value);
};

export const getStoreSetting = <T extends StoreKey>(
  key: T,
): StoreData[T] | undefined => config.get(key);

export const hasStoreSetting = (key: StoreKey): boolean => config.has(key);

const clearStoreSetting = (key: StoreKey): void => {
  config.delete(key);
};
