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
// This architecture will involve two parts: 1) a 'handler' (for now, player input) that will take an input,
// and return a command to be executed later, and 2) a list of commands.

Game.Commands = {};

Game.Commands.moveCommand = function(entity, x, y, z) {

};