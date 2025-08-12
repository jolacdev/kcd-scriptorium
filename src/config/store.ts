import Conf from 'conf';
import { SupportedLanguage } from './i18n.ts';

type StoreData = {
  gamePath: string;
  language: SupportedLanguage;
};

type StoreKey = keyof StoreData;

const config = new Conf<StoreData>({
  cwd: process.cwd(),
  configName: 'kcd-toolkit-config',
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
): StoreData[T] | undefined => {
  return config.get(key);
};

export const hasStoreSetting = (key: StoreKey): boolean => {
  return config.has(key);
};

const clearStoreSetting = (key: StoreKey): void => {
  config.delete(key);
};
