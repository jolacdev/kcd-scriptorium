import path from 'path';
import yauzl, { Entry, ZipFile } from 'yauzl';

import { LocalizationFile } from '../constants/constants.ts';

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
 * Reads an XML file from within a PAK (ZIP) archive.
 *
 * Iterates through the PAK entries until the requested XML file is found,
 * then extracts and returns its contents as UTF-8 text.
 *
 * @param {string} pakPath - Full path to the `.pak` file (ZIP archive).
 * @param {LocalizationFile} xmlFileName - The name of the XML file to extract.
 * @returns {Promise<string>} Resolves with the XML file content if found.
 *
 * @throws Will reject if:
 *   - The PAK file cannot be opened.
 *   - The target XML file is not found inside the archive.
 *   - An error occurs while reading the entry stream.
 */
export const readXmlFromPak = (
  pakPath: string,
  xmlFileName: LocalizationFile,
): Promise<string> =>
  new Promise((resolve, reject) => {
    // NOTE: `lazyEntries` indicates that entries should be read only when readEntry() is called.
    yauzl.open(pakPath, { lazyEntries: true }, (err, zipFile) => {
      if (err || !zipFile) {
        reject(err ?? new Error('Failed to open package file'));
        return;
      }

      let isTargetFile = false;

      zipFile.readEntry();

      zipFile.on('entry', async (entry: Entry) => {
        isTargetFile = entry.fileName === xmlFileName;

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
          reject(
            new Error(
              `❌ File "${xmlFileName}" not found in path "${pakPath}".`,
            ),
          );
        }
      });
    });
  });
