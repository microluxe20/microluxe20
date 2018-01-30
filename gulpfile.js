const gulp = require('gulp');
const markdownpdf = require('gulp-markdown-pdf');
const zip = require('gulp-zip');
const changed = require('gulp-changed');
const fs = require('fs');
const path = require('path');
const pjson = require('./package.json');
const yaml = require('js-yaml');
const through = require('through2');

const config = {
  dataPath: 'src/data/',
  mdPath: 'src/markdown/*.md',
  cssPath: 'src/styles/main.css',
  out: 'documents',
  readme: 'README.md',
};

var dataFiles = {};

// Transform markdown document by parsing and including data tables.
var processData = through.obj(function transform(data, e, cb) {
  // Scan for HTML comments starting with '!data'.
  var regex = /<!\-\-\s*\$data\s*(\S+)\s*(\S*)\s*\-\->/g;

  // Parse the directive: !data <file> [key]
  var replace = function (match, file, key) {
    // Load the appropriate YAML file.
    if (!(file in files)){
      var p = path.join(config.dataPath, file);
      var d = fs.readFileSync(p);
      dataFiles[file] = yaml.safeLoadAll(d);
    }

    file = dataFiles[file];

    // Get the table YAML document matching the key, or the first if no key.
    var doc;
    for (var d of file) if (d.id === key) doc = d;
    if (doc === undefined) return match;

    // Convert it into markdown, optionally combining multiple columns.
    var header = "", body = "", columns = doc.columns || 1;
	for (var h of doc.header) header += "| " + (h + " | ").repeat(columns-1) + h + "\n";

	var size = doc.data.length / columns;
	var extra = Math.round((size - Math.floor(size)) * columns);

	for (var i = 0; i < Math.ceil(size); i++) {
	  var d = "| ";
	  for (var c = 0; c < columns; c++) {
	    var offset = extra > 0 ? c : 0;
	    var idx = i + offset + c * Math.floor(size);
	    if (idx >= doc.data.length) break;
	    d += (c > 0 ? " | " : "") + doc.data[idx];
	  }
	  body += d + "\n";
	}

	return header + body;
  };

  data = data.toString().replace(regex, replace);
  // Insert into page, replacing the comment.
  cb(null, Buffer.from(data));
});


// compile all the documents
gulp.task('compile', () => {
  const cwd = process.cwd();
  dataFiles = {};
  return gulp.src(config.mdPath)
    .pipe(changed(config.out, {
      extension: '.pdf',
    }))
    .pipe(markdownpdf({
      cwd,
      cssPath: config.cssPath,
      preProcessMd: function() { return processData; }
    }))
	// clear the file buffer between compiles.
    .pipe(gulp.dest(config.out));
});

// create release zip from documents
gulp.task('release', done => fs.stat('documents', (err) => {
  if (err) {
    return console.log(err);
  }
  const release = `microluxe20_${pjson.version}.zip`;
  return gulp.src(['documents/*', 'character-sheets/*', 'map/*.png', 'LICENSE'])
    .pipe(zip(release))
    .pipe(gulp.dest('./release'), done());
}));

gulp.task('watch', () => {
  gulp.watch([config.mdPath, config.cssPath], ['compile']);
});

gulp.task('default', () => {
  console.log(fs.readFileSync(config.readme, {
    encoding: 'UTF8',
  }));
});
