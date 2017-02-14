Game.AI = {};

// TODO: Implement demeanor/behaviors ('ranged', 'agressive', 'cautious' etc.)
Game.AI.hunt = function(entity) {
    var target = entity.getTarget();
    // TODO: if no target, try to get the next one by scanning for an enemy
    var adjacent = Game.AI.Tasks.approach(entity, target);
    if(adjacent)
        Game.AI.Tasks.attack(entity, target);

    return true;
};
Game.AI.wander = function(entity) {
    Game.AI.Tasks.wander(entity);
    return true;
};