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

parameter.prototype.getHtml = function (doc, html) {

  html +=
    "<tr>" +
      "<th>" + this.name + "</th>" +
      "<td>" + this.description + "</td>" +
      "<td>" + this.required.toString() + "</td>" +
      "<td>" + this.in + "</td>" +
      "<td>";
  if (this.type == "string" || this.type == "int" || this.type == "bool") {
    html += this.type;
  } else {
    var obj = doc.getObject(this.type);
    html +=
        "<a href=\"#" + obj.id + "\">" + obj.name + "</a>"
  }
  html +=
      "</td>" +
    "</tr>";

  return html;
};

parameter.prototype.render = function (doc) {
  return jade.renderFile(__base + 'template/parameter.jade', {
    me : this,
    doc: doc
  });
};

module.exports = parameter;