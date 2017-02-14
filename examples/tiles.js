Game.TileRepository = new Game.Repository('tiles', Game.Tile);

Game.TileRepository.define('null', {
    name: 'null',
    description: '(unknown)'
});
Game.TileRepository.define('air', {
    name: 'air',
    description: 'Empty space'
});
Game.TileRepository.define('floor', {
    name: 'floor',
    character: '.',
    walkable: true,
    blocksLight: false,
    description: 'The floor'
});
Game.TileRepository.define('grass', {
    name: 'grass',
    character: '"',
    foreground: Game.Palette.green,
    walkable: true,
    blocksLight: false,
    description: 'A patch of grass'
});
Game.TileRepository.define('wall', {
    name: 'wall',
	character: '#',
	foreground: Game.Palette.grey,
	blocksLight: true,
    outerWall: true,
    description: 'A wall'
});
Game.TileRepository.define('stairsUp', {
    name: 'stairsUp',
    character: '<',
    foreground: Game.Palette.pink,
    walkable: true,
    blocksLight: false,
    description: 'A staircase leading upwards'
});
Game.TileRepository.define('stairsDown', {
    name: 'stairsDown',
    character: '>',
    foreground: Game.Palette.pink,
    walkable: true,
    blocksLight: false,
    description: 'A staircase leading downwards'
});
Game.TileRepository.define('water', {
    name: 'water',
    character: '~',
    foreground: Game.Palette.blue,
    walkable: false,
    blocksLight: false,
    description: 'Clear blue water'
});
Game.TileRepository.define('door', {
    name: 'door',
    character: '+',
    foreground: Game.Palette.darkgrey,
    walkable: true,
    blocksLight: false,
    description: "A door"
});