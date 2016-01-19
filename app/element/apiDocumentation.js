var fs = require(__base + 'myfs');
var rfs = require('fs');
var htmll = require('html');
var yaml = require('js-yaml');
var jade = require('jade');
var paragraphElem = require(__base + 'element/paragraph');
var tagElem = require(__base + 'element/tag');
var pathElem = require(__base + 'element/path');
var errorElem = require(__base + 'element/error');
var objElem = require(__base + 'element/object');
var infoElem = require(__base + 'element/info');

var apiDescription = function () {
  this.error = false;
  this.info = new infoElem();
  this.json = "";
  this.paragraphs = [];
  this.tags = [];
  this.paths = [];
  this.errors = [];
  this.objects = [];
};

apiDescription.prototype.parseFile = function (file, version) {

  try {
    this.json = rfs.readFileSync(file, 'utf8');
    var obj = yaml.safeLoad(this.json);

    console.log('Parsing file ' + file + ' ...');
    this.info.version = version;
    return this.parseJSON(obj);
  }
  catch (e) {
    console.error('Error while parsing yaml file: ');
    console.error(e.message);
    return false;
  }
};

apiDescription.prototype.parseJSON = function (json) {

  if (json.info) {
    this.info.parseJSON(json.info);
  }

  if (json.paragraphs) {
    json.paragraphs.forEach(function (elem, i, a) {
      var p = new paragraphElem(1);
      p.parseJSON(elem);
      this.paragraphs.push(p);
    }, this)
  }

  if (json.tags) {
    json.tags.forEach(function (elem, i, a) {
      var tag = new tagElem();
      tag.parseJSON(elem);
      this.tags.push(tag);
    }, this)
  }

  if (json.paths) {
    json.paths.forEach(function (elem, i, a) {
      var path = new pathElem();
      path.parseJSON(elem);
      this.paths.push(path);
    }, this)
  }

  if (json.errors) {
    json.errors.forEach(function (elem, i, a) {
      var error = new errorElem();
      error.parseJSON(elem);
      this.errors.push(error);
    }, this)
  }

  if (json.objects) {
    json.objects.forEach(function (elem, i, a) {
      var obj = new objElem();
      obj.parseJSON(elem);
      this.objects.push(obj);
    }, this)
  }

  this.tags.forEach(function (elem, i, a) {
    elem.resolve(i);
  });

  return true;
};

apiDescription.prototype.print = function () {

  console.log('Paragraphs :');
  this.paragraphs.forEach(function (elem, i , a) {
    elem.print(2);
  });

  console.log('Tags :');
  this.tags.forEach(function (elem, i , a) {
    elem.print();
  });

  console.log('Paths :');
  this.paths.forEach(function (elem, i , a) {
    elem.print(2);
  });

  console.log('Errors :');
  this.errors.forEach(function (elem, i , a) {
    elem.print();
  });

  console.log('Objects :');
  this.objects.forEach(function (elem, i , a) {
    elem.print();
  });

};

apiDescription.prototype.getTagUrl = function (tag) {

  var ret = null;

  this.tags.forEach(function (elem, i, a) {
    if (elem.name.toString() == tag.toString()) {
      ret = elem;
    }
  });
  return ret;
};

apiDescription.prototype.getObject = function (objectId) {

  var ret = null;

  this.objects.forEach(function (elem, i, a) {
    if (elem.id.toString() == objectId.toString()) {
      ret = elem;
    }
  });
  return ret;
};

apiDescription.prototype.getError = function (errorId) {

  var ret = null;

  this.errors.forEach(function (elem, i, a) {
    if (elem.id.toString() == errorId.toString()) {
      ret = elem;
    }
  });
  return ret;
};


apiDescription.prototype.renderToFile = function(filepath) {

  var html = jade.renderFile(__base + 'template/apiDocumentation.jade', {
    me : this
  });
  var result = htmll.prettyPrint(html);

  fs.createFileDir(filepath);
  fs.writeFile(filepath, result);
};

apiDescription.prototype.saveDescrition = function (filePath) {
  fs.writeFile(filePath, this.json);
};

module.exports = apiDescription;