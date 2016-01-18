var fs = require(__base + 'myfs');
var ncp = require('ncp');
var versionFile = require(__base + 'element/versionFile');
var apiDocumentation = require(__base + 'element/apiDocumentation');

var docGenerator = function (param) {

  this.versionFile = new versionFile();
  this.apiDocumentation = new apiDocumentation();
  this.parameters = param;
};

docGenerator.prototype.generate = function () {

  var self = this;
  this.loadVersion();
  this.loadDefinition();
  this.prepareBuildDirectory(function () {

    self.saveHtmlResult();
    self.saveVersionFile();
  });
};

docGenerator.prototype.prepareBuildDirectory = function (done) {

  console.log('Preparing build directory ...');

  fs.createFileDir(this.parameters.buildDir);
  ncp(__base + 'src/', this.parameters.buildDir, function (err) {
    if (err) {
      console.error('Error while preparing build directory ...');
      console.error(err);
      process.exit(1);
    }
    else {
      done();
    }
  });
};

docGenerator.prototype.loadVersion = function () {
  console.log('Loading version file ...');
  if (!this.versionFile.loadFile(this.parameters.versionFile)) {
    process.exit(1);
  }
};

docGenerator.prototype.loadDefinition = function () {
  console.log('Loading definition file ...');
  if (!this.apiDocumentation.parseFile(this.parameters.sourceFile, this.parameters.version)) {
    process.exit(1);
  }
};

docGenerator.prototype.saveHtmlResult = function () {

  console.log('Saving html definition ...');
  this.apiDocumentation.renderToFile(this.parameters.buildDir + '/v' + this.parameters.version + '/index.html');
};

docGenerator.prototype.saveVersionFile = function () {

  this.versionFile.addVersion(this.parameters.version, this.parameters.versionMessage);

  console.log('Saving version file ...');
  if (!this.versionFile.save()) {
    process.exit(1);
  }
  if (!this.versionFile.save(this.parameters.buildDir + '/version.json')) {
    process.exit(1);
  }
};


module.exports = docGenerator;
