var jade = require('jade');
var utils = require(__base + 'utils');

var parameter = function () {
  this.name = "";
  this.description = "";
  this.required = false;
  this.in = "";
  this.type = "";
};

parameter.prototype.parseJSON = function (obj) {
  this.name = obj.name;
  this.description = obj.description;
  this.required = obj.required;
  this.in  = obj.in;
  this.type = obj.type;
};

parameter.prototype.print = function (indent) {
  console.log(utils.indentText('- ' + this.name, indent));
};

parameter.prototype.render = function (doc) {
  return jade.renderFile(__base + 'template/parameter.jade', {
    me : this,
    doc: doc
  });
};

module.exports = parameter;