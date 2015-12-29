<p align="center">
  <img src="src/static/logo.png" alt="Microluxe 20">
</p>
Microluxe20 attempts to be a stand-in replacement for any [SRD](https://en.wikipedia.org/wiki/System_Reference_Document) based tabletop adventure. The main goal is to utilize the simplicity of [Microlite20](http://microlite20.net/), while also adding various races, classes, and game-balancing tweaks. It also strives to clarify some of the more confusing parts of the Microlite20 system.

## Handbook
To dive right into the game, check out the online handbook [here](md/microluxe20_complete.md)!

Microluxe20 comes with a pre-designed campaign setting, named "Terador". The lore/mythos can be found [here](md/microluxe20_lore.md). If you are interested in reading about the available races of Terador, check out [this](md/microluxe20_races.md).  Otherwise, feel free to use your own setting and races!

## Downloads
You can download the entire project [here](https://github.com/kgrubb/microluxe20/releases/latest)! All of the necessary documents and supplements can be found in the `documents` directory.

## Contributing
If you want to contribute to the game's handbooks, please do the following:

#### 1. Ensure you have Node and NPM installed

Node and NPM are used to build the PDFs. You can find a link to node [here](https://nodejs.org/en/).

#### 2. Fork the repository and clone locally

Contributions follow github's pull request model. You can find more information on best practices [here](https://help.github.com/articles/using-pull-requests/)

#### 3. npm install

First, run:

```sh
npm install -g gulp
```

This will globally install gulp, which is used for building the PDFs. Then run:

```sh
npm install
```

This will create a folder called node_modules, which will contain the dependencies used to build the pdfs

#### 4. Making changes and building PDFs

Make changes to the __markdown files__ (found in the `md` directory). Once you have finished your changes, run the command

```sh
gulp compile-markdown
```

This will create a new folder named `documents` that contains the finished PDFs.

You can also use the command:

```sh
gulp watch-markdown
```

And whenever you make a change to a markdown file it will automatically build the PDFs.

#### 5. Submit a pull request

Commit your changes and submit a new pull request to the microluxe20 develop branch.

## Authors & Contributors
* Keli Grubb (<keligrubb324@gmail.com>)
