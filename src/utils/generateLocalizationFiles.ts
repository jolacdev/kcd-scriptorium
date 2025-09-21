import fs from 'fs';
import path from 'path';

import {
  Folder,
  GameSupportedLanguage,
  LocalizationFile,
  localizationPakMap,
  SUPPORTED_LOCALIZATION_FILES,
} from '../constants/constants.ts';
import { isPakFile, readXmlFromPak, writePak } from './pakUtils.ts';
import { isXmlFile, writeXml } from './xml/fileUtils.ts';
import { transformDialogTranslation } from './xml/localization/transformDialogTranslation.ts';
import { transformHUDTranslation } from './xml/localization/transformHUDTranslation.ts';
import { transformIngameTranslation } from './xml/localization/transformIngameTranslation.ts';
import { transformItemTranslation } from './xml/localization/transformItemTranslation.ts';
import { transformMenuTranslation } from './xml/localization/transformMenuTranslation.ts';
import { transformQuestTranslation } from './xml/localization/transformQuestTranslation.ts';
import { transformSoulTranslation } from './xml/localization/transformSoulTranslation.ts';
import type { PakFile } from './pakUtils.ts';
import type {
  BaseTransformerOptions,
  ExtendedTransformerOptions,
} from './xml/localization/types.ts';

// Find all occurrences of <Row></Row> containing exactly three <Cell></Cell> elements
const XML_ROW_CELL_GLOBAL_REGEX =
  /<Row>\s*<Cell>([\s\S]*?)<\/Cell>\s*<Cell>([\s\S]*?)<\/Cell>\s*<Cell>([\s\S]*?)<\/Cell>\s*<\/Row>/g;

type TransformerFn = (
  options: BaseTransformerOptions & ExtendedTransformerOptions,
) => string;

const fileTransformers: Record<LocalizationFile, TransformerFn | undefined> = {
  [LocalizationFile.Dialog]: transformDialogTranslation,
  [LocalizationFile.HUD]: transformHUDTranslation,
  [LocalizationFile.Ingame]: transformIngameTranslation,
  [LocalizationFile.Items]: transformItemTranslation,
  [LocalizationFile.Menus]: transformMenuTranslation,
  [LocalizationFile.Minigames]: undefined,
  [LocalizationFile.Misc]: undefined,
  [LocalizationFile.Quest]: transformQuestTranslation,
  [LocalizationFile.RichPresence]: undefined,
  [LocalizationFile.Soul]: transformSoulTranslation,
  [LocalizationFile.Tutorials]: undefined,
};

type TransformLocalizationXmlContentOptions = {
  content: string;
  language: GameSupportedLanguage;
  transformerFn: TransformerFn;
  dialogColor?: string;
  hasCategories: boolean;
  hasDualLanguage: boolean;
};

const transformLocalizationXmlContent = ({
  content,
  dialogColor,
  language,
  transformerFn,
  hasCategories,
  hasDualLanguage,
}: TransformLocalizationXmlContentOptions) =>
  content.replace(XML_ROW_CELL_GLOBAL_REGEX, (_, id, english, translation) => {
    const isTranslated = english !== translation;

    const isFirstTranslationEnglish =
      language === GameSupportedLanguage.ENGLISH;
    const [firstTranslation, lastTranslation] = isFirstTranslationEnglish
      ? [english, translation]
      : [translation, english];

    const transformedTranslation = transformerFn({
      id,
      color: dialogColor ?? '',
      firstTranslation,
      language,
      lastTranslation,
      hasCategories,
      hasDualLanguage,
      isTranslated,
    });

    return `<Row><Cell>${id}</Cell><Cell>${english}</Cell><Cell>${transformedTranslation}</Cell></Row>`;
  });

type GenerateLocalizationFilesOptions = {
  inputPak: PakFile;
  mainLanguage: GameSupportedLanguage;
  dialogColor?: string;
  hasCategories: boolean;
  hasDualLanguage: boolean;
};

export const generateLocalizationFiles = async ({
  dialogColor,
  inputPak,
  mainLanguage: language,
  hasCategories,
  hasDualLanguage,
}: GenerateLocalizationFilesOptions) => {
  const localizationDirPath = path.join(
    process.cwd(),
    Folder.Mod,
    Folder.Localization,
  );
  const xmlsToPak = [];

  for (const file of SUPPORTED_LOCALIZATION_FILES) {
    let xml;
    try {
      xml = await readXmlFromPak(inputPak, file);
    } catch (error) {
      console.log(error instanceof Error ? error.message : error);
      continue;
    }

    if (!xml) {
      continue;
    }

    const transformerFn = fileTransformers[file];
    if (!transformerFn) {
      continue;
    }

    const transformedXml = transformLocalizationXmlContent({
      content: xml,
      dialogColor,
      language,
      transformerFn,
      hasCategories,
      hasDualLanguage,
    });

    const xmlOutputPath = path.join(localizationDirPath, file);

    if (isXmlFile(xmlOutputPath)) {
      writeXml(xmlOutputPath, transformedXml);
      xmlsToPak.push(xmlOutputPath);
    }
  }

  const outputPak = path.join(
    localizationDirPath,
    localizationPakMap[language],
  );

  if (isPakFile(outputPak)) {
    const xmlInputFiles = xmlsToPak.map((xmlFile) => ({
      filePath: xmlFile,
    }));

    await writePak(outputPak, xmlInputFiles);
    xmlsToPak.forEach((file) => fs.unlinkSync(file));
  }
};
