import Fontmin from 'fontmin';
import fs from 'fs-extra';

const text = fs.readFileSync('langs/chinese.txt', 'utf8');
const fontmin = new Fontmin()
  .use(Fontmin.glyph({ text }))
  .use(Fontmin.ttf2woff2())
  .use(Fontmin.ttf2woff())
  .src('fonts/*.ttf')
  .dest('dist');

fontmin.run((err, files) => {
  if (err) {
    throw err;
  }
  console.log(files[0]);
  // => { contents: <Buffer 00 01 00 ...> }
});
