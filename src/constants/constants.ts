export enum ModFolder {
  Data = 'Data',
  Localization = 'Localization',
  Root = 'Scriptorium',
}

export enum GameSupportedLanguage {
  CHINESE = 'zh',
  CZECH = 'cs',
  ENGLISH = 'en',
  FRENCH = 'fr',
  GERMAN = 'de',
  ITALIAN = 'it',
  JAPANESE = 'ja',
  KOREAN = 'ko',
  POLISH = 'pl',
  PORTUGUESE = 'pt',
  RUSSIAN = 'ru',
  SPANISH = 'es',
  TURKISH = 'tr',
  UKRAINIAN = 'uk',
}

export const localizationPakMap: Record<
  GameSupportedLanguage,
  `${string}_xml.pak`
> = {
  [GameSupportedLanguage.CHINESE]: 'Chineses_xml.pak',
  [GameSupportedLanguage.CZECH]: 'Czech_xml.pak',
  [GameSupportedLanguage.ENGLISH]: 'English_xml.pak',
  [GameSupportedLanguage.FRENCH]: 'French_xml.pak',
  [GameSupportedLanguage.GERMAN]: 'German_xml.pak',
  [GameSupportedLanguage.ITALIAN]: 'Italian_xml.pak',
  [GameSupportedLanguage.JAPANESE]: 'Japanese_xml.pak',
  [GameSupportedLanguage.KOREAN]: 'Korean_xml.pak',
  [GameSupportedLanguage.POLISH]: 'Polish_xml.pak',
  [GameSupportedLanguage.PORTUGUESE]: 'Portuguese_xml.pak',
  [GameSupportedLanguage.RUSSIAN]: 'Russian_xml.pak',
  [GameSupportedLanguage.SPANISH]: 'Spanish_xml.pak',
  [GameSupportedLanguage.TURKISH]: 'Turkish_xml.pak',
  [GameSupportedLanguage.UKRAINIAN]: 'Ukrainian_xml.pak',
};

// NOTE: KCD2 wiki with documented files: https://modding.wiki/en/kingdomcomedeliverance2/mod-development/localization/tutorials/localization
export enum LocalizationFile {
  Dialog = 'text_ui_dialog.xml', // Dialog lines and options
  HUD = 'text_ui_HUD.xml', // UI Actions?: Drop body / Pick up body
  Ingame = 'text_ui_ingame.xml', // UI Actions, loading screen hints, notifications
  Items = 'text_ui_items.xml', // Item names and descriptions
  Menus = 'text_ui_menus.xml', // Menu texts (tabs, legends, item stats, etc.)
  Minigames = 'text_ui_minigames.xml', // TODO: CHECK IN DEBUG // Minigame content (buildings, resources, objectives, etc.)
  Misc = 'text_ui_misc.xml', // TODO: CHECK IN DEBUG
  Quest = 'text_ui_quest.xml', // Quest titles and descriptions
  RichPresence = 'text_rich_presence.xml', // NOTE: No need to translate. A few translations for in-game status messages for Steam, Xbox...
  Soul = 'text_ui_soul.xml', // Character stats, skills, perks, buffs, factions, etc.
  Tutorials = 'text_ui_tutorials.xml', // NOTE: Hard to translate. Translations for tutorial texts or notes, mostly shown in non-responsive modals.
}

export const localizationFilesMap: Record<
  LocalizationFile,
  {
    prefix: string;
    supported: boolean;
  }
> = {
  [LocalizationFile.Dialog]: { prefix: 'D', supported: true },
  [LocalizationFile.HUD]: { prefix: 'H', supported: true },
  [LocalizationFile.Ingame]: { prefix: 'G', supported: true },
  [LocalizationFile.Items]: { prefix: 'I', supported: true },
  [LocalizationFile.Menus]: { prefix: 'M', supported: true },
  [LocalizationFile.Misc]: { prefix: 'MI', supported: false },
  [LocalizationFile.Quest]: { prefix: 'Q', supported: true },
  [LocalizationFile.Soul]: { prefix: 'S', supported: true },
  [LocalizationFile.Tutorials]: { prefix: 'T', supported: false },
  [LocalizationFile.Minigames]: {
    prefix: 'MG',
    supported: false,
  },
  [LocalizationFile.RichPresence]: {
    prefix: 'RP',
    supported: false,
  },
};

export const timersPakData = {
  pak: 'Tables.pak',
  pakPathToFiles: 'Libs\\Tables\\text',
  tbl: 'topic.tbl',
  xml: 'topic.xml',
};
