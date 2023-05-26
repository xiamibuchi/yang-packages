const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  overflow:auto !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`;

let hiddenTextarea: HTMLTextAreaElement;

/**
 * create a fake textarea element
 */
export function createFakeElement() {
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    document.body.appendChild(hiddenTextarea);
  }
  hiddenTextarea.setAttribute('style', HIDDEN_STYLE);
  return hiddenTextarea;
}
