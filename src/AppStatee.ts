import { SupportedLanguage } from './config/i18n.ts';
import { getStoreSetting, setStoreSetting } from './config/store.ts';

export class AppState {
  private static instance: AppState;

  private _exit = false;
  private _gamePath: null | string = null;
  private _language: null | SupportedLanguage = null;

  private constructor() {
    this._gamePath = getStoreSetting('gamePath') ?? null;
    this._language = getStoreSetting('language') ?? null;
  }

  public static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }

    return AppState.instance;
  }

  get gamePath() {
    return this._gamePath;
  }

  setGamePath(path: string) {
    this._gamePath = path;
    setStoreSetting('gamePath', path);
  }

  get language() {
    return this._language;
  }

  setLanguage(lang: SupportedLanguage) {
    this._language = lang;
    setStoreSetting('language', lang);
  }

  get exit() {
    return this._exit;
  }

  requestExit() {
    this._exit = true;
  }
}
