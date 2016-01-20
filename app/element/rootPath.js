var jade = require('jade');
var pathElem = require(__base + 'element/path');
var urlElem = require(__base + 'element/url');

var rootPath = function () {
  this.urls = [];
  this.paths = [];
};

rootPath.prototype.parseJSON = function (obj) {

  if (obj.urls) {

    obj.urls.forEach(function (elem, i, a) {
      var u = new urlElem();
      u.parseJSON(elem);
      this.urls.push(u);
    }, this);
  }

  if (obj.paths) {
    obj.paths.forEach(function (elem, i, a) {
      var p = new pathElem(null);
      p.parseJSON(elem);
      this.paths.push(p);
    }, this);
  }
};

rootPath.prototype.render = function(doc) {
  return jade.renderFile(__base + 'template/rootPath.jade', {
    me : this,
    doc: doc
  });
};

rootPath.prototype.renderMenu = function() {
  return jade.renderFile(__base + 'template/rootPath-menu.jade', {
    me : this
  });
};

module.exports = rootPath;