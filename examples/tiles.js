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
    foreground: '#B3C67F',
    walkable: true,
    blocksLight: false,
    description: 'A patch of grass'
});
Game.TileRepository.define('brick wall', {
    name: 'brick wall',
	character: '#',
	foreground: '#ab2e34',
	blocksLight: true,
    outerWall: true,
    description: 'A brick wall'
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
Game.TileRepository.define('water', {
    name: 'water',
    character: '~',
    foreground: 'blue',
    walkable: false,
    blocksLight: false,
    description: 'Clear blue water'
});

// Road tiles
Game.TileRepository.define('asphault', {
    name: 'asphault',
    character: '.',
    foreground: '#302e36',
    walkable: true,
    blocksLight: false,
    description: 'Asphault road'
});
Game.TileRepository.define('two-way stripe', {
    name: 'two-way stripe',
    character: '.',
    foreground: '#d7d804',
    walkable: true,
    blocksLight: false,
    description: 'A two-way road stripe'
});

// Sidewalk
Game.TileRepository.define('sidewalk', {
    name: 'sidewalk',
    character: '.',
    foreground: '#ada5b2',
    walkable: true,
    blocksLight: false,
    description: 'A sidewalk'
});

// Building Materials
Game.TileRepository.define('window-vertical', {
    name: 'window-vertical',
    character: '|',
    foreground: '#aadfff',
    walkable: false,
    blocksLight: false,
    description: "A glass window"
});
Game.TileRepository.define('window-horizontal', {
    name: 'window-horizontal',
    character: '-',
    foreground: '#aadfff',
    walkable: false,
    blocksLight: false,
    description: "A glass window"
});
Game.TileRepository.define('indoor wall-vertical', {
    name: 'indoor wall-vertical',
    character: '|',
    foreground: '#ffffff',
    walkable: false,
    blocksLight: false,
    innerWall: true,
    description: "A wall"
});
Game.TileRepository.define('indoor wall-horizontal', {
    name: 'indoor wall-horizontal',
    character: '-',
    foreground: '#ffffff',
    walkable: false,
    blocksLight: false,
    innerWall: true,
    description: "A wall"
});
Game.TileRepository.define('door', {
    name: 'door',
    character: '+',
    foreground: '#8b888d',
    walkable: true,
    blocksLight: false,
    description: "A steel door"
});
Game.TileRepository.define('glass door', {
    name: 'glass door',
    character: '+',
    foreground: '#aadfff',
    walkable: true,
    blocksLight: false,
    description: "A glass door"
});