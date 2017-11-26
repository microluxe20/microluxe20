const gulp = require('gulp');
const markdownpdf = require('gulp-markdown-pdf');
const zip = require('gulp-zip');
const changed = require('gulp-changed');
const fs = require('fs');
const pjson = require('./package.json');

const config = {
  mdPath: 'src/markdown/*.md',
  cssPath: 'src/styles/main.css',
  out: 'documents',
  readme: 'README.md',
};

// compile all the documents
gulp.task('compile', () => {
  const cwd = process.cwd();
  return gulp.src(config.mdPath)
    .pipe(changed(config.out, { extension: '.pdf' }))
    .pipe(markdownpdf({
      cwd,
      cssPath: config.cssPath,
    }))
    .pipe(gulp.dest(config.out));
});

// create release zip from documents
gulp.task('release', () => {
  fs.stat('documents', (err) => {
    if (err) {
      return console.log(err);
    }
    const release = `microluxe20_${pjson.version}.zip`;
    return gulp.src(['documents/*', 'character-sheets/*', 'map/*.png', 'LICENSE'])
      .pipe(zip(release))
      .pipe(gulp.dest('./release'));
  });
});

gulp.task('watch', () => {
  gulp.watch([config.mdPath, config.cssPath], ['compile']);
});

gulp.task('default', () => {
  console.log(fs.readFileSync(config.readme, {
    encoding: 'UTF8',
  }));
});
