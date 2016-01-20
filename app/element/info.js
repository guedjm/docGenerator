var utils = require(__base + "utils");

var info = function () {
  this.title = "";
  this.name = "";
  this.description = "";
};

info.prototype.parseJSON = function (obj) {
  this.title = obj.title;
  this.name = obj.name;
  if (obj.description) {
    this.description = utils.markdownToHtml(obj.description);
  }
};

info.prototype.print = function () {
};

module.exports = info;