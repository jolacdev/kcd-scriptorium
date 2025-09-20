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

type LocalizationPakFile = `${string}_xml.pak`;

export const localizationPakMap: Record<
  GameSupportedLanguage,
  LocalizationPakFile
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

export enum Folder {
  Data = 'Data',
  Localization = 'Localization',
  Mod = 'Localization_Toolkit',
}

const LOCALIZATION = 'Localization\\{Language}_xml.pak\\text_*_*.xml';
const REMOVE_TIMERS = 'Data\\Tables.pak\\Libs\\Tables\\text\\topic.xml';

// NOTE: Files to consider skip its localization: HUD, Menus
// NOTE: https://modding.wiki/en/kingdomcomedeliverance2/mod-development/localization/tutorials/localization
export enum LocalizationFile {
  // DIALOG
  // Dialogs lines and dialog options (actions).
  Dialog = 'text_ui_dialog.xml',
  // HUD
  // TODO: HUD Interactions With Bodies?: [ui_hud_*_body]
  HUD = 'text_ui_HUD.xml', // Drop / Pick up body
  // INGAME
  // TODO: <-- HUD Warnins (You can't jump while overloaded., You are in a private area, Reputation lost, "You've washed yourself..."...), Names???
  Ingame = 'text_ui_ingame.xml',
  // ITEMS
  // TODO:
  // - Item Names and Descriptions.
  // - <-- Letter and Book contents??
  // - ???
  Items = 'text_ui_items.xml',
  // MENUS
  // TODO: <-- Check if menu descriptions (e.g. stats description) should be translated.
  Menus = 'text_ui_menus.xml', // Map legend (menu+), Menu tab/subtabs names (Inventory, Player...), Item stats (Min. Strength, etc.)
  // MINIGAMES
  // TODO:
  // - Buldings: Stables, Tavern, Bakery: [ui_nh_structure_name_*, ui_nh_structure_desc_*],
  // - Objectives?: Village income, Village capacity: [ui_nh_objective_*]
  // - Resources?: Charcoal, Grain, Livestock, Stone: [ui_nh_res_*]??
  // - Black bread, Altar, Mead...?: [ui_nh_eff_*]??
  // - Dice Games, Brewey, Altar, Alchemy Bench...?: [ui_nh_add_*]??
  Minigames = 'text_ui_minigames.xml',
  // MISC
  // TODO:
  Misc = 'text_ui_misc.xml',
  // QUEST
  // TODO:
  Quest = 'text_ui_quest.xml', // Map legend (menu-),
  // RICH PRESENCE
  // TODO:
  RichPresence = 'text_rich_presence.xml',
  // SOUL
  // - Character names and possessions (factions): [char_*_uiName, soul_ui_name_* && ui_fac_*]
  // - Perk Names and Descriptions: [perk_*_name && perk_*_desc]
  // - Buff Names and Descriptions: [buff_* && buff_*_desc]
  // - Stats: [stat_*]
  // - Skill Names, Descriptions and Levelups: [ui_skill_* && ui_skill_*_desc0 && ui_skill_*_levelup]
  // - Bodyparts?: [ui_bodypart_*]
  // - Codex Names: [ui_codex_name_*]
  // - Other Stat Names, Descriptions and Levelups: [ui_stat_*, ui_stat_*_desc, ui_stat_*_levelup]
  // - Tutorial names [ui_tutorial_name_*]
  // - Unconscious states?: [unconscious && unconscious_*]
  Soul = 'text_ui_soul.xml', // Part of the character stats (Agility, Speech... *and their descriptions)
  // TUTORIALS
  // TODO:
  Tutorials = 'text_ui_tutorials.xml',
}

export const SUPPORTED_LOCALIZATION_FILES: LocalizationFile[] = [
  LocalizationFile.Dialog,
  LocalizationFile.HUD,
  LocalizationFile.Ingame,
  LocalizationFile.Items,
  LocalizationFile.Menus,
  LocalizationFile.Quest,
  LocalizationFile.Soul,
];
