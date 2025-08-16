import prompts from 'prompts';
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import { prompt } from './prompt.ts';

describe('prompt wrapper', () => {
  const onSubmitSpy = vi.fn().mockName('onSubmit');

  beforeEach(() => {
    vi.clearAllMocks();
    prompts.inject([]);
  });

  it('should run a prompt, match the prompt message in onSubmit, and return the user input', async () => {
    const mockedUsername = 'username';
    const question = {
      message: 'Enter username',
      name: 'value',
      type: 'text',
    } as const;

    prompts.inject([mockedUsername]);

    const { value } = await prompt(question, {
      onSubmit: onSubmitSpy,
    });

    expect(onSubmitSpy).toBeCalledTimes(1);
    expect(onSubmitSpy).promptsSubmitToHaveMatchedMessage(question.message);
    expect(value).toBe(mockedUsername);
  });

  it('should handle select type', async () => {
    const choices = [
      { title: 'Dog', value: 'dog' },
      { title: 'Cat', value: 'cat' },
    ];

    const question = {
      choices,
      message: 'Pick a pet',
      name: 'pet',
      type: 'select',
    } as const;

    prompts.inject([choices[1].value]);

    const { pet } = <{ pet: string }>await prompt(question, {
      onSubmit: onSubmitSpy,
    });

    expect(onSubmitSpy).toBeCalledTimes(1);
    expect(onSubmitSpy).promptsSubmitToHaveMatchedMessage(question.message);
    expect(onSubmitSpy).promptsSubmitToHaveMatchedChoices(question.choices);
    expectTypeOf(pet).not.toBeArray();
    expect(pet).toEqual(choices[1].value);
  });

  it('should handle multiselect type', async () => {
    const choices = [
      { title: 'Red', value: 'red' },
      { title: 'Green', value: 'green' },
      { title: 'Blue', value: 'blue' },
    ];

    const question = {
      choices,
      message: 'Pick colors',
      name: 'colors',
      type: 'multiselect',
    } as const;

    prompts.inject([[choices[0].value, choices[2].value]]);
    const { colors } = <{ colors: string[] }>await prompt(question, {
      onSubmit: onSubmitSpy,
    });

    expect(onSubmitSpy).toBeCalledTimes(1);
    expect(onSubmitSpy).promptsSubmitToHaveMatchedMessage(question.message);
    expect(onSubmitSpy).promptsSubmitToHaveMatchedChoices(question.choices);
    expectTypeOf(colors).toBeArray();
    expect(colors).toEqual([choices[0].value, choices[2].value]);
  });
});
