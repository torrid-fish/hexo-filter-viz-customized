var reg = /(\s*)(```) *(graphviz) *\n?([\s\S]+?)\s*(\2)(\n+|$)/g;

function ignore(data) {
  var source = data.source;
  var ext = source.substring(source.lastIndexOf('.')).toLowerCase();
  return ['.js', '.css', '.html', '.htm'].indexOf(ext) > -1;
}

function getId(index) {
  return 'graphviz-' + index;
}

exports.render = function(data) {
  if (!ignore(data)) {

    var graphviz = [];

    data.content = data.content
      .replace(reg, function(raw, start, startQuote, lang, content, endQuote, end) {
        var graphvizId = getId(graphviz.length);
        graphviz.push(content);
        return start + '<div id="' + graphvizId + '" style="text-align:center;"></div>' + end;
      });

    if (graphviz.length) {
      var config = this.config.graphviz;
      // resources
      data.content += '<script src="' + config.vizjs + '"></script>';
      data.content += '<script src="' + config.render + '"></script>';
      data.content += graphviz.map(function(code, index) {
        var graphvizId = getId(index);
        var codeId = graphvizId + '-code';
        return '' +
          '{% raw %}' +
          '<textarea id="' + codeId + '" style="display: none">' + code + '</textarea>' +
          '<script>' +
          '  var viz = new Viz();' +
          '  var code = document.getElementById("' + codeId + '").value;' +
          '  viz.renderSVGElement(code)' +
          '  .then(function(element) {' +
          '    element.setAttribute("width", "100%"); ' +
          '    polygons = element.getElementsByTagName("polygon");' +
          '    for (var i = 0; i < polygons.length; i += 1) {' +
          '        if (polygons[i].parentElement.className.baseVal == "graph") {' +
          '            polygons[i].setAttribute("stroke", "transparent");' +
          '        } else if (polygons[i].getAttribute("stroke") == "#000000") {' +
          '            polygons[i].setAttribute("stroke", "var(--text-color)");' +
          '        }' +
          '        if (polygons[i].parentElement.className.baseVal == "graph") {' +
          '            polygons[i].setAttribute("fill", "transparent");' +
          '        } else if (polygons[i].getAttribute("fill") == "#000000" && polygons[i].parentElement.className.baseVal == "edge") {' +
          '            polygons[i].setAttribute("fill", "var(--text-color)");' +
          '        }' +
          '    }' +
          '    paths = element.getElementsByTagName("path");' +
          '    for (var i = 0; i < paths.length; i += 1) {' +
          '        if (paths[i].getAttribute("fill") == "none" && paths[i].parentElement.className.baseVal == "edge") { ' +
          '            paths[i].setAttribute("fill", "var(--text-color)");' +
          '        }' +
          '        if (paths[i].getAttribute("stroke") == "#000000" && paths[i].parentElement.className.baseVal == "edge") { ' +
          '            paths[i].setAttribute("stroke", "var(--text-color)");' +
          '        }' +
          '    }' +
          '    ellipses = element.getElementsByTagName("ellipse");' +
          '    for (var i = 0; i < ellipses.length; i += 1) {' +
          '        if (ellipses[i].getAttribute("stroke") == "#000000") { ' +
          '            ellipses[i].setAttribute("stroke", "var(--text-color)");' +
          '        }' +
          '    }' +
          '    texts = element.getElementsByTagName("text");' +
          '    for (var i = 0; i < texts.length; i += 1) {' +
          '        if (texts[i].getAttribute("fill") == "#000000") { ' +
          '            texts[i].setAttribute("fill", "var(--text-color)");' +
          '        }' +
          '        texts[i].setAttribute("stroke", "none");' +
          '    }' +
          '    document.getElementById("' + graphvizId + '").append(element);' +
          '  });' +
          '</script>' +
          '{% endraw %}';
      }).join('');
    }
  }
};
