var jade = require('jade');
var htmll = require('html');
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

  var done = false;

  this.versions.forEach(function (entry, i , a) {
    if (entry.version == version) {
      entry.message = message;
      done = true;
    }
  });

  if (!done) {
    this.versions.push({
      version: version,
      message: message
    });
  }
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

versionFile.prototype.renderToFile = function (path, info) {

  var html = jade.renderFile(__base + 'template/version.jade', {
    me : this,
    info: info
  });
  var result = htmll.prettyPrint(html);

  fs.createFileDir(path);
  fs.writeFile(path, result);
};

module.exports = versionFile;