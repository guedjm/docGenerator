var jade = require('jade');
var utils = require(__base + 'utils');

var error = function () {
  this.id = "";
  this.status = "";
  this.code = 0;
  this.subCode = "";
  this.message = "";
  this.fix = "";
};

error.prototype.parseJSON = function (obj) {
  this.id = obj.id;
  this.status = obj.status;
  this.code = obj.code;
  if (obj.subcode) {
    this.subCode = obj.subcode;
  }
  this.message = obj.message;

  if (obj.fix) {
    this.fix = utils.getHtmlText(utils.markdownToHtml(obj.fix));
  }
};

error.prototype.print = function () {
  console.log('  - ' + this.id + ' (' + this.status + '/' + this.code + '/' + this.subCode + ')');
};

error.prototype.render = function (doc) {
  return jade.renderFile(__base + 'template/error.jade', {
    me : this,
    doc: doc
  });
};

error.prototype.renderMenu = function () {
  return jade.renderFile(__base + 'template/error-menu.jade', {
    me : this
  });
};

module.exports = error;