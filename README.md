# HobgoblinJS

A JavaScript framework that implements ROT.js for building Roguelike games in the browser. The architecture is heavily inspired from the ways that [Ondras](http://ondras.zarovi.cz/) (creater of ROT.js) organizes many of his games, and the tutorial series by [Dominic Charley-Roy](http://www.codingcookies.com/2013/04/01/building-a-roguelike-in-javascript-part-1/), [Steve Losh](http://stevelosh.com/blog/2012/07/caves-of-clojure-01/), and [Trystan](http://trystans.blogspot.com/2016/01/roguelike-tutorial-00-table-of-contents.html), who have written the same tutorial in JavaScript, Clojure, and Java, respectively.

## Installation

Run `npm install --save-dev hobgoblin`

## Usage

`hobgoblin init` from the root of your directory will initialize the framework, and you should end up with the following directory structure:

[insert diagram]

Open up index.html in your browser, and you should see an `@` symbol in an empty `Arena` map.

`hobgoblin examples <items|entities|tiles>` will pull down two example JS files for the appropriate object: a `*.examples.js` file and a `*-mixins.examples.js` where * is the argument passed to `hobgoblin examples`. These example files are full of common roguelike fantasy tropes that you can pull directly in to your project, or use as a baseline for your own game.

## Hobgoblin Framework

[TODO] write some notes on how the framework is built and suggestions on how to organize a game

## TODOs

* Include game.js
* dir structure
* index.html with js file refs included
* add css file (?)
* Add option to install ROT.js via Bower
* Update example directory to include latest examples
* Publish to npm
* Update to use require, cleanup index.html