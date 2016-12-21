Game.TileRepository = new Game.Repository('tiles', Game.Tile);

Game.TileRepository.define('null', {
    name: 'null',
    description: '(unknown)'
});
Game.TileRepository.define('floor', {
    name: 'floor',
    character: '.',
    walkable: true,
    blocksLight: false,
    description: 'The floor'
});
Game.TileRepository.define('wall', {
    name: 'wall',
	character: '#',
	foreground: 'white',
	blocksLight: true,
    outerWall: true,
    description: 'The wall'
});
Game.TileRepository.define('stairsUp', {
    name: 'stairsUp',
    character: '<',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    description: 'A staircase leading upwards'
});
Game.TileRepository.define('stairsDown', {
    name: 'stairsDown',
    character: '>',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    description: 'A staircase leading downwards'
});