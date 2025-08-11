import i18next from 'i18next';
import FsBackend from 'i18next-fs-backend';

// NOTE: Workaround for CJS/ESM interop default export issue.
type PossibleDefaultExport<T> = T & { default?: T };

const Backend =
  (FsBackend as PossibleDefaultExport<typeof FsBackend>).default ?? FsBackend;

export enum SupportedLanguage {
  ENGLISH = 'en',
  SPANISH = 'es',
}

export const initI18n = async () => {
  await i18next.use(Backend).init({
    fallbackLng: 'en',
    lng: 'en',
    supportedLngs: Object.values(SupportedLanguage),
    backend: {
      loadPath: './src/locales/{{lng}}/{{ns}}.json',
    },
  });

  return i18next;
};

export const changeLanguage = async (lng: string) => {
  await i18next.changeLanguage(lng);
};
