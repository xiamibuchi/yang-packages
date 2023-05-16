import { select } from './select';
import { createFakeElement } from './textarea';

function clearSelection(): void {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  selection.removeAllRanges();
}

function command(type: string): boolean {
  try {
    return document.execCommand(type);
  } catch {
    return false;
  }
}

function legacyCopy(text: string) {
  const fakeElement = createFakeElement();
  fakeElement.value = text;
  const selectedText = select(fakeElement);
  command(selectedText);
  fakeElement.value = '';
  clearSelection();
}

/**
 * copy text to clipboard
 */
export async function copyText(text: string | number) {
  if (!text) {
    text = '';
  }
  if (typeof text === 'number') {
    text = String(text);
  }
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    legacyCopy(text);
  }
}

export async function getClipboardText() {
  let text = '';
  try {
    text = await navigator.clipboard.readText();
  } catch {
    text = document?.getSelection?.()?.toString() ?? '';
  }
  return text;
}
