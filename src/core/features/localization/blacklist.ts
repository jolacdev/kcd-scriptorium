type BlacklistKey = 'ingame' | 'quest';
type Blacklist = {
  exact: string[];
  partial: string[];
  prefixes: string[];
  regex: RegExp[];
};

export const TRANSFORMER_BLACKLISTS: Record<BlacklistKey, Blacklist> = {
  ingame: {
    partial: ['ui_hud_lockpick'],
    prefixes: ['ui_objective'],
    regex: [],
    exact: [
      'ui_hud_you_discovered',
      'ui_hud_you_discovered_female',
      'ui_hud_you_learned',
      'ui_hud_you_learned_female',
    ],
  },
  quest: {
    exact: [],
    partial: ['_Savename'],
    prefixes: [],
    regex: [/^subchapter_.+?_name$/],
  },
};

export const isIdBlacklisted = (
  id: string,
  { exact, partial, prefixes, regex }: Blacklist,
): boolean =>
  exact.includes(id) ||
  partial.some((substring) => id.includes(substring)) ||
  prefixes.some((prefix) => id.startsWith(prefix)) ||
  regex.some((r) => r.test(id));
