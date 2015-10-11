var fs = require('fs');
/**
Every fs call we make here is synchronous for simplicity.
Performance-wise this doesnt matter much, as we cache the string
**/
var manifestString = null;
var getString = function(dev, cachedFiles) {
  if (manifestString) return manifestString;
  manifestString = "CACHE MANIFEST\n\n";
  manifestString += "CACHE:\n";
  var lastModified = '#';
  if (dev) {
    //don't cache anything
  } else {
    for (var file in cachedFiles) {
      if (fs.existsSync(cachedFiles[file])) {
        manifestString += file + "\n";
        lastModified += fs.statSync(cachedFiles[file]).mtime;
      } else {
        console.warn("File " + cachedFiles[file] + " does not exist. Not putting this in appcache manifest");
      }
    }
    manifestString += "\n";
  }
  manifestString += "NETWORK:\n"
    + "*\n\n"
    + lastModified
    + "\n";

  return manifestString;
}

module.exports = {
  get: function(dev) {
    return getString(dev, {
      'dist/yasgui.min.css': __dirname + '/../node_modules/yasgui/dist/yasgui.min.css',
      'dist/yasgui.min.js': __dirname + '/../node_modules/yasgui/dist/yasgui.min.js',
    });
  }
};
