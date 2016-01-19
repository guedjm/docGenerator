var fs = require('fs');
var path = require('path');

function fileExist(filePath) {
  try {
    return fs.statSync(filePath);
  }
  catch (e) {
    return false;
  }
}

function createFile(filePath) {

  var r = fileExist(filePath);

  if (!r) {

    var contentDir = path.dirname(filePath);
    var rr = fileExist(contentDir);
    if (!rr) {
      fs.mkdirSync(contentDir);
    }
  }
}

function createFileDir(filePath) {

  //If file exist ok
  var r = fileExist(filePath);

  if (!r) {

    var pathComponent = filePath.split(path.sep);
    createDir(pathComponent, 0);
  }
}

function createDir(pathComponent, index) {

  var dir = pathComponent.slice(0, pathComponent.length - index - 1).join(path.sep);

  if (!fileExist(dir)) {
    createDir(pathComponent, index + 1);
    fs.mkdirSync(dir);
  }
}

function writeFile(filePath, content) {

  try {
    fs.writeFileSync(filePath, content);
    return true;
  }
  catch (e) {
    return false;
  }
}

function deleteFile(filepath) {
  fs.unlinkSync(filepath);
}

var deleteDirectory = function(path) {

  if (fs.existsSync(path)) {

    fs.readdirSync(path).forEach(function (file, index) {

      var curPath = path + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirectory(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports.fileExist = fileExist;
module.exports.createFile = createFile;
module.exports.createFileDir = createFileDir;
module.exports.writeFile = writeFile;
module.exports.deleteFile = deleteFile;
module.exports.deleteDirectory = deleteDirectory;