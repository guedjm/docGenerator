var markdown = require('markdown').markdown;


function indentText(txt, i) {

  var res = "";
  for (var j = 0; j < i; ++j) {
    res += " ";
  }
  res += txt;
  return res;
}

function getHtmlText(text) {

  var done = (text.match(/{{[a-zA-Z1-9 -_\/]*:[a-zA-Z1-9 -_\/]*}}/g) == null);

  while (!done) {
    var res = text.match(/{{[a-zA-Z1-9 -_\/]*:[a-zA-Z1-9 -_\/]*}}/g);
    var link = res[0].replace(/{{/g, '').replace(/}}/g, '');
    var pLink = link.split(':');
    var txt = pLink[0];
    var url = pLink[1];

    if (url.indexOf('http://') != 0) {
      url = '#' + url;
    }
    var rep = "<a href=\"" + url + "\">" + txt + "</a>";
    text = text.replace(res[0], rep);
    done = (text.match(/{{[a-zA-Z1-9 -_\/]*:[a-zA-Z1-9 -_\/]*}}/g) == null);
  }
  return (text);
}

function getUrl(tag) {

  var link = tag.replace(/{{/g, '').replace(/}}/g, '');
  var pLink = link.split(':');
  var url = pLink[1];

  return ("#" + url);
}

function markdownToHtml(md) {
  var res = markdown.toHTML(md);

  res = res.replace(/<code>/g, '<pre><code><br>').replace(/<\/code>/g, '<br><br></code></pre>').replace(/;;;/g, "<br/>");

  return res;
}

module.exports.indentText = indentText;
module.exports.getHtmlText= getHtmlText;
module.exports.getUrl= getUrl;
module.exports.markdownToHtml = markdownToHtml;