<p align="center">
  <img src="src/static/logo.png" alt="Microluxe 20">
</p>
Microluxe20 attempts to be a stand-in replacement for any [SRD](https://en.wikipedia.org/wiki/System_Reference_Document) based tabletop adventure. The main goal is to utilize the simplicity of [Microlite20](http://microlite20.net/), while also adding various races, classes, and game-balancing tweaks. It also strives to clarify some of the more confusing parts of the Microlite20 system.

# Handbook
To dive right into the game, check out the online handbook [here](src/markdown/microluxe20_handbook.md)!

Microluxe20 comes with a pre-designed campaign setting, named "Terador". The lore/mythos can be found [here](src/markdown/microluxe20_lore.md). A complete map can be found [here](map/Terador-complete.png). If you are interested in reading about the available races of Terador, check out [this](src/markdown/microluxe20_races.md).  Otherwise, feel free to use your own setting and races!

# Downloads
The latest release can be downloaded [here](https://github.com/kgrubb/microluxe20/releases/latest)!

# Contributing

**NOTICE:** The font setup is still a little bit weird, so when compiling/bulding the pdf's, the length of the document may vary slightly between various OS's.

If you want to contribute to the game's handbooks, or want to craft your own release, please do the following:

#### 1. Ensure you have Node and NPM installed

Node and NPM are used to build the PDF documents. You can find a link to node [here](https://nodejs.org/en/).

#### 2. Fork the repository and clone locally

Contributions follow github's pull request model. You can find more information on best practices [here](https://help.github.com/articles/using-pull-requests/).

#### 3. npm install

First, run:

```sh
npm install -g gulp
```

This will globally install gulp, which is used for building the PDFs.
Next, run the following:

```sh
npm install
```

This will create a folder called node_modules, which will contain the dependencies used to build the PDFs.

#### 4. Making changes and building PDFs

Make changes to the __markdown__ files (found in the `src/markdown` directory). Once you have finished your changes, run the following command:

```sh
gulp compile
```

This will create a new folder named `documents` that contains the finished PDFs.

You can also use the following command to automatically build PDFs whenever changes are saved to a markdown file:

```sh
gulp watch
```

For personal releases, after running the `compile` task, you can craft a zipped folder with all of the latest released PDFs and documents by running the following command:

```sh
gulp release
```

This will create the completed release in a new folder named `release`. The version number is determined by the version set in the `package.json` file.

##### 5. Submit a pull request

Commit your changes and submit a new pull request to the microluxe20 develop branch.

## Authors & Contributors
* Keli Grubb (<keligrubb324@gmail.com>)
* Doug Rich
* Connor Bashinski

## Licensing
Licensed under the [Open Game License](LICENSE).
