var jade = require('jade');
var utils = require(__base + 'utils');
var methodElem = require(__base + 'element/method');

var path = function () {
  this.name = "";
  this.id = "";
  this.type = "";
  this.description = "";
  this.paths = [];
  this.methods = [];
};

path.prototype.parseJSON = function (obj) {
  this.name = obj.name;
  this.id = obj.id;
  this.type = obj.type;
  this.description = obj.description;

  if (this.type == "group" && obj.paths) {
    obj.paths.forEach(function (elem, i, a) {
      var subPath = new path();
      subPath.parseJSON(elem);
      this.paths.push(subPath);
    }, this);
  }

  if (this.type == "url" && obj.methods) {

    obj.methods.forEach(function (elem, i, a) {
      var method = new methodElem();
      method.parseJSON(elem);
      this.methods.push(method);
    }, this);
  }
};

path.prototype.print = function (indent) {

  console.log(utils.indentText('- ' + this.name, indent));

  this.paths.forEach(function (elem, i, a) {
    elem.print(indent + 2);
  });

  this.methods.forEach(function (elem, i, a) {
    elem.print(indent + 2);
  });
};

path.prototype.getHtml = function (doc, html, index) {

  if (this.type == "group") {
    html +=
      "<p>" +
        "<h" + index + " id=\"" + this.id + "\">" + this.name + "</h" + index + ">";
  } else {
    html +=
      "<p id=\"" + this.id + "\">";
  }
  if (this.description) {
    html +=
        "<p>" + this.description + "</p>";
  }

  this.paths.forEach(function (elem, i, a) {
    html = elem.getHtml(doc, html, index + 1);
  });

  this.methods.forEach(function (elem, i, a) {
    html = elem.getHtml(doc, html, this.name, index);
  }, this);

  html +=
    "</p>";
  return html;
};

path.prototype.render = function (doc) {
  return jade.renderFile(__base + 'template/path.jade', {
    me : this,
    doc: doc
  });
};

path.prototype.renderMenu = function (doc) {
  return jade.renderFile(__base + 'template/path-menu.jade', {
    me : this,
    doc: doc
  });
};

module.exports = path;