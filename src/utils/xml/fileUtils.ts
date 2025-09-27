import fs from 'fs';
import path from 'path';

import { ModFolder } from '../../constants/constants.ts';

type XmlFilePath = `${string}.xml`;

/**
 * Checks if the given file path ends with `.xml`.
 *
 * Acts as a type guard, narrowing the type to `XmlFilePath`.
 * @param filePath - Path to check.
 * @returns True if the path is an XML file.
 */
const isXmlFile = (filePath: string): filePath is XmlFilePath =>
  /\.xml$/i.test(filePath);

const readFileSync = (filePath: string): string | undefined => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  return fs.readFileSync(filePath, 'utf-8');
};

const writeFileWithDirsSync = (filePath: string, content: string) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
};

/**
 * Reads the content of an XML file as a string.
 * @param xmlFilePath - Absolute path to the XML file.
 * @returns File content as string, or undefined if the file does not exist.
 */
export const readXml = (xmlFilePath: XmlFilePath) => readFileSync(xmlFilePath);

/**
 * Creates an empty .tbl file next to the given XML file.
 * @param xmlFilePath - Absolute path to the XML file.
 */
const writeEmptyTbl = (xmlFilePath: XmlFilePath) => {
  const fileExtension = path.extname(xmlFilePath);
  const fileBaseName = path.basename(xmlFilePath, fileExtension);
  const tblFilePath = path.join(
    path.dirname(xmlFilePath),
    `${fileBaseName}.tbl`,
  );

  writeFileWithDirsSync(tblFilePath, '');
};

/**
 * Writes content to an XML file, creating missing directories if necessary.
 * @param xmlFilePath - Absolute path to the XML file.
 * @param content - Content to write.
 */
export const writeXml = (
  xmlFilePath: string,
  content: string,
  shouldWriteEmptyTbl: boolean = false,
) => {
  if (!isXmlFile(xmlFilePath)) {
    throw new Error(`❌ Not valid XML file: "${xmlFilePath}"`);
  }

  writeFileWithDirsSync(xmlFilePath, content);
  if (shouldWriteEmptyTbl) {
    writeEmptyTbl(xmlFilePath);
  }
};

/**
 * Removes the entire mod folder and all its contents from the current working directory.
 */
export const removeModFolder = () => {
  fs.rmSync(path.join(process.cwd(), ModFolder.Root), {
    force: true,
    recursive: true,
  });
};
