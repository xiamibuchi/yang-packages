export type Mutable<T> = {
  -readonly [Key in keyof T]: T[Key];
};

export type HTMLElementCustomized<T> = HTMLElement & T;

/**
 * @deprecated stop to use null
 * @see {@link https://github.com/sindresorhus/meta/discussions/7}
 */
export type Nullable<T> = T | null;

export type Arrayable<T> = T | T[];
export type Awaitable<T> = Promise<T> | T;
