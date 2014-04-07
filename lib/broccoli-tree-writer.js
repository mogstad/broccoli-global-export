var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var util = require('util');

var Writer = require('broccoli-writer');
var helpers = require('broccoli-kitchen-sink-helpers');

function BroccoliTreeWriter(inputTree, options) {
  if (!(this instanceof BroccoliTreeWriter)) {
    return new BroccoliTreeWriter(inputTree, options);
  }

  this.cache = {};
  this.inputTree = inputTree;
  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      this[key] = options[key];
    }
  }
};
util.inherits(BroccoliTreeWriter, Writer);

BroccoliTreeWriter.prototype.write = function(readTree, destDir) {
  return readTree(this.inputTree).then(function(srcDir) {
    var newCache = {};
    var outputTree = this._processFiles(this.inputFiles || [], srcDir, newCache);
    var compiledOutput = this.compileTree(outputTree);

    helpers.assertAbsolutePaths([this.outputFile]);
    mkdirp.sync(path.join(destDir, path.dirname(this.outputFile)));

    fs.writeFileSync(path.join(destDir, this.outputFile), compiledOutput);

    this.cache = newCache;
  }.bind(this));
};

BroccoliTreeWriter.prototype.compileTree = function(files) {
  return files.join('');
};

BroccoliTreeWriter.prototype.compileFile = function(filePath) {
  return {
    output: fs.readFileSync(filePath, {encoding: 'utf8'})
  }
};

// Private

BroccoliTreeWriter.prototype._processFiles = function(inputFiles, srcDir, cache) {
  var output = [];
  var inputFiles = helpers.multiGlob(inputFiles, {cwd: srcDir});
  for (var index = 0; index < inputFiles.length; index++) {
    output.push(this._processFile(inputFiles[index], srcDir, cache));
  }
  return output;
};

BroccoliTreeWriter.prototype._processFile = function(fileName, srcDir, cache) {
  var filePath = srcDir + '/' + fileName;
  var statsHash = helpers.hashStats(fs.statSync(filePath), fileName);
  var cacheObject = this.cache[statsHash];
  if (cacheObject == null) {
    cacheObject = this.compileFile(filePath);
  }
  cache[statsHash] = cacheObject;
  return cacheObject.output;
};

module.exports = BroccoliTreeWriter;
