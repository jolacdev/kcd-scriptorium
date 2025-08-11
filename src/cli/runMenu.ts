import prompts from 'prompts';

type Option = {
  key: string;
  label: string;
  action: () => Promise<void>;
};

export const runMenu = async (
  title: string,
  options: Option[],
): Promise<void> => {
  const { choice } = await prompts({
    choices: options.map(({ key, label }) => ({ title: label, value: key })),
    message: title,
    name: 'choice',
    type: 'select',
  });

  const optionSelected = options.find(({ key }) => key === choice);

  if (optionSelected) {
    await optionSelected.action();
  }
};
