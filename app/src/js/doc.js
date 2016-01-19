loadVersions();

function loadVersions() {

  $.get("../version.json", function (data) {

    var versionList = $("#version_list");
    var versionDesc = $("#versions_description");

    data.forEach(function (entry, i, a) {

      //Menu
      var text = "";
      var link = null;

      if (entry.version == version) {
        text = "<b>v" + entry.version + "</b>";
      }
      else {
        text = "v" + entry.version;
        link = "../v" + entry.version + '/';
      }

      if (i == data.length - 1) {
        text = "<span class='glyphicon glyphicon-asterisk'></span> " + text;
      }

      var elem = "<li>";
      if (link != null) {
        elem += "<a href=\"" + link + "\">";
      }
      elem += text;
      if (link != null) {
        elem += "</a>";
      }
      elem += "</li>";


      //Version part
      var html =
        "<div class=\"sub_part\">" +
        "<h2>V " + entry.version + "<h2>" +
        "<pre>" +
        "<code>" + entry.message + "</code>" +
        "</pre>" +
        "</div>";

      versionList.append(elem);
      versionDesc.prepend(html);
    });

  });
}