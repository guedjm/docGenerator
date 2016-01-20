var jade = require('jade');
var utils = require(__base + 'utils');
var urlElem = require(__base + 'element/url');

var path = function () {
  this.title = "";
  this.id = "";
  this.description = "";
  this.paths = [];
  this.urls = [];
};

path.prototype.parseJSON = function (obj) {
  this.title = obj.title;
  this.id = obj.id;
  this.description = obj.description;

  if (obj.paths) {
    obj.paths.forEach(function (elem, i, a) {
      var subPath = new path();
      subPath.parseJSON(elem);
      this.paths.push(subPath);
    }, this);
  }

  if (obj.urls) {

    obj.urls.forEach(function (elem, i, a) {
      var u = new urlElem();
      u.parseJSON(elem);
      this.urls.push(u);
    }, this);
  }
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