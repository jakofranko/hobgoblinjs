// Inspiration for this architecture was drawn from Robert Nystrom's book 'Game Programming Patterns,'
// and specifically from his chapter on the Command Pattern: http://gameprogrammingpatterns.com/command.html
//
// A command is something that encapsulates functionality in a way that decouples input from action.
// There are different ways of implementing this; one way is to have a command simply execute another function,
// and return nothing. With a little bit of support for binding functions to commands, this may be all we
// need. However, another way this can be implemented is to have a command RETURN a function, so that commands
// can be manipulated independently. I think I will go with this approach, since it can allow an entity to
// undo/redo actions, as well as allow us to decouple the entity and the command, allowing the player to
// control monsters and vice-versa.
//
// There are two other variations of this pattern that are relevant to our purposes. The first is to have
// the returned function take an actor (entity) as a parameter. This let's us perform the command on any
// actor we desire at a later time. The other variation binds the entity to the returned function. The
// advantage of this set up is that it would allow undo/redo behavior with less overhead. For now, I
// think that the first variety will be fine for our needs, since keeping track of a stream of commands
// that can be undone/redone isn't a big feature for most roguelikes, and could be implemented with little
// difficulty for one that wanted to support this functionality.
//
// This architecture will involve two parts: 1) a 'handler' (for now, player input) that will take an input,
// and return a command to be executed later, and 2) a list of commands.
//
// Final note: the function that is returned by a command should return a boolean value that will
// indicate whether or not the command should unlock the game engine, thereby ending the entity's turn.

Game.Commands = {};

Game.Commands.moveCommand = function(diffX, diffY, diffZ) {
    return function(entity) {
        return entity.tryMove(entity.getX() - diffX, entity.getY() - diffY, entity.getZ() - diffZ);
    };
};

Game.Commands.showScreenCommand = function(screen, mainScreen) {
    return function(entity) {
        if(screen.setup)
            screen.setup(entity);
        mainScreen.setSubScreen(screen);
    };
};

Game.Commands.showItemScreenCommand = function(itemScreen, mainScreen, noItemsMessage, getItems) {
    debugger;
    return function(entity) {
        debugger;
        // Items screens' setup method will always return the number of items they will display.
        // This can be used to determine a prompt if no items will display in the menu
        if(!itemScreen.setup)
            throw new Error('item screens require a setup method.');

        var items = getItems ? getItems(entity) : entity.getItems();
        if(!items) items = [];
        var acceptableItems = itemScreen.setup(entity, items);
        if(acceptableItems > 0)
            mainScreen.setSubScreen(itemScreen);
        else {
            Game.sendMessage(entity, noItemsMessage);
            Game.refresh();
        }
    };
};

Game.Commands.ItemScreenExecuteOkCommand = function(mainScreen, key) {
    return function() {
        debugger;
        var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var index = letters.indexOf(key.toLowerCase());
        var subScreen = mainScreen.getSubScreen();

        // If enter is pressed, execute the ok functions
        if(key === "Enter")
            return subScreen.executeOkFunction();

        // If the 'no item' option is selected
        if(subScreen._canSelectItem && subScreen._hasNoItemOption && key === "0") {
            subScreen._selectedIndices = {};
            return subScreen.executeOkFunction();
        }

        // Do nothing if a letter isn't pressed
        if(index === -1)
            return false;

        if(subScreen._items[index]) {
            // If multiple selection is allowed, toggle the selection status,
            // else select the item and exit the screen
            if(subScreen._canSelectMultipleItems) {
                if(subScreen._selectedIndices[index])
                    delete subScreen._selectedIndices[index];
                else
                    subScreen._selectedIndices[index] = true;

            } else {
                subScreen._selectedIndices[index] = true;
                return subScreen.executeOkFunction();
            }
        }
    }
}

Game.Commands.showTargettingScreenCommand = function(targettingScreen, mainScreen) {
    return function(entity) {
        // Make sure the x-axis doesn't go above the top bound
        var topLeftX = Math.max(0, entity.getX() - (Game.getScreenWidth() / 2));
        // Make sure we still have enough space to fit an entire game screen
        var offsetX = Math.min(topLeftX, entity.getMap().getWidth() - Game.getScreenWidth());
        // Make sure the y-axis doesn't go above the top bound
        var topLeftY = Math.max(0, entity.getY() - (Game.getScreenHeight() / 2));
        // Make sure we still have enough space to fit an entire game screen
        var offsetY = Math.min(topLeftY, entity.getMap().getHeight() - Game.getScreenHeight());

        targettingScreen.setup(entity, entity.getX(), entity.getY(), offsetX, offsetY);
        mainScreen.setSubScreen(targettingScreen);
    };
};

Game.Commands.removeSubScreenCommand = function(mainScreen) {
    return function() {
        mainScreen.setSubScreen(undefined);
    };
};

Game.Commands.nullCommand = function() {
    return function(){};
};
