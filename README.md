# HobgoblinJS

A JavaScript framework that implements ROT.js for building Roguelike games in the browser. The architecture is heavily inspired from the ways that [Ondras](http://ondras.zarovi.cz/) (creator of ROT.js) organizes many of his games, and the tutorial series by [Dominic Charley-Roy](http://www.codingcookies.com/2013/04/01/building-a-roguelike-in-javascript-part-1/), [Steve Losh](http://stevelosh.com/blog/2012/07/caves-of-clojure-01/), and [Trystan](http://trystans.blogspot.com/2016/01/roguelike-tutorial-00-table-of-contents.html), who have written the same tutorial in JavaScript, Clojure, and Java, respectively.

## Installation

`npm install -g hobgoblin` to have access to the tool globally

OR

`npm install --save-dev hobgoblin`

## Usage

`hobgoblin init` (or `node node_modules/hobgoblin/hobgoblin.js` if you installed locally) from the root of your project will initialize the framework, and you should end up with the following directory structure:

```
js/
	game.js
	utilities.js
	palette.js
	geometry.js
	repository.js
	glyph.js
	glyph-dynamic.js
	tile.js
	tiles.js
	entity.js
	entity-mixins.js
	item.js
	item-mixins.js
	map.js
	screen.js
	ai.js
	ai-tasks.js
index.html
```

`hobgoblin init --examples` will pull down example implementations of entities, tiles, screens, and items. In fact, initializing hobgoblin with examples will start you out with a fully playable (albeit boring) roguelike:

```
js/
	...
	example-screens.js
	example-tiles.js
	example-items.js
	example-entities.js
```

Hack away! You could start by simply adding items and monsters. I find that I like to start with `entity.js` to define what the basic actor in my game will look like and adjusting the `entity-mixins.js` accordingly.

Hobgoblin is supposed to be a starting point; it's not like a traditional framework that you would use more or less as-is. Since game mechanics go all the way down to the core, *these files are all meant to be edited as needed*. Some files will be touched less than others, but some files will need to be updated heavily for every game.

### Important!

Hobgoblin does not currently install ROT.js for you, but it is required for the framework to run. You can get it from [Ondras's repo directly](http://ondras.github.io/rot.js/hp/) or via Bower: `bower install --save rot.js`.

If using examples, you MUST comment out `example-tiles.js` in `index.html` or else it will overwrite the existing `Game.TileRepository` and break. Besides this however, when using examples, a fully explorable, multi-tiered dungeon will be available upon browsing to `index.html`.

Without examples, you will need to implement at least one screen and update `game.js` to reference this screen instead of `Game.Screen.startScreen`. This will include things like handling input, but you should be able to leverage the generic implementation of `map.js` to create levels very easily. I would highly recommend using `hobgoblin init --examples` in order to see one way this can be done.

## Hobgoblin Framework

The framework is organized as follows: `Game` is the namespace of the game. The naming convention I use is usually this:

1. `Game.Foo` is found in `foo.js`
2. The namespace for `foos.js` (plural of 'foo') will be either `Game.FooRepository` or `Game.Foos` (usually the former)
3. `Game.FooBar` is found in `foo-bar.js`

`Game` is meant to store global settings. It also contains the logic for initializing the game, and displaying the starting screen.

`Game.Screen` is where screens are defined. Screens are containers for most of the actual game play. For instance, in the examples, `Game.Screen.playScreen` is where the player is initialized, as well as the game map. Screens each contain logic for rendering and handling input.

`Game.Map` houses the current world. It is where monsters, items and tiles are generated.

Entities, items, and tiles are generated via repositories. Repositories are holders for templates, as well as generators for specific objects. For example, `Game.EntityRepository` holds the templates for entities. Calling `Game.EntityRepository.create('templateName')`, will return a new entity object using the designated constructor, in this case `Game.Entity`.

Entities and items are instances of `Game.DynamicGlyph`, and can use Mixins and Listeners.

`Game.AI` and `Game.AI.Tasks` are where the logic for, you guessed it, AI is found. More on this below.

`Game.Palette`, `Game.Geometry`, and `Game.Utility` are helper containers.

### `Game`

This namespace holds global settings, such as screen size, information on ROT.js displays, and game mechanic settings. For instance, I like to define things like 'numMonstersPerLevel' and things like that at this level, with the appropriate getter functions.

It also contains the logic for what to do on window load:

1. Initialize the game: This instantiates the ROT.js displays, and attaches event listeners to the window.
2. Switch the screen to the start screen

Lastly, `Game` contains the logic for rendering its current screen (`Game.refresh()`).

### `Game.Screen`

Screens are created via prototypes. `screen.js` contains these prototypes, and `example-screens.js` contains example implementations of these.

In the examples, as well as my own games, `Game.Screen.playScreen` is the most important screen, because it initializes the player, as well as the map, and handles the controls for actual game play. `Game.Screen.playScreen` also has sub-screen functionality, allowing things like menus to be setup and torn down easily by passing in the player information.

`Game.Screen.playScreen` does one other important thing after initializing the map: *it starts the map's engine.*

Screens should contain the logic for rendering themselves, as well as their own controls.

Whenever `Game.refresh()` is called, the ROT.js display is cleared, and then the `render` function is called for the current screen. Input is likewise routed to the Game's current screen.

### `Game.Map`

Whenever `new Game.Map(player)` is called, it

1. Generates the tiles (world)
2. Sets up FOV using these tiles via ROT.js
3. Creates a scheduler and engine via ROT.js
4. Generates and distributes items
5. Generates and distributes monsters.
6. Sets up an empty list of explored tiles (to create a fog of war effect)

The things I touch the most in this file are the tile generator, the entity generator, and the item generator. Often, I will abstract out the tile generation functionalities to another module, as this can get quite large and complicated very quickly for larger games.

The map is what handles the addition of and the removal of entities, since the functions used to do this also abstract out the process of adding and removing them to the scheduler.

Note: the engine is actually started by `Game.screen.playScreen.enter()`.

### `Game.Glyph` and `Game.DynamicGlyph` -- Tiles, Entities, and Items

`Game.Glyph` is the most basic unit in Hobgoblin. It consists of a name, a character, colors, and a little bit of logic for how to display it.

`Game.Tile` uses `Game.Glyph` as its constructor, and implements some basic logic about whether or not a tile can be seen through or walked upon.

`Game.DynamicGlyph` extends the basic glyph structure to include more helper functions for describing them on screen, and a couple of very useful features: Mixins, and Listeners.

Mixins can be thought of as optional modules. When a dynamic glyph template is defined, it can specify an array of mixins to include with it. When that template is instantiated via its repository's `create()` method, all of the mixin properties get added to the object, as well as any additional functionality. For instance, the `Game.EntityMixin.FoodConsumer` mixin for entities contains the modular functionality for how to handle hunger levels. If an entity has some kind of `Actor` mixin that comes with an `act()` method in addition to the FoodConsumer mixin, that `act()` method can check to see if the acting entity has the mixin (`this.hasMixin('FoodConsumer')`) and if it does, decrement its hunger level on its turn.

Listeners are properties of Mixins, and can be thought of as ways to unify functionality for events. These listeners are triggered by calling the `raiseEvent(event)` method on a DynamicGlyph. Example: two mixins, CorpseDropper and ItemDropper, have the listener 'onDeath':

```
listeners: {
	'onDeath': function() {
		...
	}
}
```

When I trigger `entity.raiseEvent('onDeath')` for an entity with both these mixins, that entity will drop an item and a corpse. The beauty of this system is that the mixins don't have to know about each other, and don't depend on each other.

`Game.Entity` and `Game.Item` are both dynamic glyphs.

Tiles, entities, and items are all defined as templates in their respective repositories.

### `Game.AI` and `Game.AI.Tasks`

Entities that have the `Game.EntityMixins.AIActor` mixin will take their turns according to the AI behaviors that are assigned to them. I haven't written a lot of content for these modules, but the bones work. Here's the structure:

`Game.AI.<behavior>` will be a function that takes an entity as an argument. Based on attributes of that entity, the behavior will try to intelligently perform tasks, which will be found in `Game.AI.Tasks.<task>`. These ill also be functions that take an entity as a plugin.

## How to Contribute

PRs are welcome! Feel free to report bugs and request features using the issues tab in the GitHub repository.

I would also love for you to add in your own code under the `examples/` folder. Heck, feel free to put your whole game in if you want. Just put it in it's own folder: `examples/<your examples>/`. If you make an improvement or have something that you think could benefit the core files (`src/`), I'd love to check it out. The goal is for these files to be as generic as possible, so if it's not quite generic enough I might ask that your code find its home in the `examples/` folder. Either way I would love contributions!

## TODOs

* Add option to install ROT.js via Bower
* Update example directory to include latest examples
* Update to use require, cleanup index.html
* Themed example sets, with the ability to override src files where appropriate: sci-fi, high-fantasy, traditional, 7drl, etc.
* Refactor controls
* Bring over templating system from Justice
* Bring over equipment system from Monster Hunter RL?
* Add in random item generation.
