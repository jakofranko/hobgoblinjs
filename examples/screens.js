// Example basic screens
Game.Screen.playScreen = new Game.Screen.basicScreen({
    _player: null,
    _time: null,
    _gameEnded: false,
    _subScreen: null,
    enter: function() {
        // TODO: Player chooses size of city?
        this._player = new Game.Entity(Game.PlayerTemplate);
        var map = new Game.Map(Game.getCitySize(), this._player);

        // Once player has been created, the map generated and the 
        // map assigned to the player (happens in map creation),
        // we can set the minimap to reflect the city overview.
        Game.setMiniMap(Game.Screen.overview, this._player);

        // Display the player's stats (characteristics)
        Game.setCharacterStats(Game.Screen.stats, this._player);

        // Start the map's engine
        map.getEngine().start();

        // The first thing that should happen is when the game starts is to
        // assign starting points
        Game.Screen.gainStatScreen.setup(this._player);
        this.setSubScreen(Game.Screen.gainStatScreen);
    },
    exit: function() { console.log("Exited play screen."); },
    render: function(display) {
        // Render subscreen if there is one
        if (this._subScreen) {
            this._subScreen.render(display);
            return;
        }

        // Otherwise, procede as usual...
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();

        // Render the tiles
        this.renderTiles(display);

        // Render player stats and time
        var stats = '%c{white}%b{black}';
        stats += String.format(
            'HP: %s/%s XP: %s Money: $%s %s',
            this._player.getHp(),
            this._player.getMaxHp(),
            this._player.getExperiencePoints(),
            this._player.getMoney(),
            this._player.getMap().getTime().clock()
        );
        display.drawText(0, screenHeight, stats);
    },
    move: function(dX, dY, dZ) {
        var newX = this._player.getX() + dX;
        var newY = this._player.getY() + dY;
        var newZ = this._player.getZ() + dZ;
        this._player.tryMove(newX, newY, newZ, this._player.getMap());
    },
    handleInput: function(inputType, inputData) {
        // If the game is over, enter will bring the user to the losing screen.
        if(this._gameEnded) {
            if (inputType === 'keydown' && inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.loseScreen);
            }
            // Return to make sure the user can't still play
            return;
        }
        // Handle subscreen input if there is one
        if (this._subScreen) {
            this._subScreen.handleInput(inputType, inputData);
            return;
        }

        // If the player is unconscious, all they can do is skip their turn
        if(!this._player.isConscious()) {
            if (inputType === 'keydown' && inputData.keyCode === ROT.VK_RETURN)
                this._player.getMap().getEngine().unlock();
            else
                return;
        }

        // Otherwise, handle input normally for this screen
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_LEFT) {
                this.move(-1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                this.move(1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.move(0, -1, 0);
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.move(0, 1, 0);
            } else if (inputData.keyCode === ROT.VK_I) {
                // Show the inventory screen
                this.showItemsSubScreen(Game.Screen.inventoryScreen, this._player.getItems(), 'You are not carrying anything.');
                return;
            } else if (inputData.keyCode === ROT.VK_D) {
                // Show the drop screen
                this.showItemsSubScreen(Game.Screen.dropScreen, this._player.getItems(), 'You have nothing to drop.');
                return;
            } else if (inputData.keyCode === ROT.VK_E) {
                // Show the drop screen
                this.showItemsSubScreen(Game.Screen.eatScreen, this._player.getItems(), 'You have nothing to eat.');
                return;
            } else if (inputData.keyCode === ROT.VK_W) {
                if (inputData.shiftKey) {
                    // Show the wear screen
                    this.showItemsSubScreen(Game.Screen.wearScreen, this._player.getItems(), 'You have nothing to wear.');
                } else {
                    // Show the wield screen
                    this.showItemsSubScreen(Game.Screen.wieldScreen, this._player.getItems(), 'You have nothing to wield.');
                }
            } else if(inputData.keyCode === ROT.VK_S) {
                // Show the stats screen for spending xp
                Game.Screen.gainStatScreen.setup(this._player);
                this.setSubScreen(Game.Screen.gainStatScreen);
                return;
            } else if(inputData.keyCode === ROT.VK_J) {
                this.setSubScreen(Game.Screen.justiceScreen);
                return;
            } else if (inputData.keyCode === ROT.VK_X) {
                // Show the drop screen
                this.showItemsSubScreen(Game.Screen.examineScreen, this._player.getItems(), 'You have nothing to examine.');
                return;
            } else if(inputData.keyCode === ROT.VK_T) {
                this.showItemsSubScreen(Game.Screen.throwScreen, this._player.getItems(), 'You have nothing to throw.');
                return;
            } else if (inputData.keyCode === ROT.VK_COMMA) {
                var items = this._player.getMap().getItemsAt(this._player.getX(), this._player.getY(), this._player.getZ());
                // If there is only one item, directly pick it up
                if (items && items.length === 1) {
                    var item = items[0];
                    if (this._player.pickupItems([0])) {
                        Game.sendMessage(this._player, "You pick up %s.", [item.describeA()]);
                    } else {
                        Game.sendMessage(this._player, "Your inventory is full! Nothing was picked up.");
                    }
                } else {
                    this.showItemsSubScreen(Game.Screen.pickupScreen, items, 'There is nothing here to pick up.');
                } 
            } else if(inputData.keyCode === ROT.VK_PERIOD) {
                // Skip turn
                this._player.getMap().getEngine().unlock();
                // If you don't stop it here, then it will try to perform two actions for the player
                return;
            } else {
                // Not a valid key
                return;
            }
            // Unlock the engine
            this._player.getMap().getEngine().unlock();
        } else if (inputType === 'keypress') {
            var keyChar = String.fromCharCode(inputData.charCode);
            if(keyChar === '>') {
                this.move(0, 0, -1);
            } else if(keyChar === '<') {
                this.move(0, 0, 1);
            } else if (keyChar === ';') {
                // Setup the look screen.
                var offsets = this.getScreenOffsets();
                Game.Screen.lookScreen.setup(
                    this._player,
                    this._player.getX(),
                    this._player.getY(),
                    offsets.x, 
                    offsets.y
                );
                this.setSubScreen(Game.Screen.lookScreen);
                return;
            } else if (keyChar === '?') {
                // Setup the look screen.
                this.setSubScreen(Game.Screen.helpScreen);
                return;
            } else {
                // Not a valid key
                return;
            }
            // Unlock the engine
            this._player.getMap().getEngine().unlock();
        }
    },
    getScreenOffsets: function() {
        // Make sure we still have enough space to fit an entire game screen
        var topLeftX = Math.max(0, this._player.getX() - (Game.getScreenWidth() / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.round(Math.min(topLeftX, this._player.getMap().getWidth() - Game.getScreenWidth()));
        // Make sure the y-axis doesn't above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (Game.getScreenHeight() / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.round(Math.min(topLeftY, this._player.getMap().getHeight() - Game.getScreenHeight()));
        return {
            x: topLeftX,
            y: topLeftY
        };
    },
    renderTiles: function(display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();

        var offsets = this.getScreenOffsets();
        var topLeftX = offsets.x;
        var topLeftY = offsets.y;
        // This object will keep track of all visible map cells
        var visibleCells = {};
        // Store this._player.getMap() and player's z to prevent losing it in callbacks
        var map = this._player.getMap();
        
        var currentDepth = this._player.getZ();
        // Find all visible cells and update the object
        map.getFov(currentDepth).compute(
            this._player.getX(), 
            this._player.getY(), 
            this._player.getSightRadius(), 
            function(x, y, radius, visibility) {
                visibleCells[x + "," + y] = true;
                // Mark cell as explored
                map.setExplored(x, y, currentDepth, true);
            });
        // Iterate through visible map cells
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                if (map.isExplored(x, y, currentDepth)) {
                    // Fetch the glyph for the tile and render it to the screen
                    // at the offset position.
                    var glyph,
                        foreground;
                    // If we are at a cell that is in the field of vision, we need
                    // to check if there are items or entities.
                    if (visibleCells[x + ',' + y]) {
                        // Check if we have an entity at the position
                        var entity = map.getEntityAt(x, y, currentDepth);
                        var items = map.getItemsAt(x, y, currentDepth);
                        if (entity) {
                            glyph = map.getEntityAt(x, y, currentDepth);
                            var criminals = this._player.getMemory().people.criminals;
                            // Change foreground based on character's memory
                            if(Object.keys(criminals).length > 0) {
                                var name = glyph.getName();
                                if(criminals[name]) {
                                    foreground = Game.Palette.red;
                                } else {
                                    foreground = glyph.getForeground();
                                }
                            } else {
                                foreground = glyph.getForeground();
                            }
                        } else if(items) {
                            glyph = items[items.length - 1];
                            foreground = glyph.getForeground();
                        } else {
                            glyph = map.getTile(x, y, currentDepth);
                            foreground = glyph.getForeground();
                        }
                    } else {
                        // Not in our FOV, so just display the terrain
                        glyph = map.getTile(x, y, currentDepth);
                        // Since the tile was previously explored but is not 
                        // visible, we want to change the foreground color to
                        // dark gray.
                        foreground = ROT.Color.toHex(ROT.Color.multiply([100,100,100], ROT.Color.fromString(glyph.getForeground())));
                    }
                    
                    display.draw(
                        x - topLeftX,
                        y - topLeftY,
                        glyph.getChar(), 
                        foreground, 
                        glyph.getBackground()
                    );
                }
            }
        }
    },
    setGameEnded: function(gameEnded) {
        this._gameEnded = gameEnded;
    },
    setSubScreen: function(subScreen) {
        this._subScreen = subScreen;
        Game.refresh();
    },
    showItemsSubScreen: function(subScreen, items, emptyMessage) {
        if (items && subScreen.setup(this._player, items) > 0) {
            this.setSubScreen(subScreen);
        } else {
            Game.sendMessage(this._player, emptyMessage);
            Game.refresh(this._player);
        }
    },
    getPlayer: function() {
        return this._player;
    }
});

Game.Screen.helpScreen = new Game.Screen.basicScreen({
    enter: function(){},
    exit: function(){},
    render: function(display) {
        var text = 'Help / Command List';
        var border = '-------------------';
        var y = 0;
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, border);
        
        display.drawText(0, y++, '[%c{#585DF5},%c{}] to pick up items');
        display.drawText(0, y++, '[%c{#585DF5}d%c{}] to drop items');
        display.drawText(0, y++, '[%c{#585DF5}w%c{}] to wield items');
        display.drawText(0, y++, '[%c{#585DF5}W%c{}] to wield items');
        display.drawText(0, y++, '[%c{#585DF5}x%c{}] to examine items');
        display.drawText(0, y++, '[%c{#585DF5};%c{}] to look around you');
        display.drawText(0, y++, '[%c{#585DF5}.%c{}] to wait');
        display.drawText(0, y++, '[%c{#585DF5}s%c{}] to spend experience points');
        display.drawText(0, y++, '[%c{#585DF5}?%c{}] to show this help screen');
        y += 3;
        text = '--- press any key to continue ---';
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
    },
    handleInput: function(inputType, inputData) {
        Game.Screen.playScreen.setSubScreen(null);
    }
});

// Inventory sub-screens
Game.Screen.inventoryScreen = new Game.Screen.ItemListScreen({
    caption: 'Inventory',
    canSelect: false
});
Game.Screen.pickupScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the items you wish to pickup',
    canSelect: true,
    canSelectMultipleItems: true,
    ok: function(selectedItems) {
        // Try to pick up all items, messaging the player if they couldn't all be picked up.
        if (!this._player.pickupItems(Object.keys(selectedItems))) {
            Game.sendMessage(this._player, "Your inventory is full! Not all items were picked up.");
        }
        return true;
    }
});
Game.Screen.dropScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to drop',
    canSelect: true,
    canSelectMultipleItems: false,
    ok: function(selectedItems) {
        // Drop the selected item
        this._player.dropItem(Object.keys(selectedItems)[0]);
        return true;
    }
});
Game.Screen.eatScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to eat',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return item && item.hasMixin('Edible') && item !== this._player._armor && item !== this._player._weapon;
    },
    ok: function(selectedItems) {
        // Eat the item, removing it if there are no consumptions remaining.
        var key = Object.keys(selectedItems)[0];
        var item = selectedItems[key];
        Game.sendMessage(this._player, "You eat %s.", [item.describeThe()]);
        item.eat(this._player);
        if (!item.hasRemainingConsumptions()) {
            this._player.removeItem(key);
        }
        return true;
    }
});
Game.Screen.wieldScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wield',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasMixin('Equippable') && item.isWieldable();
    },
    ok: function(selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if (keys.length === 0) {
            this._player.unwield();
            Game.sendMessage(this._player, "You are empty handed.")
        } else {
            // Make sure to unequip the item first in case it is the armor.
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wield(item);
            Game.sendMessage(this._player, "You are wielding %s.", [item.describeA()]);
        }
        return true;
    }
});
Game.Screen.wearScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wear',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasMixin('Equippable') && item.isWearable();
    },
    ok: function(selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if (keys.length === 0) {
            this._player.unwield();
            Game.sendMessage(this._player, "You are not wearing anthing.");
        } else {
            // Make sure to unequip the item first in case it is the weapon.
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wear(item);
            Game.sendMessage(this._player, "You are wearing %s.", [item.describeA()]);
        }
        return true;
    }
});
Game.Screen.examineScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to examine',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return true;
    },
    ok: function(selectedItems) {
        var keys = Object.keys(selectedItems);
        if (keys.length > 0) {
            var item = selectedItems[keys[0]];
            var description = "It's %s";
            var details = item.details();
            if(details && details != "") {
                description += " (%s).";
                Game.sendMessage(this._player, description, 
                [
                    item.describeA(false),
                    item.details()
                ]);
            } else {
                Game.sendMessage(this._player, description, [item.describeA(false)]);
            }
            
        }
        return true;
    }
});
Game.Screen.throwScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to throw',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        if(!item || !item.hasMixin('Throwable')) {
            return false;
        } else if(item.hasMixin('Equippable') && (item.isWielded() || item.isWorn())) {
            return false;
        } else {
            return true;
        }
    },
    ok: function(selectedItems) {
        var offsets = Game.Screen.playScreen.getScreenOffsets();
        // Go to the targetting screen
        Game.Screen.throwTargetScreen.setup(this._player, this._player.getX(), this._player.getY(), offsets.x, offsets.y);
        this._player.setThrowing(Object.keys(selectedItems)[0]);
        Game.Screen.playScreen.setSubScreen(Game.Screen.throwTargetScreen);
        return;
    }
});

// Target-based screens
Game.Screen.lookScreen = new Game.Screen.TargetBasedScreen({
    captionFunction: function(x, y) {
        var z = this._player.getZ();
        var map = this._player.getMap();
        // If the tile is explored, we can give a better capton
        if (map.isExplored(x, y, z)) {
            // If the tile isn't explored, we have to check if we can actually 
            // see it before testing if there's an entity or item.
            if (this._visibleCells[x + ',' + y]) {
                var items = map.getItemsAt(x, y, z);
                // If we have items, we want to render the top most item
                if (items) {
                    var item = items[items.length - 1];
                    return String.format('%s - %s (%s)',
                        item.getRepresentation(),
                        item.describeA(true),
                        item.details());
                // Else check if there's an entity
                } else if (map.getEntityAt(x, y, z)) {
                    var entity = map.getEntityAt(x, y, z);
                    return String.format('%s - %s (%s)',
                        entity.getRepresentation(),
                        entity.describeA(true) + ' ('+ entity.getName() + ')',
                        entity.details());
                }
            }
            // If there was no entity/item or the tile wasn't visible, then use
            // the tile information.
            return String.format('%s - %s',
                map.getTile(x, y, z).getRepresentation(),
                map.getTile(x, y, z).getDescription());

        } else {
            var nullTile = Game.TileRepository.create('null');
            // If the tile is not explored, show the null tile description.
            return String.format('%s - %s',
                nullTile.getRepresentation(),
                nullTile.getDescription());
        }
    }
});
Game.Screen.throwTargetScreen = new Game.Screen.TargetBasedScreen({
    okFunction: function(x, y) {
        this._player.throwItem(this._player.getThrowing(), x, y);
        return true;
    }
});