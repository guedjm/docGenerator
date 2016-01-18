var fs = require(__base + 'myfs');

var versionFile = function() {
  this.versions = [];
  this.filePath = "";
};

versionFile.prototype.loadFile = function (path) {
  this.filePath = path;

  try {
    var versionFileContent = require(path);

    if (!Array.isArray(versionFileContent)) {
      console.error("Invalid version file: " + path);
      return false;
    }
    else {
      this.versions = versionFileContent;
    }
  }
  catch (e) {
    console.error(e.message);
    console.log('Starting with an empty version file');
  }
  return true;
};

versionFile.prototype.addVersion = function (version, message) {
  this.versions.push({
    version: version,
    message: message
  });
};

versionFile.prototype.save = function(dest) {

  if (dest == null) {
    dest = this.filePath;
  }
  fs.createFileDir(dest);

  var res =  fs.writeFile(dest, JSON.stringify(this.versions, null, 4));

  if (res == false) {
    console.error("Unable to save version file");
  }

  return res;
};

module.exports = versionFile;