Game.AI = {};

// TODO: Account for ranged monsters
Game.AI.hunt = function(entity) {
    var target = entity.getTarget();
    var adjacent = Game.AI.Tasks.approach(entity, target);
    if(adjacent)
        Game.AI.Tasks.attack(entity, target);

    return true;
};
Game.AI.wander = function(entity) {
    Game.AI.Tasks.wander(entity);
    return true;
};