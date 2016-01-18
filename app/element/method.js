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
  this.summary = obj.summary;
  this.description = obj.description;

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

method.prototype.getHtml = function (doc, html, url, index) {

  html +=
    "<p>" +
      "<h" + index + ">" + this.method.toUpperCase() + " " + url;
  this.tags.forEach(function (elem, i, a) {
    var t = doc.getTagUrl(elem);
    if (t == null) {
      console.error('Unresolved tag : ' + elem);
    }
    else {
      html +=
        "<span>" +
          "<a href=\"" + t.value + "\">[" + elem + "]</a>" +
        "</span>";
    }
  });

  html += "</h" + index + ">";

  html += "<b>" + this.summary + "</b>";
  html += "<h5>Description</h5>";
  html += this.description;

  html += "<h5>Parameters</h5>";
  html +=
    "<table>" +
      "<thead>" +
        "<tr>" +
          "<th>Name</th>" +
          "<th>Description</th>" +
          "<th>Required</th>" +
          "<th>In</th>" +
          "<th>Schema</th>" +
        "</tr>" +
      "</thead>" +
      "<tbody>";
  this.parameters.forEach(function (elem, i, a) {
    html = elem.getHtml(doc, html);
  });
  html +=
      "</tbody>" +
    "</table>";


  html += "<h5>Responses</h5>";
  html +=
    "<table>" +
      "<thead>" +
        "<tr>" +
          "<th>Http Status Code</th>" +
          "<th>Description</th>" +
          "<th>Schema</th>" +
        "</tr>" +
      "</thead>" +
      "<tbody>";
  this.responses.forEach(function (elem, i, a) {
    html = elem.getHtml(doc, html);
  });
  html +=
      "</tbody>" +
    "</table>";


  html += "<h5>Error</h5>";
  html +=
    "<table>" +
      "<thead>" +
        "<tr>" +
          "<th>HTTP status</th>" +
          "<th>ErrorCode</th>" +
          "<th>ErrorSubCode</th>" +
          "<th>Message</th>" +
          "<th>Comment</th>" +
        "</tr>" +
      "</thead>" +
      "<tbody>";
  this.errors.forEach(function (elem, i, a) {
    var err = doc.getError(elem);
    html = err.getHtml(doc, html);
  });
  html +=
      "</tbody>" +
    "</table>";

  html += "</p>";
  return html;
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