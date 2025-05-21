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
  // get dummy gulp function
  f = id => async function fun() { log(`fun ${id} runs ..`); },
  isEmpty = (...oo) => oo.every(o => typeof o === 'object' && s.length > 0);
// isString = (...ss) => ss.every(s => typeof s === 'string' && s.length > 0);

const main = (() => {
  const
    buildList = {
      pug: [
        'index'
      ],
      scss: [
        'core_1'
      ]
    },
    watchList = {
      pug: [
        'index'        
      ],
      scss: [
        'core_1'
      ]
    },
    _dest = {
      pages: 'site',
      css: 'site/css',
      scripts: 'site/js',
    };
  // map source lists
  [buildList, watchList].forEach(list => {
    ['html', 'php', 'txt', 'md'].forEach(type => {
      list[type] = list.pug.map(item => `src/pug/${item}/**/*.${type}.pug`);
    });
    list.scss = list.scss.map(item => `src/scss/${item}/**/*.scss`);
  });
  const
    html = (source, destination) => async function transpiling_html() {
      return src(source)
        .pipe(pug({ pretty: true }))
        .pipe(ext('.html'))
        .pipe(dest(destination));
    },
    sassOpt = {
      outputStyle: 'compressed' // compressed | expanded
    },
    scss = (source, destination, opt = sassOpt) => async function transpiling_scss() {
      return src(source)
        .pipe(sass(opt).on("error", sass.logError))
        .pipe(cleanCSS())
        .pipe(dest(destination));
    },
    watchOpt = {
      ignoreInitial: false
    },
    _watch = (fn, src, dest, opt = watchOpt) => function watching() {
      if (!isEmpty(dest, src)) watch(src, opt, fn(src, dest));
      else log(`Error in _watch - src: ${src}, dest: ${dest}`);
    },
    // builders
    files = f('files'),
    pages = parallel(
      html(buildList.html, _dest.pages),
      html(buildList.php, _dest.pages),
      html(buildList.txt, _dest.pages),
      html(buildList.md, _dest.pages),
    ),
    styles = scss(buildList.scss, _dest.css),
    scripts = f('scripts'),
    // watchers
    filesw = f('filesw'),
    pagesw = parallel(
      _watch(html, watchList.html, _dest.pages),
      _watch(html, watchList.php, _dest.pages),
      _watch(html, watchList.txt, _dest.pages),
      _watch(html, watchList.md, _dest.pages),
    ),
    stylesw = _watch(scss, watchList.scss, _dest.css),
    scriptsw = f('scriptsw');

  return {
    files,
    pages,
    styles,
    scripts,
    filesw,
    pagesw,
    stylesw,
    scriptsw,
    default: parallel(files, pages, styles, scripts),
    watch: parallel(filesw, pagesw, stylesw, scriptsw),
  }
})();

assign(exports, main);