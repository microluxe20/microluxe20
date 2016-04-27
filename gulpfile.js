var gulp = require('gulp'),
markdownpdf = require('gulp-markdown-pdf'),
rename = require('gulp-rename'),
through = require('through'),
cheerio = require('cheerio'),
zip = require('gulp-zip'),
fs = require('fs'),
// used to determine release version
pjson = require('./package.json');

var config = {
  mdPath: 'src/markdown/*.md',
  cssPath: 'src/styles/main.css',
  out: 'documents',
  readme: 'README.md',
};

// compile all the
gulp.task('compile', function () {
  var cwd = process.cwd();

  return gulp.src(config.mdPath)
  .pipe(markdownpdf({
    cwd: cwd,
    cssPath: config.cssPath,
    preProcessHtml: function () {
      return through(function (data) {

        /* This pre-processes the images and prefixes the source with the cwd
        * Solution taken from nickcmaynard here: https://github.com/alanshaw/markdown-pdf/issues/11
        * Taken 2015-12-29
        */
        var $ = cheerio.load(data);

        $('img[src]').each(function(i, elem) {
          var path = $(this).attr('src');
          path = cwd + path;
          $(this).attr('src', path);
        });
        this.queue($.html());
      });
    }
  }))
  .pipe(rename({
    dirname: ''
  }))
  .pipe(gulp.dest(config.out));
});

gulp.task('release', function () {
  fs.stat('documents', function(err, stat) {
    if(err == null) {
      var release = ['microluxe20_',pjson.version,'.zip'].join('');
      return gulp.src(['documents/*', 'character-sheets/microluxe20-cs.pdf', 'map/*.png', 'LICENSE'])
      .pipe(zip(release))
      .pipe(gulp.dest('./release'));
    } else if(err.code == 'ENOENT') {
      console.log('Could not find the `documents` directory. Please run `gulp compile` before building a release. ERROR:', err.code);
    } else {
      console.log(err.code);
    }
  });
});

gulp.task('watch', function () {
  gulp.watch([config.mdPath, config.cssPath], ['compile']);
});

gulp.task('default', function () {
  console.log(fs.readFileSync(config.readme, { encoding: 'UTF8' }));
});
