// Notes on defining tasks:
// - The actors should be determined by the Game.AI entry almost always; no logic for determining who the actors are should exist in a task

Game.AI.Tasks = {};

// This task should be a wrapper to handle how an AI entity
// will attack the target based on behavior and equipment
// TODO: implement logic switches based on entity behavior
// TODO: account for ranged weapons (need to separate the Attacker
// mixin into melee and ranged versions (like in MonsterHunterRL))
Game.AI.Tasks.attack = function(entity, target) {
	if(entity.hasMixin('Attacker'))
		entity.attack(target);
};
Game.AI.Tasks.approach = function(entity, target) {
	// If no one is around, then just wander
	if(!target) {
		this.wander(entity);
		return false;
	} else if(entity.getPath().length > 0) {
		var step = entity.getNextStep();
		entity.tryMove(step[0], step[1], step[2]);
		return false;
	} else {
		// If we are adjacent to the target, then we have successfully approached it.
	    // TODO: if I'm not mistaken, this enforces a topology 4 and doesn't account for diagnally adjacent
	    var distance = Math.abs(target.getX() - entity.getX()) + Math.abs(target.getY() - entity.getY());
	    if(distance === 1) {
            return true;
	    }

	    // Generate the path and move to the first tile.
	    var source = entity;
	    var z = source.getZ();
	    var path = new ROT.Path.AStar(target.getX(), target.getY(), function(x, y) {
	        // If an entity is present at the tile, can't move there.
	        var entity = source.getMap().getEntityAt(x, y, z);
	        if (entity && entity !== target && entity !== source) {
	            return false;
	        }
	        return source.getMap().getTile(x, y, z).isWalkable();
	    }, {topology: 4});
	    // Once we've gotten the path, we want to store a number of steps equal
	    // to half the distance between the entity and the target, skipping the 
	    // first coordinate because that is the entity's starting location
	    var count = 0;
	    var entityPath = [];
	    path.compute(source.getX(), source.getY(), function(x, y) {
	        if(count > 0 && count <= distance / 2)
	            entityPath.push([x, y, z]);
	        count++;
	    });

	    // Update the entity's path and make the first step
	    entity.setPath(entityPath);
	    var step = entity.getNextStep();

	    // TODO: This might cause some entities to freeze...
	    if(step && step.length)
	    	entity.tryMove(step[0], step[1], step[2]);
	    return false;
	}
};

Game.AI.Tasks.wander = function(entity) {
    // Flip coin to determine if moving by 1 in the positive or negative direction
    var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
    // Flip coin to determine if moving in x direction or y direction
    if (Math.round(Math.random()) === 1) {
        entity.tryMove(entity.getX() + moveOffset, entity.getY(), entity.getZ());
    } else {
        entity.tryMove(entity.getX(), entity.getY() + moveOffset, entity.getZ());
    }
};