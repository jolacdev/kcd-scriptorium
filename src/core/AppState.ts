import { SupportedLanguage } from '../config/i18n.ts';
import { getStoreSetting, setStoreSetting } from '../config/store.ts';
import { isValidGamePath } from '../utils/validators/isValidGamePath.ts';
import { isValidLanguage } from '../utils/validators/isValidLanguage.ts';

export class AppState {
  private static instance: AppState;

  private _exit = false;
  private _gamePath: null | string = null;
  private _language: null | SupportedLanguage = null;
  private _isDebugMode: boolean = false;

  private constructor() {
    const storedGamePath = getStoreSetting('gamePath') ?? '';
    const storedLanguage = getStoreSetting('language') ?? '';
    const isDebugMode = getStoreSetting('isDebugMode') ?? false;

    this._gamePath = isValidGamePath(storedGamePath) ? storedGamePath : null;
    this._language = isValidLanguage(storedLanguage) ? storedLanguage : null;
    this._isDebugMode = typeof isDebugMode === 'boolean' ? isDebugMode : false;
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

  /**
   *
   * @param path - The path to the game installation directory
   * @throws {Error} If the provided path is not a valid game path
   */
  setGamePath(path: string) {
    if (!isValidGamePath(path)) {
      throw new Error('Invalid game path');
    }

    setStoreSetting('gamePath', path);
    this._gamePath = path;
  }

  get language() {
    return this._language;
  }

  /**
   *
   * @param lang - The language to set
   * @throws {Error} If the provided language is not supported
   */
  setLanguage(lang: SupportedLanguage) {
    if (!isValidLanguage(lang)) {
      throw new Error('Invalid language');
    }

    setStoreSetting('language', lang);
    this._language = lang;
  }

  get exit() {
    return this._exit;
  }

  requestExit() {
    this._exit = true;
  }

  get isDebugMode() {
    return this._isDebugMode;
  }
}
