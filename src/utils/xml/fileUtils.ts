import fs from 'fs';
import path from 'path';

type XmlFilePath = `${string}.xml`;

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
 * @param xmlFilePath - Path to the XML file
 * @returns File content as string, or undefined if the file does not exist
 */
export const readXml = (xmlFilePath: XmlFilePath) => readFileSync(xmlFilePath);

/**
 * Writes content to an XML file, creating missing directories if necessary.
 * @param xmlFilePath - Path to the XML file
 * @param content - Content to write
 */
export const writeXml = (xmlFilePath: XmlFilePath, content: string) =>
  writeFileWithDirsSync(xmlFilePath, content);

/**
 * Creates an empty .tbl file next to the given XML file.
 * @param xmlFilePath - Path to the XML file
 */
export const writeEmptyTbl = (xmlFilePath: XmlFilePath) => {
  const fileExtension = path.extname(xmlFilePath);
  const fileBaseName = path.basename(xmlFilePath, fileExtension);
  const tblFilePath = path.join(
    path.dirname(xmlFilePath),
    `${fileBaseName}.tbl`,
  );

  writeFileWithDirsSync(tblFilePath, '');
};
