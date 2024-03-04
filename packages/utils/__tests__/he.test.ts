import { describe, expect, test } from 'vitest';
import { escapeHtml, getHtmlText } from '../src/he';
import xssCheatSheets from './assets/xss-cheat-sheet';

const replace = function (str: string) {
  return str.replace(regexReplace, ($0) => {
    return replaceMap[$0];
  });
};

const chineseText = '一囧贇';
const englishNumberText = 'abc123def';
const regexReplace = /[<>"&'`]/g;
const replaceMap = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '&': '&amp;',
  "'": '&#x27;',
  '`': '&#x60;',
} as Record<string, string>;

describe('escapeHtml', () => {
  test('should not escape chinese、english and number', async () => {
    const text = `${chineseText}${englishNumberText}`;
    const escapedText = escapeHtml(text);
    const replacedText = replace(text);
    expect(text).toEqual(escapedText);
    expect(escapedText).toEqual(replacedText);
  });

  test('should escape xss string', async () => {
    xssCheatSheets.forEach((xssText) => {
      const text = `${chineseText}${englishNumberText}${xssText}`;
      const escapedText = escapeHtml(text);
      const replacedText = replace(text);
      expect(escapedText).toEqual(replacedText);
    });
  });
});

describe('getHtmlText', () => {
  test('should return input', async () => {
    expect(getHtmlText('<😀Õ')).toEqual('<😀Õ');
  });
  test('should return characters from HTML Entities', async () => {
    expect(getHtmlText('&lt;')).toEqual('<');
    expect(getHtmlText('&#60;')).toEqual('<');
    expect(getHtmlText('&amp;')).toEqual('&');
    expect(getHtmlText('&#38;')).toEqual('&');
    expect(getHtmlText('&copy;')).toEqual('©');
    expect(getHtmlText('&#169;')).toEqual('©');
    expect(getHtmlText('&yen;')).toEqual('¥');
    expect(getHtmlText('&#165;')).toEqual('¥');
    expect(getHtmlText('&cent;')).toEqual('¢');
    expect(getHtmlText('&#162;')).toEqual('¢');
    expect(getHtmlText('&quot;')).toEqual('"');
    expect(getHtmlText('&#34;')).toEqual('"');
    expect(getHtmlText('&apos;')).toEqual("'");
    expect(getHtmlText('&#39;')).toEqual("'");
  });
});
