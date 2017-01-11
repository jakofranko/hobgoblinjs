Game.extend = function(src, dest) {
    // Create a copy of the source.
    var result = {};
    for (var key in src) {
        result[key] = src[key];
    }
    // Copy over all keys from dest
    for (var key in dest) {
        result[key] = dest[key];
    }
    return result;
};

/**
 * There are two ways to instantiate this: one with functions for goals and skip in order to be able to recalculate the dijkstra map, or, with a static list of goals and skips for a static dijkstra map
 *
 * @param grid  two-dimensional array such that grid[x][y] = tile
 * @param goals a list of keys and values or a function to that will return true when passed an x,y key and the grid
 * @param skip  a list of keys and values or a function that will return boolean when passed an x,y key and the grid
 */
Game.DijkstraMap = function(grid, goals, skips) {
    this._dijkstraMap = {};
    this._goals = [];
    this._skips = [];
    this._fill = grid.length * grid[0].length;
    this._skipsFunction = null;
    this._goalsFunction = null;
    this._recalc = true; // denotes when the dijkstraMap needs to be recalculated
    this._reInit = false;
    this._updateGoals = false;
    this._updateSkips = false;

    if(typeof skips === 'function')
        this._skipsFunction = skips;
    else
        this._skips = skips;

    if(typeof goals === 'function')
        this._goalsFunction = goals;
    else
        this._goals = goals;

    // Initialize the dijkstra map with the fill
    this.initialize(grid);

    // Create the map
    this.update();
};
Game.DijkstraMap.prototype.update = function(grid) {
    if(this._reInit && grid)
        this.initialize(grid);
    if(this._updateSkips && grid)
        this.updateSkips(grid);
    if(this._updateGoals)
        this.updateGoals();
    if(this._recalc)
        this.calculate();
};
Game.DijkstraMap.prototype.initialize = function(grid) {
    for(var x = 0; x < grid.length; x++) {
        for(var y = 0; y < grid[x].length; y++) {
            var coord = x + "," + y;

            if(this._skipsFunction) {
                if(this._skipsFunction(coord, grid)) {
                    this._skips.push(coord);
                } else {
                    this._dijkstraMap[coord] = this._fill;
                }
            } else {
                // As long as the coordinate shouldn't be skipped, fill it
                if(this._skips.indexOf(coord) < 0)
                    this._dijkstraMap[coord] = this._fill;
            }

            if(this._goalsFunction) {
                if(this._goalsFunction(coord, grid)) {
                    this._goals.push(coord);
                    this._dijkstraMap[coord] = 0;    
                }
            } else {
                if(this._goals.indexOf(coord) > -1)
                    this._dijkstraMap[coord] = 0;
            }
        }
    }
    this._reInit = false;
};
Game.DijkstraMap.prototype.setRecalc = function(recalc) {
    this._recalc = !!recalc; // Cast to bool
};
Game.DijkstraMap.prototype.setGoals = function(goals) {
    if(typeof goals === 'function')
        this._goalsFunction = goals;
    else
        this._goals = goals;
    this._updateGoals = true;
    this._recalc = true;
};
Game.DijkstraMap.prototype.setSkips = function(skips) {
    if(typeof skips === 'function')
        this._skipsFunction = skips;
    else
        this._skips = skips;
    this._updateSkips = true;
};
Game.DijkstraMap.prototype.updateGoals = function() {
    for(var coord in this._dijkstraMap) {
        if(this._goalsFunction) {
            if(this._goalsFunction(coord, grid)) {
                this._goals.push(coord);
                this._dijkstraMap[coord] = 0;
            }
        } else {
            if(this._goals.indexOf(coord) > -1)
                this._dijkstraMap[coord] = 0;
        }
    }
    this._updateGoals = false;
};
Game.DijkstraMap.prototype.updateSkips = function(grid) {
    for(var x = 0; x < grid.length; x++) {
        for(var y = 0; y < grid[x].length; y++) {
            var coord = x + "," + y;

            if(this._skipsFunction) {
                if(this._skipsFunction(coord, grid)) {
                    this._skips.push(coord);
                } else {
                    this._dijkstraMap[coord] = this._fill;
                }
            } else {
                // As long as the coordinate shouldn't be skipped, fill it
                if(this._skips.indexOf(coord) < 0)
                    this._dijkstraMap[coord] = this._fill;
            }
        }
    }
    this._updateSkips = false;
    this._recalc = true;
};
Game.DijkstraMap.prototype.calculate = function() {
    // A list of tiles to check
    var dirtyTiles = [];
    for(var coord in this._dijkstraMap) {
        dirtyTiles.push(coord);
    }

    while(dirtyTiles.length) {
        var tile = dirtyTiles.shift(),
            tileValue = this._dijkstraMap[tile],
            neighbors = this._getNeighbors(tile), // Every tile should have at least 2 neighbors, no matter what
            lowestValue = null;
        
        // Get the lowest-value neighbor
        for(var i = 0; i < neighbors.length; i++) {
            var neighborValue = this._dijkstraMap[neighbors[i]];

            if(lowestValue === null)
                lowestValue = neighborValue;
            else
                lowestValue = Math.min(lowestValue, neighborValue);
        }

        // If the value of the current tile is at least 2 greater than the lowest-value
        // neighbor, the set it to be exactly 1 greater than the lowest value tile, and
        // mark all the neigbors as needing to be checked.
        if(tileValue - lowestValue >= 2) {
            this._dijkstraMap[tile] = lowestValue + 1;
            for (var j = 0; j < neighbors.length; j++) {
                if(dirtyTiles.indexOf(neighbors[j]) === -1)
                    dirtyTiles.push(neighbors[j]);
            }
        }
    }
    this._recalc = false;
};
Game.DijkstraMap.prototype._getNeighbors = function(coord) {
    var neighbors = [],
        offsets = this._getOffsets(coord);

    for (var i = 0; i < offsets.length; i++) {
        if(this._dijkstraMap[offsets[i]] !== undefined) {
            neighbors.push(offsets[i]);
        }
    }

    return neighbors;
};
Game.DijkstraMap.prototype._getOffsets = function(coord) {
    var offsets = [],
        split = coord.split(","),
        x = +split[0], // Cast to number
        y = +split[1]; // Cast to number;

    offsets.push(Number(x + 1) + "," + y);
    offsets.push(Number(x - 1) + "," + y);
    offsets.push(x + "," + Number(y + 1));
    offsets.push(x + "," + Number(y - 1));
    return offsets;
};
Game.DijkstraMap.prototype.getNext = function(x, y) {
    var currVal = this._dijkstraMap[x + "," + y],
        offsets = this._getOffsets(x + "," + y);
    for (var i = 0; i < offsets.length; i++) {
        if(this._dijkstraMap[offsets[i]] < currVal) {
            return offsets[i];
        }
    }
    return false;
};
Game.DijkstraMap.prototype._consoleLog = function() {
    var grid = [];
    for(var coord in this._dijkstraMap) {
        var x = coord.split(",")[0],
            y = coord.split(",")[1];
        if(!grid[x])
            grid[x] = [];
        grid[x][y] = this._dijkstraMap[coord];
    }
    var output = "";
    for (var y = 0; y < grid[0].length; y++) {
        for(var x = 0; x < grid.length; x++) {
            if(!grid[x])
                grid[x] = new Array(height);
            if(grid[x][y] === undefined || (grid[x][y] > 9 && letters[grid[x][y] - 10] === undefined))
                output += "#";
            else if(grid[x][y] > 9)
                output += letters[grid[x][y] - 10];
            else
                output += grid[x][y];
        }
        output += "\n";
    }
    console.log(output);
};