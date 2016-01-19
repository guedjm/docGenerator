var jade = require('jade');
var utils = require(__base + 'utils');
var paramElem = require(__base + 'element/parameter');
var responseElem = require(__base + 'element/response');

var method = function () {
  this.method = "";
  this.summary = "";
  this.description = "";
  this.tags = [];
  this.parameters = [];
  this.responses = [];
  this.errors = [];
};

method.prototype.parseJSON = function (obj) {
  this.method = obj.method;
  this.summary = utils.getHtmlText(utils.markdownToHtml(obj.summary));
  this.description = utils.getHtmlText(utils.markdownToHtml(obj.description));

  if (obj.tags) {
    obj.tags.forEach(function (elem, i, a) {
      this.tags.push(elem);
    }, this)
  }

  if (obj.parameters) {
    obj.parameters.forEach(function (elem, i, a) {
      var param = new paramElem();
      param.parseJSON(elem);
      this.parameters.push(param);
    }, this)
  }

  if (obj.responses) {
    obj.responses.forEach(function (elem, i, a) {
      var response = new responseElem();
      response.parseJSON(elem);
      this.responses.push(response);
    }, this)
  }

  if (obj.errors) {
    obj.errors.forEach(function (elem, i, a) {
      this.errors.push(elem);
    }, this)
  }
};

method.prototype.print = function (indent) {
  console.log(utils.indentText('- ' + this.method.toUpperCase() + ': ' + this.summary, indent));

  console.log(utils.indentText('Tags:', indent + 2));
  this.tags.forEach(function (elem, i, a) {
    console.log(utils.indentText(elem, indent + 4));
  });

  console.log(utils.indentText('Parameters:', indent + 2));
  this.parameters.forEach(function (elem, i, a) {
    elem.print(indent + 4);
  });

  console.log(utils.indentText('Responses:', indent + 2));
  this.responses.forEach(function (elem, i, a) {
    elem.print(indent + 4);
  });

  console.log(utils.indentText('Errors:', indent + 2));
  this.errors.forEach(function (elem, i, a) {
    console.log(utils.indentText(elem, indent + 4));
  })
};

method.prototype.render = function (doc, url) {
  return jade.renderFile(__base + 'template/method.jade', {
    me : this,
    doc: doc,
    url: url
  });
};

method.prototype.renderMenu = function (url) {
  return jade.renderFile(__base + 'template/method-menu.jade', {
    me : this,
    url: url
  });
};

module.exports = method;