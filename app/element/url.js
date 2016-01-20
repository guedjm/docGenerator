var jade = require('jade');
var utils = require(__base + 'utils');
var methodElem = require(__base + 'element/method');

var url = function () {
  this.url = "";
  this.methods = [];
};

url.prototype.parseJSON = function (obj) {

  this.url = obj.url;

  if (obj.methods) {

    obj.methods.forEach(function (elem, i, a) {
      var m = new methodElem();
      m.parseJSON(elem);
      this.methods.push(m);
    }, this);
  }
};

url.prototype.render = function (doc) {
  return jade.renderFile(__base + 'template/url.jade', {
    me : this,
    doc: doc
  });
};

url.prototype.renderMenu = function() {
  return jade.renderFile(__base + 'template/url-menu.jade', {
    me : this
  });
};

module.exports = url;