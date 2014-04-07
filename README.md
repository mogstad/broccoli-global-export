# broccoli-global-export

## Usage
```js
var exporter = require("broccoli-global-exporter");
var exported = new exporter(sourceTree, {
  inputFiles: [
    'app/**/*.js'
  ],
  outputFile: '/assets/application.js',
  name: "something",
  namespace: "something"
});
```
