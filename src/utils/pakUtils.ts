import yauzl, { Entry, ZipFile } from 'yauzl';

import { LocalizationFile } from '../constants/constants.ts';

type PakFilePath = `${string}.pak`;

// TODO: Add error messages to i18n.

/**
 * Reads the content of a single ZIP entry as UTF-8 text.
 *
 * @param {Entry} entry - The zip entry to process.
 * @param {ZipFile} zipFile - The opened zip file that contains the entries.
 * @returns {Promise<string>} Resolves with the entry's text content (UTF-8).
 *
 * @throws Will reject if the entry stream cannot be opened or if a stream error occurs.
 */
const processEntry = (entry: Entry, zipFile: ZipFile): Promise<string> =>
  new Promise((resolve, reject) => {
    zipFile.openReadStream(entry, (error, readStream) => {
      if (error || !readStream) {
        reject(error);
        return;
      }

      const chunks: Buffer[] = [];

      readStream.on('data', (chunk) => chunks.push(chunk));
      readStream.on('end', () => {
        const content = Buffer.concat(chunks).toString('utf8');
        resolve(content);
      });
      readStream.on('error', reject);
    });
  });

/**
 * Reads a file from ZIP archive.
 *
 * Iterates through the ZIP entries until the requested file is found,
 * then extracts and returns its contents as UTF-8 text.
 *
 * @param {string} zipPath - Full path to the ZIP archive (including the archive).
 * @param {string} fileName - The name of the file to read.
 * @returns {Promise<string>} Resolves with the file content if found.
 *
 * @throws Will reject if:
 *   - The ZIP file cannot be opened.
 *   - The target file is not found inside the archive.
 *   - An error occurs while reading the entry stream.
 */
const readFileFromZip = (zipPath: string, fileName: string): Promise<string> =>
  new Promise((resolve, reject) => {
    // NOTE: `lazyEntries` indicates that entries should be read only when readEntry() is called.
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipFile) => {
      if (err || !zipFile) {
        reject(err ?? new Error('Failed to open package file'));
        return;
      }

      let isTargetFile = false;

      zipFile.readEntry();

      zipFile.on('entry', async (entry: Entry) => {
        isTargetFile = entry.fileName === fileName;

        if (isTargetFile) {
          try {
            const content = await processEntry(entry, zipFile);
            resolve(content);
          } catch (error) {
            reject(error);
          }
        } else {
          zipFile.readEntry();
        }
      });

      zipFile.on('end', () => {
        zipFile.close();

        if (!isTargetFile) {
          reject(new Error(`❌ File "${fileName}" not found in "${zipPath}".`));
        }
      });
    });
  });

/**
 * Reads a specific XML localization file from a PAK archive.
 *
 * @param {PakFilePath} pakPath - Path to the PAK archive.
 * @param {LocalizationFile} xmlFileName - The XML file to read.
 * @returns {Promise<string>} Resolves with the file’s contents as UTF-8 text.
 *
 * @throws Will reject if:
 *   - The PAK file cannot be opened.
 *   - The XML file is not found inside the archive.
 *   - An error occurs while reading the entry stream.
 */
export const readXmlFromPak = (
  pakPath: PakFilePath,
  xmlFileName: LocalizationFile,
): Promise<string> => readFileFromZip(pakPath, xmlFileName);
