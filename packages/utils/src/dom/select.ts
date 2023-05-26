export function select(
  element:
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | HTMLElement
): string {
  let selectedText = '';

  if (element instanceof HTMLSelectElement) {
    element.focus();

    selectedText = element.value;
  } else if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    const isReadOnly = element.hasAttribute('readonly');

    if (!isReadOnly) {
      element.setAttribute('readonly', '');
    }

    element.select();
    element.setSelectionRange(0, element.value.length);

    if (!isReadOnly) {
      element.removeAttribute('readonly');
    }

    return element.value;
  }
  if (element.hasAttribute('contenteditable')) {
    element.focus();
  }

  const selection = window.getSelection();
  if (!selection) {
    return selectedText;
  }
  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
  selectedText = selection.toString();
  return selectedText;
}
