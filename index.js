var util = require('util');
var BroccoliTreeWriter = require('./lib/broccoli-tree-writer');

function GlobalExporter(inputTree, options) {
  GlobalExporter.super_.apply(this, arguments);
};

util.inherits(GlobalExporter, BroccoliTreeWriter);

GlobalExporter.prototype.compileTree = function(files) {
  var file = files.join('');
  return [
    '(function(globals) {', 
    file,
    'globals.'+ this.namespace +' = requireModule("'+ this.name +'");',
    '}(window));'
  ].join('\n');
};

module.exports = GlobalExporter;
