var mapnik = require('mapnik');
var fs = require('fs');

// register fonts and datasource plugins
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

var inxml = process.argv[2];
var outpng = process.argv[3];

if (!inxml || !outpng) return process.exit(1);

var map = new mapnik.Map(20, 20);
map.load(inxml, function(err,map) {
    if (err) throw err;
    map.zoomAll();
    var im = new mapnik.Image(20, 20);
    map.render(im, function(err,im) {
      if (err) throw err;
      im.encode('png', function(err,buffer) {
          if (err) throw err;
          fs.writeFile(outpng,buffer, function(err) {
              if (err) throw err;
              process.exit(0);
          });
      });
    });
});