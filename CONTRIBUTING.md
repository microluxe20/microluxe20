Contributing Guidelines
===

**NOTICE:** _With the 7.0.0 release of markdown-pdf, compiling on Windows is
currently broken (OSX/linux builds are working). While the document compiles,
custom css isn't loading properly. The open issue can be found
[here](https://github.com/alanshaw/markdown-pdf/issues/82)._

## 1\. Install Nodejs and npm on your system

Node and NPM are used to build the PDF documents. You can find a link to node
[here](https://nodejs.org/en/).

## 2\. Fork the repository and clone locally

Contributions follow github's [pull request
model](https://help.github.com/articles/using-pull-requests/).

## 3\. npm install

Run the following:

```sh
npm install
```

This will create a folder called `node_modules`, which will contain the
dependencies needed to build the PDFs.

## 4\. Making changes and building PDFs

All of the rules are written in the **markdown** files (found in the
"src/markdown" directory). After making changes to these files, you can use the
following tasks to make new PDFs:

`npm run compile` - This will create a new folder named "documents" and will
compile new PDFs.

`npm run watch` - This will automatically build PDFs whenever changes are saved
to a markdown file located in the "src/markdown" directory.

`npm run release` - After running the `npm run compile` task, this task will
craft a zipped folder with all of the latest released PDFs and documents. The
completed release zip can be found in the "release" directory. The version
number is determined by the version set in the `package.json` file.

## 5\. Submit a pull request

Commit your changes and submit a new pull request to the microluxe20 `develop`
branch.
