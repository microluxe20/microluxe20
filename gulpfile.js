const gulp = require('gulp');
const markdownpdf = require('gulp-markdown-pdf');
const zip = require('gulp-zip');
const changed = require('gulp-changed');
const changedInPlace = require('gulp-changed-in-place');
const fs = require('fs');
const pjson = require('./package.json');
const yaml = require('js-yaml');
const through = require('through2');

const config = {
  dataPath: 'src/data/**/*.{yml,yaml}',
  mdPath: 'src/markdown/*.md',
  cssPath: 'src/styles/main.css',
  out: 'documents',
  paperFormat: 'Letter',

  compiledOut: [
    ['handbook', 'equipment', 'spells'],
    ['gm_guide'],
    ['lore'],
    ['races'],
  ],

  readme: 'README.md',
  headerText: 'Microluxe 20 <br> <br>',
  imgUrl: 'https://github.com/kgrubb/microluxe20/raw/master/src/static/logo-plain.png',
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
  let doc;
  for (const d of file) if (d.id === matches[1]) doc = d;
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
    for (const d of dataTransform) {
      if ((name === d.key) || (d.allowExtra && name.startsWith(d.key))) {
        return d.replace(extraData, name) || '';
      }
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
  for (const h of doc.header) header += `| ${`${h} | `.repeat(columns - 1)}${h} |\n`;

  const size = Math.floor(doc.data.length / columns);
  const extra = doc.data.length % columns;

  // Stack table entries side-by-side.
  for (let i = 0; extra ? i <= size : i < size; i++) {
    let d = '| ';
    for (let c = 0; c < columns && (i < size || c < extra); c++) {
      const offset = c ? (c < extra ? c : extra) : 0;
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
  /* eslint no-restricted-syntax: "off", no-plusplus: "off" */
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
// eslint-disable-next-line arrow-body-style
gulp.task('load-data', () => {
  return gulp.src(config.dataPath)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(through.obj((file, enc, cb) => {
      const data = yaml.safeLoadAll(file.contents);
      dataFiles[file.relative] = data;
      cb();
    }));
});

// Compile each markdown file into pdf.
// eslint-disable-next-line arrow-body-style
gulp.task('compile-md', () => {
  return gulp.src(config.mdPath)
    .pipe(changed(config.out, {
      extension: '.pdf',
    }))
    .pipe(markdownpdf(mdPdfOpts))
    .pipe(gulp.dest(config.out));
});

// compile all the documents
gulp.task('compile', gulp.series('load-data', 'compile-md'));

// Make a gulp.parallel object containing tasks to create release documents.
function makeReleaseTasks() {
  const tasks = [];
  for (const d of config.compiledOut) {
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
  }
  return gulp.parallel(tasks);
}

// eslint-disable-next-line arrow-body-style
gulp.task('clean', () => {
  return gulp.src('documents/*')
    .pipe(through.obj((file, err, cb) => {
      fs.unlinkSync(file.path);
      cb(null);
    }));
});

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
