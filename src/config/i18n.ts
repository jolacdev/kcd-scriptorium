import i18next from 'i18next';
import FsBackend from 'i18next-fs-backend';

import en from '../locales/en/translation.json' with { type: 'json' };
import es from '../locales/es/translation.json' with { type: 'json' };

// NOTE: Workaround for CJS/ESM interop default export issue.
type PossibleDefaultExport<T> = T & { default?: T };

const Backend =
  (FsBackend as PossibleDefaultExport<typeof FsBackend>).default ?? FsBackend;

export enum SupportedLanguage {
  ENGLISH = 'en',
  SPANISH = 'es',
}

export const initI18n = async (
  lng: SupportedLanguage = SupportedLanguage.ENGLISH,
) => {
  await i18next.use(Backend).init({
    fallbackLng: SupportedLanguage.ENGLISH,
    lng,
    supportedLngs: Object.values(SupportedLanguage),
    // NOTE: Final bundle has issues with relative paths. Replaced with direct imports.
    // backend: { loadPath: './src/locales/{{lng}}/{{ns}}.json' }
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
  });

  return i18next;
};
