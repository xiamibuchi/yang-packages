import { describe, expect, it } from 'vitest';
import { copyText, getClipboardText } from '../..';
import { clipboard } from '../../__mock__';

describe('dom clipboard', () => {
  if (!navigator.clipboard) {
    Object.assign(navigator, {
      clipboard,
    });
  }

  describe('copyText', () => {
    it('copy text to clipboard', async () => {
      const text = 'text should be copied';
      await copyText(text);
      expect(await getClipboardText()).toEqual(text);
    });
  });
});
