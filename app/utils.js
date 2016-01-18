
function indentText(txt, i) {

  var res = "";
  for (var j = 0; j < i; ++j) {
    res += " ";
  }
  res += txt;
  return res;
}

function getHtmlText(text) {

  var done = (text.match("{{[a-zA-Z_]*:[a-zA-Z_]*}}") == null);

  while (!done) {
    var res = text.match("{{[a-zA-Z_]*:[a-zA-Z_]*}}");
    var link = res[0].replace('{{', '').replace('}}', '');
    var pLink = link.split(':');
    var txt = pLink[0];
    var url = pLink[1];

    if (url.indexOf('http://') != 0) {
      url = '#' + url;
    }
    var rep = "<a href=\"" + url + "\">" + txt + "</a>";
    text = text.replace(res[0], rep);
    done = (text.match("{{[a-zA-Z]*:[a-zA-Z]*}}") == null);
  }
  return (text);
}

function getUrl(tag) {

  var link = tag.replace('{{', '').replace('}}', '');
  var pLink = link.split(':');
  var url = pLink[1];

  return ("#" + url);
}

module.exports.indentText = indentText;
module.exports.getHtmlText= getHtmlText;
module.exports.getUrl= getUrl;
