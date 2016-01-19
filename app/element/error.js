var jade = require('jade');

var error = function () {
  this.id = "";
  this.status = "";
  this.code = 0;
  this.subCode = 1;
  this.message = "";
  this.fix = "";
};

error.prototype.parseJSON = function (obj) {
  this.id = obj.id;
  this.status = obj.status;
  this.code = obj.code;
  this.subCode = obj.subcode;
  this.message = obj.message;
  this.fix = obj.fix;
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