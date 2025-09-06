import prompts from 'prompts';

import { getStoreSetting, hasStoreSetting } from '../../config/store.ts';
import * as PromptModule from '../prompt.ts';
import { exitMenu } from './exitMenu.ts';
import { gameFolderMenu } from './gameFolderMenu.ts';
import { languageMenu } from './languageMenu.ts';
import { mainMenu, OptionKey } from './mainMenu.ts';
import { modMenu } from './modMenu.ts';

vi.mock('../../config/store');
vi.mock('./exitMenu');
vi.mock('./gameFolderMenu');
vi.mock('./languageMenu');
vi.mock('./modMenu');

const gamePathFixture = 'D:\\KingdomComeDeliverance';
const modMenuFixture = {
  title: 'mainMenu.options.moddingToolkit',
  value: OptionKey.MODDING_TOOLKIT,
};

const buildPromptFixture = (gamePath = ''): Parameters<typeof prompts>[0] => ({
  message: 'appTitle',
  name: 'value',
  type: 'select',
  choices: [
    ...(gamePath ? [modMenuFixture] : []),
    {
      title: `mainMenu.options.changeInstallFolder${gamePath ? ` (${gamePath})` : ''}`,
      value: OptionKey.CHANGE_INSTALL_FOLDER,
    },
    {
      title: 'mainMenu.options.changeLanguage',
      value: OptionKey.CHANGE_LANGUAGE,
    },
    {
      title: 'mainMenu.options.exit',
      value: OptionKey.EXIT,
    },
  ],
});

const mockStoreGamePath = (gamePath?: string) => {
  vi.mocked(hasStoreSetting).mockReturnValue(!!gamePath);
  vi.mocked(getStoreSetting).mockReturnValue(gamePath);
};

describe('mainMenu', () => {
  const promptSpy = vi.spyOn(PromptModule, 'prompt');

  beforeEach(() => {
    mockStoreGamePath(undefined);
  });

  const gamePathTestCases = [
    { description: 'game path is NOT set', gamePath: undefined },
    { description: 'game path is set', gamePath: gamePathFixture },
  ];

  it.each(gamePathTestCases)(
    'shows correct prompt choices when $description',
    async ({ gamePath }) => {
      if (gamePath) {
        mockStoreGamePath(gamePath);
      }

      await mainMenu();

      expect(promptSpy).toHaveBeenCalledExactlyOnceWith(
        buildPromptFixture(gamePath),
      );
    },
  );

  it('should not throw if an unexpected option is returned', async () => {
    prompts.inject(['unexpected']);

    await expect(mainMenu()).resolves.not.toThrow();
  });

  describe('mainMenu option handling', () => {
    const menuTestCases = [
      { fn: languageMenu, option: OptionKey.CHANGE_LANGUAGE },
      { fn: exitMenu, option: OptionKey.EXIT },
      { fn: modMenu, option: OptionKey.MODDING_TOOLKIT },
      { fn: gameFolderMenu, option: OptionKey.CHANGE_INSTALL_FOLDER },
    ];

    it.each(menuTestCases)(
      'calls $fn.name when option $option is selected',
      async ({ fn, option }) => {
        prompts.inject([option]);
        await mainMenu();

        expect(fn).toHaveBeenCalled();
      },
    );
  });
});
