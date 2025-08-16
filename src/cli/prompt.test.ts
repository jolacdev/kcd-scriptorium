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

  it('should handle number type', async () => {
    const mockedAge = 20;
    const question = {
      message: 'Age?',
      name: 'age',
      type: 'number',
    } as const;

    prompts.inject([mockedAge]);
    const { age } = await prompt(question);

    expect(typeof age).toBe(typeof mockedAge);
    expect(age).toBe(mockedAge);
  });

  it('should handle confirm type', async () => {
    const isMockedConfirm = true;
    const question = {
      message: 'Accept?',
      name: 'isConfirm',
      type: 'confirm',
    } as const;

    prompts.inject([isMockedConfirm]);
    const { isConfirm } = <{ isConfirm: typeof isMockedConfirm }>(
      await prompt(question)
    );

    expect(typeof isConfirm).toBe(typeof isMockedConfirm);
    expect(isConfirm).toBe(isMockedConfirm);
  });

  it('should handle toggle type', async () => {
    const isMockedExit = true;
    const question = {
      active: 'Yes, exit',
      inactive: 'No, go back',
      message: 'Exit?',
      name: 'isExit',
      type: 'toggle',
    } as const;

    prompts.inject([isMockedExit]);
    const { isExit } = <{ isExit: typeof isMockedExit }>await prompt(question);

    expect(typeof isExit).toBe(typeof isMockedExit);
    expect(isExit).toBe(isMockedExit);
  });

  it('should handle multiple prompts with correct responses', async () => {
    const mockedResponse = ['john', 20, true, ['black', 'white']];
    const questions: prompts.PromptObject[] = [
      { message: 'Enter username', name: 'username', type: 'text' },
      { message: 'Enter age', name: 'age', type: 'number' },
      { message: 'Accept?', name: 'accept', type: 'confirm' },
      {
        message: 'Pick colors',
        name: 'colors',
        type: 'multiselect',
        choices: [
          { title: 'Black', value: 'black' },
          { title: 'White', value: 'white' },
        ],
      },
    ];

    prompts.inject(mockedResponse);
    const response = await prompt(questions);

    expect(Object.values(response)).toEqual(mockedResponse);
  });
});
