var gulp = require('gulp'),
    markdownpdf = require('gulp-markdown-pdf'),
    zip = require('gulp-zip'),
    changed = require('gulp-changed'),
    fs = require('fs'),
    pjson = require('./package.json');

var config = {
    mdPath: 'src/markdown/*.md',
    cssPath: 'src/styles/main.css',
    out: 'documents',
    readme: 'README.md',
};

// compile all the documents
gulp.task('compile', function() {
    var cwd = process.cwd();
    return gulp.src(config.mdPath)
        .pipe(changed(config.out, {extension: '.pdf'}))
        .pipe(markdownpdf({
            cwd: cwd,
            cssPath: config.cssPath
        }))
        .pipe(gulp.dest(config.out));
});

// create release zip from documents
gulp.task('release', function() {
    fs.stat('documents', function(err, stat) {
        if (err) {
            return console.log(err);
        }
        var release = 'microluxe20_' + pjson.version + '.zip';
        return gulp.src(['documents/*', 'character-sheets/*', 'map/*.png', 'LICENSE'])
            .pipe(zip(release))
            .pipe(gulp.dest('./release'));
    });
});

gulp.task('watch', function() {
    gulp.watch([config.mdPath, config.cssPath], ['compile']);
});

gulp.task('default', function() {
    console.log(fs.readFileSync(config.readme, {
        encoding: 'UTF8'
    }));
});
