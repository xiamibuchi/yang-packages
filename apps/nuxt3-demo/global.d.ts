import '../../global.d.ts';

declare global {
  namespace NodeJS {}
  interface Window {
    _sy_referer?: string;
  }
}
