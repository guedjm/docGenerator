var utils = require(__base + "utils");
var labelType = ['label-info', 'label-warning', 'label-primary', 'label-success', 'label-danger'];

var tag = function () {
  this.name = "";
  this.value = "";
  this.color = "";
};

tag.prototype.parseJSON = function (obj) {
  this.name = obj.name;
  this.value = obj.value;
};

tag.prototype.print = function () {
  console.log('  - ' + this.name);
};

tag.prototype.resolve = function (index) {
  this.value = utils.getUrl(this.value);
  this.color = labelType[index % (labelType.length - 1)];
};

module.exports = tag;