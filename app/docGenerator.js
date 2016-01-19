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
    self.saveDescription();
    self.saveVersionFile();
  });
};

docGenerator.prototype.prepareBuildDirectory = function (done) {

  var self = this;
  console.log('Preparing build directory ...');

  fs.createFileDir(this.parameters.buildDir);
  ncp(__base + 'src/', this.parameters.buildDir, function (err) {
    if (err) {
      console.error('Error while preparing build directory ...');
      console.error(err);
      process.exit(1);
    }
    else {

      if (fs.fileExist(self.parameters.buildDir + '/v' + self.parameters.version)) {

        var readline = require('readline');

        var rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        rl.question('An existing entry exist for the version v' + self.parameters.version + '. Erase directory ? [y/n] ',
          function (result) {

            if (result == 'y') {
              fs.deleteDirectory(self.parameters.buildDir + '/v' + self.parameters.version);
              console.log('Erased');
              done();
            }
            else {
              console.error('Abort');
              process.exit(1);
            }
            rl.close();
          });
      }
      else {
        done();
      }
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

  console.log('Saving html version ...');
  this.versionFile.renderToFile(this.parameters.buildDir + '/index.html', this.apiDocumentation.info);
};

docGenerator.prototype.saveDescription = function () {

  this.apiDocumentation.saveDescription(this.parameters.buildDir + '/v' + this.parameters.version + '/doc.yaml');
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
