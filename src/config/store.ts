import Conf from 'conf';
import fs from 'fs';
import path from 'path';

import { SupportedLanguage } from './i18n.ts';

const CONFIG_FILE_NAME = 'scriptorium-settings';
const CONFIG_FILE_EXTENSION = 'json';

type StoreData = {
  gamePath: string;
  language: SupportedLanguage;
  isDebugMode: boolean;
};

type StoreKey = keyof StoreData;

const createConfig = (): Conf<StoreData> => {
  try {
    return new Conf<StoreData>({
      configName: CONFIG_FILE_NAME,
      cwd: process.cwd(),
      fileExtension: CONFIG_FILE_EXTENSION,
    });
  } catch (error) {
    const syntaxErrorMessage = `⚠️  Configuration file '${CONFIG_FILE_NAME}.${CONFIG_FILE_EXTENSION}' is invalid JSON and will be reset.`;
    console.error(
      syntaxErrorMessage,
      error instanceof Error ? error.message : error,
    );

    fs.writeFileSync(
      path.join(process.cwd(), `${CONFIG_FILE_NAME}.${CONFIG_FILE_EXTENSION}`),
      '{}',
      'utf-8',
    );

    return new Conf<StoreData>({
      configName: CONFIG_FILE_NAME,
      cwd: process.cwd(),
      fileExtension: CONFIG_FILE_EXTENSION,
    });
  }
};

const config: Conf<StoreData> = createConfig();

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
