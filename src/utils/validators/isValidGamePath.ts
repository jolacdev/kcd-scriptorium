import fs from 'fs';
import path from 'path';

const RELATIVE_EXE_PATH = 'Bin/Win64/KingdomCome.exe';

export const isValidGamePath = (gamePath: string): boolean => {
  if (typeof gamePath !== 'string' || !gamePath.trim()) {
    return false;
  }

  const absoluteExePath = path.join(gamePath, RELATIVE_EXE_PATH);

  return fs.existsSync(absoluteExePath);
};
