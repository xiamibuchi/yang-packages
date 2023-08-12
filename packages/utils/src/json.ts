// @ts-nocheck
const ESCAPE_MAP = {
  '"': '"',
  '\\': '\\',
  '/': '/',
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t',
};

/**
 * @description: parse json 字符串中的 bigint 至 string。非 int 类型的数字都会被转换为 string
 */
export const safeJsonParse = (source: string): Record<string, any> => {
  if (typeof source !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof source}`);
  }

  let character = ' ';
  let characterIndex = 0;

  const nextCharacter = (expectedCharacter?: string) => {
    if (expectedCharacter && expectedCharacter !== character) {
      throw new Error(
        `Expected '${expectedCharacter}' instead of '${character}'`
      );
    }
    character = source.charAt(characterIndex);
    characterIndex += 1;
    return character;
  };

  const skipWhiteSpace = () => {
    while (character && character <= ' ') {
      character = nextCharacter();
    }
  };

  const parseNumber = () => {
    // parse a number value.
    let str = '';
    if (character === '-') {
      str = '-';
      character = nextCharacter('-');
    }
    while (character >= '0' && character <= '9') {
      str += character;
      character = nextCharacter();
    }
    if (character === '.') {
      str += '.';
      while (nextCharacter() && character >= '0' && character <= '9') {
        str += character;
      }
    }
    if (character === 'e' || character === 'E') {
      str += character;
      character = nextCharacter();
      // @ts-ignore
      if (character === '-' || character === '+') {
        str += character;
        character = nextCharacter();
      }
      while (character >= '0' && character <= '9') {
        str += character;
        character = nextCharacter();
      }
    }
    const num = +str;
    if (!Number.isFinite(num)) {
      throw new TypeError(`Bad number`);
    } else if (Number.isSafeInteger(num)) {
      return num;
    } else {
      return str;
    }
  };

  const parseString = () => {
    // Parse a string value.
    let str = '';
    let hex;
    let i;
    let uffff;
    if (character !== '"') {
      throw new Error(`Bad string`);
    }

    while (nextCharacter()) {
      if (character === '"') {
        character = nextCharacter();
        return str;
      }
      if (character === '\\') {
        character = nextCharacter();
        // @ts-ignore
        if (character === 'u') {
          uffff = 0;
          for (i = 0; i < 4; i += 1) {
            character = nextCharacter();
            hex = Number.parseInt(character, 16);
            if (!Number.isFinite(hex)) {
              break;
            }
            uffff = uffff * 16 + hex;
          }
          str += String.fromCharCode(uffff);
        } else if (typeof ESCAPE_MAP[character] === 'string') {
          str += ESCAPE_MAP[character];
        } else {
          break;
        }
      } else {
        str += character;
      }
    }

    throw new Error(`Bad string`);
  };

  const parseSpecialString = () => {
    // true, false, or null.
    switch (character) {
      case 't':
        character = nextCharacter('t');
        character = nextCharacter('r');
        character = nextCharacter('u');
        character = nextCharacter('e');
        return true;
      case 'f':
        character = nextCharacter('f');
        character = nextCharacter('a');
        character = nextCharacter('l');
        character = nextCharacter('s');
        character = nextCharacter('e');
        return false;
      case 'n':
        character = nextCharacter('n');
        character = nextCharacter('u');
        character = nextCharacter('l');
        character = nextCharacter('l');
        return null;
    }
    throw new Error(`Unexpected '${character}'`);
  };

  const parseArray = () => {
    const arr = [];
    if (character === '[') {
      character = nextCharacter('[');
      skipWhiteSpace();
      // empty array
      if (character === ']') {
        character = nextCharacter(']');
        return arr;
      }
      while (character) {
        arr.push(parseValue());
        skipWhiteSpace();
        if (character === ']') {
          character = nextCharacter(']');
          return arr;
        }
        character = nextCharacter(',');
        skipWhiteSpace();
      }
    }
    throw new Error(`Bad array`);
  };
  const handleObject = () => {
    // Parse an object value.
    const obj = {};
    if (character === '{') {
      character = nextCharacter('{');
      skipWhiteSpace();
      if (character === '}') {
        character = nextCharacter('}');
        return obj; // empty object
      }
      while (character) {
        const key = parseString();
        skipWhiteSpace();
        character = nextCharacter(':');
        if (Object.hasOwnProperty.call(obj, key)) {
          throw new Error(`Duplicate key '${key}'`);
        }
        obj[key] = parseValue();
        skipWhiteSpace();
        if (character === '}') {
          character = nextCharacter('}');
          return obj;
        }
        character = nextCharacter(',');
        skipWhiteSpace();
      }
    }
    throw new Error(`Bad object`);
  };

  const parseValue = () => {
    skipWhiteSpace();
    switch (character) {
      case '{':
        return handleObject();
      case '[':
        return parseArray();
      case '"':
        return parseString();
      case '-':
        return parseNumber();
      default:
        return character >= '0' && character <= '9'
          ? parseNumber()
          : parseSpecialString();
    }
  };

  const result = parseValue();
  skipWhiteSpace();
  if (character) {
    throw new Error(`Syntax error`);
  }
  return result;
};
