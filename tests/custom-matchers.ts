import { expect, vi } from 'vitest';

type VitestMatcherContext = {
  utils: {
    printExpected(value: unknown): string;
    printReceived(value: unknown): string;
  };
};

const isSpyFunction = (spy: unknown): boolean =>
  !!spy && typeof spy === 'function' && 'mock' in spy;

const promptsSubmitToHaveMatchedMessage = (
  actual: ReturnType<typeof vi.fn>,
  message: string,
) => {
  const spyFn = actual;
  if (!isSpyFunction(spyFn)) {
    return {
      pass: false,
      message: () => 'Expected a spy function',
    };
  }

  const receivedMessage = spyFn.mock.calls?.[0]?.[0]?.message;

  try {
    expect(spyFn).toHaveBeenCalledWith(
      expect.objectContaining({ message }),
      expect.anything(),
      expect.anything(),
    );

    return {
      pass: true,
      message: () =>
        `Expected spy function NOT to have been called with the message "${message}"\n\nReceived: "${receivedMessage}"`,
    };
  } catch {
    return {
      pass: false,
      message: () =>
        `Expected spy function to have been called with the message "${message}"\n\nReceived: "${receivedMessage}"`,
    };
  }
};

const promptsSubmitToHaveMatchedChoices = function <T>(
  this: VitestMatcherContext,
  actual: ReturnType<typeof vi.fn>,
  choices: T[],
) {
  const spyFn = actual;
  if (!isSpyFunction(spyFn)) {
    return {
      pass: false,
      message: () => 'Expected a spy function',
    };
  }

  const receivedChoices = actual.mock.calls?.[0]?.[0]?.choices;

  try {
    expect(spyFn).toHaveBeenCalledWith(
      expect.objectContaining({ choices }),
      expect.anything(),
      expect.anything(),
    );

    return {
      pass: true,
      message: () =>
        `Prompts onSubmit spy function was expected NOT to have been called with these choices:\n${this.utils.printExpected(
          choices,
        )}\n\nBut it was called with:\n${this.utils.printReceived(receivedChoices)}`,
    };
  } catch {
    return {
      pass: false,
      message: () =>
        `Prompts onSubmit spy function expected to have been called with:\n${this.utils.printExpected(
          choices,
        )}\n\nBut it was called with:\n${this.utils.printReceived(receivedChoices)}`,
    };
  }
};

expect.extend({
  promptsSubmitToHaveMatchedChoices,
  promptsSubmitToHaveMatchedMessage,
});

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Assertion<T> {
    promptsSubmitToHaveMatchedChoices<K>(choices: K[]): void;
    promptsSubmitToHaveMatchedMessage(message: string): void;
  }
}
