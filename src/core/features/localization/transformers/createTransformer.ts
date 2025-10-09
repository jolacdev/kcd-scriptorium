import { BR, INLINE_SEPARATOR } from '../constants.ts';

// TODO: Remove
type RowData = {
  id: string;
  firstTranslation: string;
  lastTranslation: string;
  color?: string;
  hasDualLanguage: boolean;
  isTranslated: boolean;
};

export enum Action {
  DualBreak = 'dual-break',
  DualDoubleBreak = 'dual-double-break',
  DualInline = 'dual-inline',
  Skip = 'skip',
}

const separatorMap: Record<Exclude<Action, Action.Skip>, string> = {
  [Action.DualBreak]: BR,
  [Action.DualDoubleBreak]: `${BR}${BR}`,
  [Action.DualInline]: INLINE_SEPARATOR,
};

type Rule = {
  action: Action;
  matcher: (context: RowData) => boolean;
};

type Config =
  | {
      rules: Rule[];
      customTransform?: never;
    }
  | {
      rules?: never;
      customTransform: (context: RowData) => string;
    };

export function createTransformer({ customTransform, rules }: Config) {
  return (context: RowData): string => {
    const { firstTranslation, lastTranslation, hasDualLanguage, isTranslated } =
      context;

    if (customTransform) {
      return customTransform(context);
    }

    if (!hasDualLanguage || !isTranslated) {
      return firstTranslation;
    }

    const rule = rules.find((r) => r.matcher(context));

    if (!rule || rule.action === Action.Skip) {
      return firstTranslation;
    }

    return `${firstTranslation}${separatorMap[rule.action]}${lastTranslation}`;
  };
}

const questRules: Rule[] = [
  {
    action: Action.Skip,
    matcher: ({ id }) => {
      const isSavename = id.includes('_Savename');
      const isSubchapterName = /^subchapter.+?_name$/.test(id); // Quest titles

      return isSavename || isSubchapterName;
    },
  },
  {
    action: Action.DualInline,
    matcher: ({ id }) => {
      const isChapter = id.startsWith('chap'); // Quest core objectives.
      const isQuestLogObjective =
        id.startsWith('objective_') && id.endsWith('_LogStarted'); // TODO: Check if *_LogCompleted entries are log objectives as well.

      return isChapter || isQuestLogObjective;
    },
  },
  {
    action: Action.DualDoubleBreak,
    matcher: ({ id }) => {
      const isObjective = id.startsWith('objective_'); // Quest context.
      const isSubchapterDescription = /^subchapter_.+?_description$/.test(id); // Quest descriptions

      return isObjective || isSubchapterDescription;
    },
  },
];
