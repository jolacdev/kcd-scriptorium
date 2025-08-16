type AppState = {
  exit: boolean;
  kcdPath: null | string;
};

export const appState: AppState = {
  exit: false,
  kcdPath: null, // TODO: Check if this attribute is needed or if the store is enough
};
