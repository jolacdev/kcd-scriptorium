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

export const initI18n = async (
  lng: SupportedLanguage = SupportedLanguage.ENGLISH,
) => {
  await i18next.use(Backend).init({
    fallbackLng: SupportedLanguage.ENGLISH,
    lng,
    supportedLngs: Object.values(SupportedLanguage),
    backend: {
      loadPath: './src/locales/{{lng}}/{{ns}}.json',
    },
  });

  return i18next;
};
