# HobgoblinJS

A JavaScript framework that implements ROT.js for building Roguelike games in the browser. The architecture is heavily inspired from the ways that [Ondras](http://ondras.zarovi.cz/) (creater of ROT.js) organizes many of his games, and the tutorial series by [Dominic Charley-Roy](http://www.codingcookies.com/2013/04/01/building-a-roguelike-in-javascript-part-1/), [Steve Losh](http://stevelosh.com/blog/2012/07/caves-of-clojure-01/), and [Trystan](http://trystans.blogspot.com/2016/01/roguelike-tutorial-00-table-of-contents.html), who have written the same tutorial in JavaScript, Clojure, and Java, respectively.

## Installation

Run `npm install --save-dev hobgoblin`

## Usage

`hobgoblin init` from the root of your project will initialize the framework, and you should end up with the following directory structure:

```
js/
index.html
```

`hobgoblin init --examples` will pull down example implementations of entities, tiles, screens, and items.

### Important!

Without examples, you will need to implement `Game.Screen.startScreen` or change this reference in `game.js` in order for to begin the framework. I would recommend using `hobgoblin init --examples` in order to see one way this can be done.

## Hobgoblin Framework

[TODO] write some notes on how the framework is built and suggestions on how to organize a game

## TODOs

* add css file (?)
* Add option to install ROT.js via Bower
* Update example directory to include latest examples
* Publish to npm
* Update to use require, cleanup index.html