Game.AI = {};

// TODO: Implement demeanor/behaviors ('ranged', 'agressive', 'cautious' etc.)
Game.AI.hunt = function(entity) {
    var target = entity.getTarget();
    if(!target) {
        var enemiesInSight = entity.scanForEnemies();
        if(enemiesInSight.length < 1)
            return false; // This task has failed, so on to the next
        else {
            target = enemiesInSight[0];
            entity.setTarget(enemiesInSight[0]);
        }
    }
    var adjacent = Game.AI.Tasks.approach(entity, target);
    if(adjacent)
        Game.AI.Tasks.attack(entity, target);

    return true;
};
Game.AI.wander = function(entity) {
    Game.AI.Tasks.wander(entity);
    return true;
};