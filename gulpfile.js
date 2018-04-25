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
  includeHeaders: true,
};

let dataFiles = {};

// Parse the directive: !data <file> [key]
function replaceData(directive) {
  const matches = directive.match(/(\S+)\s*(\S+)/);
  if (matches === null) return '';

  const fname = matches[1];
  const key = matches[2];
  // Load the appropriate YAML file.
  if (!(fname in dataFiles)) {
    const p = path.join(config.dataPath, fname);
    const d = fs.readFileSync(p);
    dataFiles[fname] = yaml.safeLoadAll(d);
  }

  const file = dataFiles[fname];

  // Get the table YAML document matching the key, or the first if no key.
  let doc;
  for (const d of file) if (d.id === key) doc = d;
  if (doc === undefined) return '';

  // Convert it into markdown, optionally combining multiple columns.
  let header = '';
  let body = '';

  const columns = doc.columns || 1;
  for (const h of doc.header) header += `| ${`${h} | `.repeat(columns - 1)}${h}\n`;

  const size = doc.data.length / columns;
  const extra = Math.round((size - Math.floor(size)) * columns);

  // Stack table entries side-by-side.
  for (let i = 0; i < Math.ceil(size); i++) {
    let d = '| ';
    for (let c = 0; c < columns; c++) {
      const offset = extra > 0 ? c : 0;
      const idx = i + offset + (c * Math.floor(size));
      if (idx >= doc.data.length) break;
      d += (c > 0 ? ' | ' : '') + doc.data[idx];
    }
    body += `${d}\n`;
  }

  return header + body;
}

function replaceHeader(extraData, keep) {
  const imgUrl = 'https://github.com/kgrubb/microluxe20/raw/master/src/static/logo-plain.png';
  return keep ? `![title-img](${imgUrl})\n<h1 class="title">${extraData}</h1>` : '';
}

// Transform markdown document by parsing and including data tables.
function preProcessMd(data, e, cb) {
  // Scan for HTML comments with a directive, e.g. <!-- $data -->.
  const regex = /<!--\s*\$(\S+)\s*(.+?)-->/g;

  function replace(match, name, extraData) {
    if (name === 'data') return replaceData(extraData);
    if (name === 'header') return replaceHeader(extraData, config.includeHeaders);
    if (name === 'header-main') return replaceHeader(extraData, true);
    return '';
  }

  const newData = data.toString().replace(regex, replace);
  // Insert into page, replacing the comment.
  cb(null, Buffer.from(newData));
}

// compile all the documents
gulp.task('compile', () => {
  const cwd = process.cwd();
  // clear the file buffer between compiles.
  dataFiles = {};
  return gulp.src(config.mdPath)
    .pipe(changed(config.out, {
      extension: '.pdf',
    }))
    .pipe(markdownpdf({
      cwd,
      cssPath: config.cssPath,
      preProcessMd: () => through.obj(preProcessMd),
    }))
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
