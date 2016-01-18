var fs = require('fs');
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
  this.paragraphs = [];
  this.tags = [];
  this.paths = [];
  this.errors = [];
  this.objects = [];
};

apiDescription.prototype.parseFile = function (file, version) {

  try {
    var f = fs.readFileSync(file, 'utf8');
    var obj = yaml.safeLoad(f);

    console.log('Parsing file ' + file + ' ...');
    this.info.version = version;
    this.parseJSON(obj);
  }
  catch (e) {
    console.error('Error while parsing yaml file: ');
    console.error(e.message);
    this.error = true;
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


apiDescription.prototype.getHtml= function () {

  var html = "";

  this.tags.forEach(function (elem, i, a) {
    elem.resolve();
  });

  this.paragraphs.forEach(function (elem, i, a) {
    html = elem.getHtml(this, html, 1);
  }, this);

  html = this.getPathHtml(html);
  html = this.getObjectHtml(html);
  html = this.getErrorHtml(html);
  return htmll.prettyPrint(html);
};

apiDescription.prototype.getPathHtml = function (html) {

  html += "<p><h1>API Reference</h1>";

  this.paths.forEach(function (elem, i, a) {
    html = elem.getHtml(this, html, 2);
  }, this);

  html += "</p>";
  return html;
};

apiDescription.prototype.getErrorHtml = function (html) {

  html += "<p><h1>Possible Error response</h1>";
  html += "<table>" +
    "<thead>" +
      "<tr>" +
        "<th>HTTP status</th>" +
        "<th>ErrorCode</th>" +
        "<th>ErrorSubCode</th>" +
        "<th>Message</th>" +
        "<th>Comment</th>" +
      "</tr>" +
    "</thead>" +
    "<tbody>";

  this.errors.forEach(function (elem, i, a) {
    html = elem.getHtml(this, html);
  }, this);
  html += "</tbody>" +
    "</table>" +
    "</p>";

  return html;
};

apiDescription.prototype.getObjectHtml = function (html) {

  html += "<p><h1>Objects</h1>";

  this.objects.forEach(function (elem, i, a) {
    html = elem.getHtml(this, html);
  }, this);
  html += "</p>";

  return html;
};

apiDescription.prototype.render = function() {

  var html = jade.renderFile(__base + 'template/apiDocumentation.jade', {
    me : this
  });

  return (htmll.prettyPrint(html));
};

module.exports = apiDescription;