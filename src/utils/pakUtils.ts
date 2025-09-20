import fs from 'fs';
import path from 'path';
import yauzl, { Entry } from 'yauzl';
import yazl from 'yazl';

import { LocalizationFile } from '../constants/constants.ts';

export type PakFilePath = `${string}.pak`;

// TODO: Add error messages to i18n.

/**
 * Reads the content of a single ZIP entry as UTF-8 text.
 *
 * @param {Entry} entry - The zip entry to process.
 * @param {yauzl.ZipFile} zipFile - The opened zip file that contains the entries.
 * @returns {Promise<string>} Resolves with the entry's text content (UTF-8).
 *
 * @throws Will reject if the entry stream cannot be opened or if a stream error occurs.
 */
const processEntry = (entry: Entry, zipFile: yauzl.ZipFile): Promise<string> =>
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

/**
 * Creates a `.pak` archive (`.zip` file) at the specified path containing the given input files.
 *
 * Each file in `inputFiles` will be added to the archive, optionally under a
 * specified root path inside the zip.
 *
 * @param {PakFilePath} pakPath - The output path where the .pak file will be written.
 * @param {Array<{ filePath: string; zipRoot?: string }>} inputFiles - An array of objects describing
 *        the files to include in the archive.
 *        - `filePath` (string): The path to the file to include.
 *        - `zipRoot` (string, optional): A subdirectory path inside the archive to place the file.
 *          Defaults to the root of the archive if not provided.
 * @returns {Promise<void>} Resolves when the archive has been successfully created, rejects on any error.
 *
 * @example
 * await createPak('example.pak', [
 *   { filePath: '/path/to/file1.xml' },
 *   { filePath: '/path/to/file2.xml', zipRoot: 'folder1' },
 * ]);
 *
 * // Resulting archive structure:
 * // example.pak/
 * // ├─ file1.xml
 * // └─ folder1/
 * //    └─ file2.xml
 */
export const writePak = async (
  pakPath: PakFilePath,
  inputFiles: {
    filePath: string;
    zipRoot?: string;
  }[],
): Promise<void> =>
  new Promise((resolve, reject) => {
    const zipfile = new yazl.ZipFile();

    for (const { filePath, zipRoot = '' } of inputFiles) {
      const baseName = path.basename(filePath);
      const outputPath = path.join(zipRoot, baseName);
      zipfile.addFile(filePath, outputPath);
    }

    const writeStream = fs.createWriteStream(pakPath);

    writeStream.on('error', reject);
    zipfile.outputStream.on('error', reject);

    zipfile.outputStream.pipe(writeStream).on('close', () => {
      resolve();
    });

    zipfile.end();
  });

/**
 * Checks if the given file path ends with `.pak`.
 *
 * Acts as a type guard, narrowing the type to `PakFilePath`.
 * @param filePath - Path to check.
 * @returns True if the path is an PAK file.
 */
export const isPakFile = (filePath: string): filePath is PakFilePath =>
  /\.pak$/i.test(filePath);
