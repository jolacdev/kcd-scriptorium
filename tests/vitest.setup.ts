import { t } from 'i18next';
import prompts from 'prompts';
import { beforeEach, vi } from 'vitest';

vi.mock('i18next');
vi.mocked(t).mockImplementation((...args: Parameters<typeof t>) => {
  const key = args[0];
  return key as string | string[];
});

beforeEach(() => {
  vi.clearAllMocks();
  prompts.inject([]);
});
