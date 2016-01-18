var utils = require(__base + "utils");

var info = function () {
  this.title = "";
  this.name = "";
  this.version = "";
};

info.prototype.parseJSON = function (obj) {
  this.title = obj.title;
  this.name = obj.name;
};

info.prototype.print = function () {
};

module.exports = info;