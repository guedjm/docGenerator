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

response.prototype.getHtml = function (doc, html) {

  html +=
    "<tr>" +
      "<th>" + this.status + "</th>" +
      "<td>" +this.description + "</td>" +
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

response.prototype.render = function (doc) {
  return jade.renderFile(__base + 'template/response.jade', {
    me : this,
    doc: doc
  });
};

module.exports = response;