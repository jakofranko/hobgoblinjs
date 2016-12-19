// From http://www.codingcookies.com/2013/04/05/building-a-roguelike-in-javascript-part-3a/
// Base prototype for representing 'tiles', which are environment characters that contain glyphs, and other information such as whether or not the tile is walkable or not.
Game.Tile = function(properties) {
	properties = properties || {};
    // Call the Glyph constructor with our properties
    Game.Glyph.call(this, properties);
    // Set up the properties. We use false by default.
    this._name = properties['name'] || false;
    this._walkable = properties['walkable'] || false;
    this._diggable = properties['diggable'] || false;
    this._blocksLight = properties['blocksLight'] || false;
    this._outerWall = properties['outerWall'] || false;
    this._innerWall = properties['innerWall'] || false;
    this._description = properties['description'] || '';
};
// Make tiles inherit all the functionality from glyphs
Game.Tile.extend(Game.Glyph);

// Standard getters
Game.Tile.prototype.isWalkable = function() {
    return this._walkable;
};
Game.Tile.prototype.isDiggable = function() {
    return this._diggable;
};
Game.Tile.prototype.isBlockingLight = function() {
    return this._blocksLight;
};
Game.Tile.prototype.isOuterWall = function() {
    return this._outerWall;
};
Game.Tile.prototype.setOuterWall = function(outerWall) {
    this._outerWall = outerWall;
};
Game.Tile.prototype.isInnerWall = function() {
    return this._innerWall;
};
Game.Tile.prototype.setInnerWall = function(innerWall) {
    this._innerWall = innerWall;
};
Game.Tile.prototype.getDescription = function() {
    return this._description;
};
Game.Tile.prototype.describe = function() {
    return this._name;
};
Game.getNeighborPositions = function(x, y) {
    var tiles = [];
    // Generate all possible offsets
    for (var dX = -1; dX < 2; dX ++) {
        for (var dY = -1; dY < 2; dY++) {
            // Make sure it isn't the same tile
            if (dX == 0 && dY == 0) {
                continue;
            }
            tiles.push({x: x + dX, y: y + dY});
        }
    }
    return tiles.randomize();
}