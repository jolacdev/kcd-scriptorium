import prompts from 'prompts';
import type { Options, PromptObject } from 'prompts';

type AnyButArray =
  | bigint
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined
  | { [key: string]: unknown };

type PromptTypeMap = {
  confirm: boolean;
  date: Date;
  invisible: string;
  multiselect: unknown[]; // NOTE: Depends on each item value
  number: number | string; // NOTE: Returns string if empty
  password: string;
  select: AnyButArray; // NOTE: Depends on each item value
  text: string;
  toggle: boolean;
};

// Infer response type from object params.
export function prompt<Name extends string, Type extends keyof PromptTypeMap>(
  question: PromptObject<Name> & { type: Type },
  options?: Options,
): Promise<{ [T in Name]: PromptTypeMap[Type] }>;

// Overload for array params and other cases (original prompts signature).
export function prompt(
  question: Parameters<typeof prompts>[0],
  options?: Parameters<typeof prompts>[1],
): Promise<ReturnType<typeof prompts>>;

export async function prompt(
  question: Parameters<typeof prompts>[0],
  options?: Parameters<typeof prompts>[1],
) {
  return prompts(question, options);
}
