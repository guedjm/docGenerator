var utils = require(__base + 'utils');
var jade = require('jade');

var paragraph = function (parent) {
  this.title = "";
  this.id = "";
  this.text = "";
  this.parent = parent;
  this.paragraphs = [];
};

paragraph.prototype.parseJSON = function(obj) {

  this.title = obj.title;
  if (obj.text) {
    this.text = utils.getHtmlText(utils.markdownToHtml(obj.text));
  }

  if (this.parent == null) {
    this.id = "paragraphs-" + this.title.toLowerCase().replace(/ /g, '-');
  }
  else {
    this.id = this.parent.id + '-' + this.title.toLowerCase().replace(/ /g, '-');
  }

  if (obj.paragraphs) {
    obj.paragraphs.forEach(function (elem, i, a) {
      var p = new paragraph(this);
      p.parseJSON(elem);
      this.paragraphs.push(p);
    }, this);
  }
};

paragraph.prototype.print = function (indent) {

  console.log(utils.indentText('- ' + this.name + ':', indent));
  console.log(utils.indentText(this.text, indent));

  this.paragraphs.forEach(function (elem, i, a) {
    elem.print(indent + 2);
  });
};

paragraph.prototype.render = function (doc, first) {
  return jade.renderFile(__base + 'template/paragraph.jade',
    {
      me: this,
      first: first,
      doc: doc
    });
};

paragraph.prototype.renderMenu = function () {
  return jade.renderFile(__base + 'template/paragraph-menu.jade', this);
};



module.exports = paragraph;