import fs from 'fs';
import path from 'path';

import { AppState } from '../AppState.ts';
import { ModFolder, timersPakData } from '../constants/constants.ts';
import { readXmlFromPak, writePak } from './pakUtils.ts';
import { writeXml } from './xml/fileUtils.ts';
import { transformDialogTimers } from './xml/timers/transformDialogTimers.ts';

export const generateTimersFile = async () => {
  const inputPak = path.join(
    AppState.getInstance().gamePath!,
    ModFolder.Data,
    timersPakData.pak,
  );

  // Read the XML from the original PAK
  const inputXml = path.join(timersPakData.pakPathToFiles, timersPakData.xml);
  const xml = await readXmlFromPak(inputPak, inputXml);

  // Path where the modded PAK will be created
  const pakDirPath = path.join(process.cwd(), ModFolder.Root, ModFolder.Data);

  // Paths where the temporary files will be created
  const outputXml = path.join(pakDirPath, timersPakData.xml);
  const outputTbl = path.join(pakDirPath, timersPakData.tbl);

  // Modify and create temporary files
  const transformedXml = transformDialogTimers(xml);
  writeXml(outputXml, transformedXml, true);

  const outputPak = path.join(pakDirPath, timersPakData.pak);

  // Write PAK with the edited files
  await writePak(outputPak, [
    { filePath: outputXml, zipRoot: timersPakData.pakPathToFiles },
    { filePath: outputTbl, zipRoot: timersPakData.pakPathToFiles },
  ]);

  // Delete temporary files
  fs.unlinkSync(outputXml);
  fs.unlinkSync(outputTbl);
};
