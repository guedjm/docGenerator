var utils = require(__base + 'utils');
var jade = require('jade');

var paragraph = function (index) {
  this.name = "";
  this.id = "";
  this.index = index;
  this.text = "";
  this.paragraphs = [];
  this.testVal = "#[h" + this.index + "(id=" + this.id + ")" + this.name + "]";
};

paragraph.prototype.parseJSON = function(obj) {

  this.name = obj.name;
  this.id = obj.id;
  this.text = utils.getHtmlText(obj.text);

  if (obj.paragraphs) {
    obj.paragraphs.forEach(function (elem, i, a) {
      var p = new paragraph(this.index + 1);
      p.parseJSON(elem);
      this.paragraphs.push(p);
    }, this);
  }
};

paragraph.prototype.getHtml = function (doc, html, index) {

  html +=
    "<p>" +
      "<h" + index + " id=\"" + this.id + "\">" + this.name + "</h" + index+">";
  html +=
      "<p>" + utils.getHtmlText(this.text) + "</p>";

  this.paragraphs.forEach(function (elem, i , a) {
    html = elem.getHtml(doc, html, index + 1);
  });
  html +=
    "</p>";

  return html;
};

paragraph.prototype.print = function (indent) {

  console.log(utils.indentText('- ' + this.name + ':', indent));
  console.log(utils.indentText(this.text, indent));

  this.paragraphs.forEach(function (elem, i, a) {
    elem.print(indent + 2);
  });
};

paragraph.prototype.render = function (doc) {
  return jade.renderFile(__base + 'template/paragraph.jade', this);
};

paragraph.prototype.renderMenu = function () {
  return jade.renderFile(__base + 'template/paragraph-menu.jade', this);
};



module.exports = paragraph;