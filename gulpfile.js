// ===============================================================
// This is the gulper task definitions.
// - telling gulper how to build the project.
// Find more information about Gulp on http://gulpjs.com
// ===============================================================
// To list available tasks, run: > gulp --tasks
// ===============================================================

const
  log = console.log,
  assign = Object.assign,
  { src, dest, series, parallel, watch } = require('gulp'),
  pug = require('gulp-pug'), // read pug write html,php,txt,md
  sass = require('gulp-sass')(require("sass")), // read sass write css
  cleanCSS = require('gulp-clean-css'), // minify css
  rename = require('gulp-rename'), // name file extension
  ext = extname => {
    return rename((path) => {
      path.basename = path.basename.substring(0, path.basename.lastIndexOf('.'));
      path.extname = extname;
    })
  },
  isEmpty = (...oo) => oo.every(o => typeof o === 'object' && s.length > 0);
// isString = (...ss) => ss.every(s => typeof s === 'string' && s.length > 0);

const main = (() => {
  const { buildList, watchList, _dest } = require('./gulplist');
  if (buildList && watchList && _dest) { } else {
    throw new Error('Please define gulplist.js');
  }
  // map source lists
  [buildList, watchList].forEach(list => {
    ['html', 'php', 'txt', 'md'].forEach(type => {
      list[type] = list.pug.map(item => `src/pug/${item}/**/*.${type}.pug`);
    });
    list.scss = list.scss.map(item => `src/scss/${item}/**/*.scss`);
  });
  const
    onerror = function onerror(error) {
      const I = ':', { code, msg, fileName, line, column } = error;
      // log(error);
      log([
        code + I + msg,
        fileName + I + line + I + column,
      ].join('\n'));
      this.emit('end');
    },
    html = (source, destination) => async function html_transpiler() {
      log(`Transpiling HTML from: ${source}`)
      return src(source)
        .on('error', onerror)
        .pipe(pug({ pretty: true }))
        .pipe(ext('.html'))
        .pipe(dest(destination));
    },
    php = (source, destination) => async function php_transpiler() {
      log(`Transpiling PHP from: ${source}`)
      return src(source)
        .on('error', onerror)
        .pipe(pug({ pretty: true }))
        .pipe(ext('.php'))
        .pipe(dest(destination));
    },
    txt = (source, destination) => async function txt_transpiler() {
      log(`Transpiling TXT from: ${source}`)
      return src(source)
        .on('error', onerror)
        .pipe(pug())
        .pipe(ext('.txt'))
        .pipe(dest(destination));
    },
    md = (source, destination) => async function md_transpiler() {
      log(`Transpiling MD from: ${source}`)
      return src(source)
        .on('error', onerror)
        .pipe(pug())
        .pipe(ext('.md'))
        .pipe(dest(destination));
    },
    sassOpt = {
      outputStyle: 'compressed' // compressed | expanded
    },
    scss = (source, destination, opt = sassOpt) => async function scss_transpiler() {
      log(`Transpiling SCSS from: ${source}`)
      return src(source)
        .pipe(sass(opt).on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(dest(destination));
    },
    watchOpt = {
      ignoreInitial: false
    },
    _watch = (fn, src, dest, opt = watchOpt) => function watcher() {
      if (!isEmpty(dest, src)) watch(src, opt, fn(src, dest));
      else log(`Error in _watch - src: ${src}, dest: ${dest}`);
    },
    // builders
    pages = parallel(
      html(buildList.html, _dest.pages),
      php(buildList.php, _dest.pages),
      txt(buildList.txt, _dest.pages),
      md(buildList.md, _dest.pages),
    ),
    styles = scss(buildList.scss, _dest.css),
    // watchers
    pagesw = parallel(
      _watch(html, watchList.html, _dest.pages),
      _watch(php, watchList.php, _dest.pages),
      _watch(txt, watchList.txt, _dest.pages),
      _watch(md, watchList.md, _dest.pages),
    ),
    stylesw = _watch(scss, watchList.scss, _dest.css);

  return {
    html,
    php,
    txt,
    md,
    scss,
    pages,
    styles,
    pagesw,
    stylesw,
    default: parallel(pages, styles),
    watch: parallel(pagesw, stylesw),
  }
})();

assign(exports, main);