Game.Input = {};

Game.Input.handleInput = function(inputType, inputData) {
    var keyCode = inputData.keyCode;
    switch(keycode) {
        case ROT.VK_LEFT:
            break;
        case ROT.VK_RIGHT:
            break;
        case ROT.VK_UP:
            break;
        case ROT.VK_DOWN:
            break;
        case ROT.VK_I:
            break;
        case ROT.VK_D:
            break;
        case ROT.VK_E:
            break;
        case ROT.VK_W:
            break;
        case ROT.VK_X:
            break;
        case ROT.VK_T:
            break;
        case ROT.VK_COMMA:
            break;
        case ROT.VK_SPACE:
            break;
    }
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
        } else if (inputData.keyCode === ROT.VK_X) {
            // Show the drop screen
            this.showItemsSubScreen(Game.Screen.examineScreen, this._player.getItems(),
               'You have nothing to examine.');
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
        } else if(inputData.keyCode === ROT.VK_SPACE) {
            Game.Screen.actionMenu.setup(this._player);
            this.setSubScreen(Game.Screen.actionMenu);
        } else {
            // Not a valid key
            return;
        }
        // Unlock the engine
        this._player.getMap().getEngine().unlock();
    } else if (inputType === 'keypress') {
        var keyChar = String.fromCharCode(inputData.charCode);
        if(keyChar === '>') {
            this.move(0, 0, 1);
        } else if(keyChar === '<') {
            this.move(0,0, -1);
        } else if (keyChar === ';') {
            // Setup the look screen.
            var offsets = this.getScreenOffsets();
            Game.Screen.lookScreen.setup(this._player,
                this._player.getX(), this._player.getY(),
                offsets.x, offsets.y);
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
}