// ===============================================================
// pack all entry to output folder.
// ===============================================================
const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    // [output-file] : [input-file]
    // "custom.js"  : path.resolve(__dirname, 'src/js/custom.js'),
    "index.js"  : path.resolve(__dirname, 'src/js/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'site/js'),
    filename: '[name]'
  }
};