const gulp = require('gulp');
const markdownpdf = require('gulp-markdown-pdf');
const zip = require('gulp-zip');
const changed = require('gulp-changed');
const changedInPlace = require('gulp-changed-in-place');
const fs = require('fs');
const yaml = require('js-yaml');
const through = require('through2');
const remarkable = require('gulp-remarkable');
const pjson = require('./package.json');

const config = {
  dataPath: 'src/data/**/*.{yml,yaml}',
  mdPath: 'src/markdown/*.md',
  cssPath: 'src/styles/main.css',
  out: 'documents',
  htmlOut: 'html',
  paperFormat: 'Letter',

  compiledOut: [
    ['handbook', 'equipment', 'spells'],
    ['gm_guide'],
    ['lore'],
    ['races'],
  ],

  readme: 'README.md',
  headerText: 'Microluxe 20 <br> <br>',
  imgUrl: 'https://github.com/microluxe20/microluxe20/raw/master/src/static/logo-plain.png',
  includeHeaders: true,
};

const dataFiles = {};
const dataTransform = [];

/*
-------------------------------------------------------------------------------
*/

// Parse a directive <file> <key> into a YAML data object in file[id: key].
function getDataFile(directive) {
  const matches = directive.match(/(\S+)/g);
  if (matches === null) return null;

  const file = dataFiles[matches[0]];
  if (file === undefined) {
    console.log(`No such file ${matches[0]}.`);
    return null;
  }

  // Get the table YAML document matching the key, or the first if no key.
  const doc = file.find(d => d.id === matches[1]);
  if (doc === undefined) {
    console.log(`No such table ${matches[1]} in file ${matches[0]}.`);
    return null;
  }
  return [doc, matches];
}

// Transform markdown document by parsing and including data tables.
function preProcessMd(data) {
  // Scan for HTML comments with a directive, e.g. <!-- $data -->.
  const regex = /<!--\s*\$(\S+)\s*([\S\s]*?)\s*-->/g;

  function replace(match, name, extraData) {
    const dataTransformer = dataTransform
      .find(d => (name === d.key) || (d.allowExtra && name.startsWith(d.key)));
    if (data !== undefined) {
      return dataTransformer.replace(extraData, name) || '';
    }
    return '';
  }

  return data.replace(regex, replace);
}

function assembleTable(doc) {
  // Convert it into markdown, optionally combining multiple columns.
  let header = '';
  let body = '';

  const columns = doc.columns || 1;
  doc.header.forEach((h) => {
    header += `| ${`${h} | `.repeat(columns - 1)}${h} |\n`;
  });

  const size = Math.floor(doc.data.length / columns);
  const extra = doc.data.length % columns;

  // Stack table entries side-by-side.
  for (let i = 0; i < (extra ? size + 1 : size); i += 1) {
    let d = '| ';
    for (let c = 0; c < columns && (i < size || c < extra); c += 1) {
      const offset = c ? Math.min(c, extra) : 0;
      const idx = i + offset + (c * size);
      if (idx >= doc.data.length) break;
      d += (c ? ' | ' : '') + doc.data[idx];
    }
    body += `${d} |\n`;
  }

  return `\n${header}${body}\n`;
}

/*
TODO: move this to separate files (make more extensible).
-------------------------------------------------------------------------------
*/

dataTransform.push({
  key: 'data',
  // Parse the directive: $data <file> <key>
  replace: (directive) => {
    const file = getDataFile(directive);
    if (file === null) return '';
    const [doc, matches] = file;

    const out = assembleTable(doc);
    if (matches.length > 2) {
      return `<div class="${matches.slice(2).join(' ')}">\n${out}\n</div>`;
    }

    return out;
  },
});

function replaceHeader(extraData, keep) {
  return keep ? `![title-img](${config.imgUrl})\n<h1 class="title"> ${config.headerText} ${extraData} </h1>` : '';
}

dataTransform.push({
  key: 'header',
  allowExtra: 'true',
  replace: (data, name) => replaceHeader(data, name === 'header-main' ? true : config.includeHeaders),
});

dataTransform.push({
  key: 'page-break',
  replace: () => '<div class="page-break-after"></div>',
});

/*
-------------------------------------------------------------------------------
*/

const mdPdfOpts = {
  cwd: process.cwd(),
  cssPath: config.cssPath,
  paperFormat: config.paperFormat,
  preProcessMd: () => through.obj((data, e, cb) => {
    const newData = preProcessMd(data.toString());
    cb(null, Buffer.from(newData));
  }),
};

// Load data when it has changed.
gulp.task('load-data', () => gulp.src(config.dataPath)
  .pipe(changedInPlace({ firstPass: true }))
  .pipe(through.obj((file, enc, cb) => {
    const data = yaml.safeLoadAll(file.contents);
    dataFiles[file.relative] = data;
    cb();
  })));

// Compile each markdown file into pdf.
gulp.task('compile-md', () => gulp.src(config.mdPath)
  .pipe(changed(config.out, {
    extension: '.pdf',
  }))
  .pipe(markdownpdf(mdPdfOpts))
  .pipe(gulp.dest(config.out)));

// compile all the documents
gulp.task('compile', gulp.series('load-data', 'compile-md'));

const mdHtmlOpts = {
  html: true,
  breaks: true,
  typographer: false,
};

gulp.task('compile-md-html', () => gulp.src(config.mdPath)
  .pipe(changed(config.htmlOut), { extension: '.html' })
  // Preprocess the file's contents.
  .pipe(through.obj((file, enc, cb) => {
    // eslint-disable-next-line no-param-reassign
    file.contents = Buffer.from(preProcessMd(file.contents.toString()));
    cb(null, file);
  }))
  .pipe(remarkable({ remarkableOptions: mdHtmlOpts }))
  .pipe(gulp.dest(config.htmlOut)));

// Compile documents to HTML
gulp.task('compile-html', gulp.series('load-data', 'compile-md-html'));

// Make a gulp.parallel object containing tasks to create release documents.
function makeReleaseTasks() {
  const tasks = [];
  config.compiledOut.forEach((d) => {
    const func = () => {
      let data;
      let contents;
      const files = d.length > 1 ? `{${d.join(',')}}` : d[0];
      return gulp.src(config.mdPath.replace('*', `microluxe20_${files}`))
        .pipe(through.obj(
          (file, enc, cb) => {
            if (!data) {
              data = file;
              contents = file.contents.toString();
            } else contents += `\n\n${file.contents.toString()}`;
            cb(null);
          },
          (cb) => {
            data.contents = Buffer.from(contents);
            cb(null, data);
          },
        ))
        .pipe(markdownpdf(mdPdfOpts))
        .pipe(gulp.dest(config.out));
    };
    func.displayName = `compile-${d[0]}`;
    tasks.push(func);
  });
  return gulp.parallel(tasks);
}

gulp.task('clean', () => gulp.src('documents/*')
  .pipe(through.obj((file, err, cb) => {
    fs.unlinkSync(file.path);
    cb(null);
  })));

// compile documents into their assigned books.
gulp.task('compile-release', gulp.series((done) => {
  config.includeHeaders = false; done();
}, 'load-data', makeReleaseTasks()));


// create release zip from documents
gulp.task('make-release', done => fs.stat('documents', (err) => {
  if (err) {
    return console.log(err);
  }
  const release = `microluxe20_${pjson.version}.zip`;
  return gulp.src(['documents/*', 'character-sheets/*', 'map/*.png', 'LICENSE'])
    .pipe(zip(release))
    .pipe(gulp.dest('./release'), done());
}));

gulp.task('release', gulp.series('clean', 'compile-release', 'make-release'));

gulp.task('watch', () => {
  gulp.watch([config.mdPath, config.cssPath], gulp.task('compile'));
});

gulp.task('default', (cb) => {
  console.log(fs.readFileSync(config.readme, {
    encoding: 'UTF8',
  }));
  cb();
});
