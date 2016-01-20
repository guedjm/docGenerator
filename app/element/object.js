var jade = require('jade');
var utils = require(__base + 'utils');

var object = function () {
  this.id = "";
  this.name = "";
  this.description = "";
  this.obj = null;
};

object.prototype.parseJSON = function (obj) {
  this.id = obj.id;
  this.name = obj.name;
  if (obj.description) {
    this.description = utils.getHtmlText(utils.markdownToHtml(obj.description));
  }
  this.obj = obj.obj;
};

object.prototype.print = function () {
  console.log('  - ' + this.id + ' (' + this.description + ')');
  console.log('  ' + JSON.stringify(this.obj, null, 4));
};

object.prototype.render = function (doc) {
  return jade.renderFile(__base + 'template/object.jade', {
    me : this,
    doc: doc
  });
};

object.prototype.renderMenu = function () {
  return jade.renderFile(__base + 'template/object-menu.jade', {
    me : this
  });
};

object.prototype.replacer = function (match, pIndent, pKey, pVal, pEnd) {
  var key = '<span class=json-key>';
  var val = '<span class=json-value>';
  var str = '<span class=json-string>';
  var r = pIndent || '';
  if (pKey)
    r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
  if (pVal)
    r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
  return r + (pEnd || '');
};

object.prototype.getPrettyPrintedObj = function () {
  var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
  return JSON.stringify(this.obj, null, 2)
    .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(jsonLine, this.replacer);
};

module.exports = object;