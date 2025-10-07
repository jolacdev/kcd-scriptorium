import fs from 'fs';
import path from 'path';

import {
  GameSupportedLanguage,
  LocalizationFile,
  localizationFilesMap,
  localizationPakMap,
  ModFolder,
} from '../../../constants/constants.ts';
import { writeXml } from '../../../utils/fileUtils.ts';
import { readXmlFromPak, writePak } from '../../../utils/pakUtils.ts';
import { AppState } from '../../AppState.ts';
import { transformDialogTranslation } from './transformers/transformDialogTranslation.ts';
import { transformHUDTranslation } from './transformers/transformHUDTranslation.ts';
import { transformIngameTranslation } from './transformers/transformIngameTranslation.ts';
import { transformItemTranslation } from './transformers/transformItemTranslation.ts';
import { transformMenuTranslation } from './transformers/transformMenuTranslation.ts';
import { transformQuestTranslation } from './transformers/transformQuestTranslation.ts';
import { transformSoulTranslation } from './transformers/transformSoulTranslation.ts';
import type {
  BaseTransformerOptions,
  ExtendedTransformerOptions,
} from './types.ts';

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
  file: LocalizationFile;
  language: GameSupportedLanguage;
  dialogColor?: string;
  transformerFn?: TransformerFn;
  hasCategories: boolean;
  hasDualLanguage: boolean;
  isDebugMode: boolean;
};

const transformLocalizationXmlContent = ({
  content,
  dialogColor,
  file,
  language,
  transformerFn,
  hasCategories,
  hasDualLanguage,
  isDebugMode,
}: TransformLocalizationXmlContentOptions) => {
  const filePrefix = localizationFilesMap[file].prefix;
  const debugPrefix = isDebugMode && filePrefix ? `${filePrefix}: ` : '';

  return content.replace(
    XML_ROW_CELL_GLOBAL_REGEX,
    (_, id, english, translation) => {
      const isFirstTranslationEnglish =
        language === GameSupportedLanguage.ENGLISH;
      const [firstTranslation, lastTranslation] = isFirstTranslationEnglish
        ? [english, translation]
        : [translation, english];

      // NOTE: In debug mode, file prefixes are added to the texts so players can identify the source file.
      if (!transformerFn) {
        return `<Row><Cell>${id}</Cell><Cell>${english}</Cell><Cell>${debugPrefix}${firstTranslation}</Cell></Row>`;
      }

      const isTranslated = english !== translation;

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

      return `<Row><Cell>${id}</Cell><Cell>${english}</Cell><Cell>${debugPrefix}${transformedTranslation}</Cell></Row>`;
    },
  );
};

type GenerateLocalizationFilesOptions = {
  localizationFiles: LocalizationFile[];
  mainLanguage: GameSupportedLanguage;
  pakLanguage: GameSupportedLanguage;
  dialogColor?: string;
  hasCategories: boolean;
  hasDualLanguage: boolean;
};

export const generateLocalizationFiles = async ({
  dialogColor,
  localizationFiles,
  mainLanguage: language,
  pakLanguage,
  hasCategories,
  hasDualLanguage,
}: GenerateLocalizationFilesOptions) => {
  const state = AppState.getInstance();
  const temporaryXmlFilePaths = [];
  const localizationDirPath = path.join(
    process.cwd(),
    ModFolder.Root,
    ModFolder.Localization,
  );

  const inputPakFilePath = path.join(
    state.gamePath!,
    ModFolder.Localization,
    localizationPakMap[pakLanguage],
  );

  if (!inputPakFilePath || !fs.existsSync(inputPakFilePath)) {
    throw new Error('No localization input PAK file found.');
  }

  for (const file of localizationFiles) {
    const transformerFn = fileTransformers[file];

    let xml;
    try {
      xml = await readXmlFromPak(inputPakFilePath, file);
      if (!xml) {
        continue;
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      continue;
    }

    const outputXml = path.join(localizationDirPath, file);
    const transformedXml = transformLocalizationXmlContent({
      content: xml,
      dialogColor,
      file,
      language,
      transformerFn,
      hasCategories,
      hasDualLanguage,
      isDebugMode: state.isDebugMode,
    });

    writeXml(outputXml, transformedXml);
    temporaryXmlFilePaths.push(outputXml);
  }

  const outputPakName = path.basename(inputPakFilePath);
  const outputPak = path.join(localizationDirPath, outputPakName);

  const xmlInputFiles = temporaryXmlFilePaths.map((xmlFile) => ({
    filePath: xmlFile,
  }));

  await writePak(outputPak, xmlInputFiles);
  temporaryXmlFilePaths.forEach((file) => fs.unlinkSync(file));
};
