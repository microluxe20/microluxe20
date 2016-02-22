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
gulp.task('compile-markdown', function () {
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
  var cwd = process.cwd();
  gulp.src('character-sheets/microluxe20-cs.pdf')
  .pipe(gulp.dest(config.out));
  gulp.src('map/*.png')
  .pipe(gulp.dest(config.out));
  gulp.src('LICENSE')
  .pipe(gulp.dest(config.out));
  var release = ['microluxe20_',pjson.version,'.zip'].join('');
  return gulp.src('documents/*')
  .pipe(zip(release))
  .pipe(gulp.dest('./release'));
});

gulp.task('watch-markdown', function () {
  gulp.watch([config.mdPath, config.cssPath], ['compile-markdown']);
});

gulp.task('default', function () {
  console.log(fs.readFileSync(config.readme, { encoding: 'UTF8' }));
});
