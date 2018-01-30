Contributing Guidelines for Microluxe20
===

:+1: :tada: First off, thanks for taking the time to contribute! :tada: :+1:

The following is a set of guidelines for contributing to Microluxe20. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[How Can I Contribute?](#how-can-i-contribute)
  * [Local Development](@local-development)
  * [Pull Requests](#pull-requests)

[Styleguides](#styleguides)
  * [Git Commit Messages](#git-commit-messages)
  * [JavaScript Styleguide](#javascript-styleguide)

## Code of Conduct

This project and everyone participating in it is governed by a [Contributor Covenant-based Code of Conduct](./docs/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the repository owner.

## How Can I Contribute?

### Local Development

#### Requirements
To start developing Microluxe20, you will need the following:

  * [Nodejs](https://nodejs.org/en/) >= `6.12.3` (The latest LTS is preferred.)
  * [git](https://git-scm.com/downloads)

#### Development
1. [Fork the repository and clone locally](https://help.github.com/articles/fork-a-repo/).

2. All of the rules are written in the **markdown** files (found in the `src/markdown` directory). After making changes to these files, you can use the following tasks to make new PDFs:

    `npm run compile` - This will create a new folder named "documents" and will compile new PDFs.

    `npm run watch` - This will automatically build PDFs whenever changes are saved to a markdown file located in the "src/markdown" directory.

    `npm run release` - After running the `npm run compile` task, this task will craft a zipped folder with all of the latest released PDFs and documents. The completed release zip can be found in the "release" directory. The version number is determined by the version set in the `package.json` file.

3. Commit your changes, push to your fork, and submit a pull request to the microluxe20 `master` branch.

### Pull Requests

* Fill out the provided pull request template.
* Reference related issues and merge requests liberally.
* Include screenshots and animated GIFs in your merge request whenever possible.
* Follow the [JavaScript Styleguide](#javascript-styleguide).
* End all files with a newline.
* [Avoid platform-dependent code](https://shapeshed.com/writing-cross-platform-node/).
* Place any requires in the following order:
    * Built in Node Modules (such as `path` or `fs`)
    * External Modules (such as `gulp`, `markdown-pdf`, or `tar`)
    * Local Modules (using relative paths)

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Consider starting the commit message with an applicable emoji _(totally not required)_:
    * :art: `:art:` when improving the format/structure of the code
    * :gem: `:gem:` when adding/creating a new feature
    * :rocket: `:rocket:` when improving performance
    * :wrench: `:wrench:` when fixing an issue
    * :thinking: `:thinking:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :fire: `:fire:` when removing code or files
    * :green_heart: `:green_heart:` when fixing the CI build
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings

### JavaScript Styleguide

All JavaScript must adhere to the [Airbnb Base Style](https://github.com/airbnb/javascript). This is achieved via the [airbnb base eslint plugin](https://www.npmjs.com/package/eslint-config-airbnb-base). It is advised to install an official eslint plugin for your preferred text editor or IDE. For example, [linter-eslint](https://atom.io/packages/linter-eslint) for [Atom](https://atom.io/) or the [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for [Visual Studio Code](https://code.visualstudio.com/).

* Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
* Use bottom declarations of `export` for expressions whenever possible

  ```js
  // Use this:
  class ClassName {

  }
  module.exports = ClassName;

  // Instead of:
  module.exports = class ClassName {

  };
  ```

  _return to [microluxe20 README](README.md)_
