const
  buildList = {
    pug: [
      'main',
      'core',
      'basics'
    ],
    scss: [
      'core'
    ]
  },
  watchList = buildList,
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
  list['css'] = list.scss.map(item => `src/scss/${item}/**/*.scss`);
});

module.exports = { buildList, watchList, _dest };