import fs from 'fs';
import path from 'path';
import { describe, expect, it, vi } from 'vitest';

import { isValidGamePath, RELATIVE_EXE_PATH } from './isValidGamePath.ts';

const validGamePathFixture = 'D:\\KingdomComeDeliverance';
const inValidGamePathFixture = 'D:\\SomePath';

const existsSyncSpy = vi
  .spyOn(fs, 'existsSync')
  .mockImplementation(
    (exePath) => exePath === path.join(validGamePathFixture, RELATIVE_EXE_PATH),
  );

const testCases = [
  {
    gamePath: inValidGamePathFixture,
    testName: 'returns false for invalid gamePath',
    isValid: false,
  },
  {
    gamePath: validGamePathFixture,
    testName: 'returns true for valid gamePath',
    isValid: true,
  },
];

describe('isValidGamePath', () => {
  it.each(testCases)('$testName', ({ gamePath, isValid }) => {
    expect(isValidGamePath(gamePath)).toBe(isValid);
    expect(existsSyncSpy).toHaveBeenCalledExactlyOnceWith(
      path.join(gamePath, RELATIVE_EXE_PATH),
    );
  });

  it('returns false for invalid input types and does not call existsSync', () => {
    ['', ' ', null, undefined, 123, {}, [], true, false].forEach((input) => {
      // @ts-expect-error testing invalid input
      expect(isValidGamePath(input)).toBeFalsy();
    });

    expect(existsSyncSpy).not.toHaveBeenCalled();
  });
});
