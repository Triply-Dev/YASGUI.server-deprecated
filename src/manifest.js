var fs = require('fs');
config = require('./config.js');
/**
Every fs call we make here is synchronous for simplicity.
Performance-wise this doesnt matter much, as we cache the string
**/
var manifestString = null;
var getString = function(dev, cachedFiles) {
  //if (manifestString) return manifestString;//don't cache manifest string, otherwise cache wont be refreshed for new versions
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
      'dist/yasgui.min.css': config.server.yasguiAssets + '/yasgui.min.css',
      'dist/yasgui.min.js': config.server.yasguiAssets + '/yasgui.min.js',
    });
  }
};
