let clipboardContents = '';

export const clipboard = {
  writeText: (text: string) => {
    clipboardContents = text;
  },
  readText: () => clipboardContents,
};
