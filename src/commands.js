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

Game.Commands = {};

Game.Commands.moveCommand = function(diffX, diffY, diffZ) {
    return function(entity) {
        entity.tryMove(entity.getX() - diffX, entity.getY() - diffY, entity.getZ() - diffZ);
    };
};

Game.Commands.showScreenCommand = function(screen) {
    return function() {
        throw new Error('Must be defined');
    };
};

Game.Commands.showItemScreenCommand = function(screen) {
    return function() {
        throw new Error('Must be defined');
    };
};

Game.Commands.showTargettingScreenCommand = function(screen) {
    return function() {
        throw new Error('Must be defined');
    };
};

Game.Commands.nullCommand = function() {
    return function(){};
};
