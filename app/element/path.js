var jade = require('jade');
var utils = require(__base + 'utils');
var urlElem = require(__base + 'element/url');

var path = function (parent) {
  this.id = "";
  this.title = "";
  this.text = "";
  this.paths = [];
  this.urls = [];
  this.parent = parent;
};

path.prototype.parseJSON = function (obj) {
  this.title = obj.title;

  if (obj.text) {
    this.text = obj.text;
  }

  if (this.parent == null) {
    this.id = "paths-" + this.title.toLocaleLowerCase().replace(/ /g, '-');
  }
  else {
    this.id = this.parent.id + '-' + this.title.toLocaleLowerCase().replace(/ /g, '-');
  }

  if (obj.paths) {
    obj.paths.forEach(function (elem, i, a) {
      var subPath = new path(this);
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