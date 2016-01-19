var jade = require('jade');
var utils = require(__base + 'utils');

var response = function () {
  this.status = "";
  this.description = "";
  this.type = "";
};

response.prototype.parseJSON = function (obj) {
  this.status = obj.status;
  this.description = obj.description;
  this.type = obj.type;
};

response.prototype.print = function (indent) {
  console.log(utils.indentText('  - ' + this.status + ': ' + this.description, indent));
};

response.prototype.render = function (doc) {
  return jade.renderFile(__base + 'template/response.jade', {
    me : this,
    doc: doc
  });
};

module.exports = response;