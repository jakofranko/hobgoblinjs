Game.ItemMixins = {};

Game.ItemMixins.Edible = {
    name: 'Edible',
    init: function(template) {
        // Number of points to add to hunger
        this._foodValue = template['foodValue'] || 5;
        // Number of times the item can be consumed
        this._maxConsumptions = template['consumptions'] || 1;
        this._remainingConsumptions = this._maxConsumptions;
    },
    eat: function(entity) {
        if (entity.hasMixin('FoodConsumer')) {
            if (this.hasRemainingConsumptions()) {
                entity.modifyFullnessBy(this._foodValue);
                this._remainingConsumptions--;
            }
        }
    },
    hasRemainingConsumptions: function() {
        return this._remainingConsumptions > 0;
    },
    describe: function() {
        if (this._maxConsumptions != this._remainingConsumptions) {
            return 'partly eaten ' + Game.Item.prototype.describe.call(this);
        } else {
            return this._name;
        }
    },
    listeners: {
        'details': function() {
            return [{key: 'food', value: this._foodValue}];
        }
    }
};
Game.ItemMixins.Equippable = {
    name: 'Equippable',
    init: function(template) {
        this._attackValue = template['attackValue'] || 0;
        this._defenseValue = template['defenseValue'] || 0;
        this._wieldable = template['wieldable'] || false;
        this._wearable = template['wearable'] || false;
        this._wielded = false;
        this._worn = false;
    },
    getAttackValue: function() {
        return this._attackValue;
    },
    getDefenseValue: function() {
        return this._defenseValue;
    },
    isWieldable: function() {
        return this._wieldable;
    },
    isWielded: function() {
        return this._wielded;
    },
    wield: function() {
        this._wielded = true;
    },
    unwield: function() {
        this._wield = false;
    },
    isWearable: function() {
        return this._wearable;
    },
    isWorn: function() {
        return this._worn;
    },
    wear: function() {
        this._worn = true;
    },
    takeOff: function() {
        this._worn = false;
    },
    listeners: {
        'details': function() {
            var results = [];
            if (this._wieldable) {
                results.push({key: 'attack', value: this.getAttackValue()});
            }
            if (this._wearable) {
                results.push({key: 'defense', value: this.getDefenseValue()});
            }
            return results;
        }
    }
};
Game.ItemMixins.Stackable = {
    name: 'Stackable',
    init: function(template) {
        this._stackable = template['stackable'] || false;
        this._count = template['count'] || 1;
    },
    amount: function() {
        return this._count;
    },
    addToStack: function(amount) {
        if(amount) {
            this._count += amount;
        } else {
            this._count++;    
        }
    },
    isStackable: function() {
        return this._stackable;
    },
    removeFromStack: function(amount) {
        if(amount) {
            this._count -= amount;
        } else {
            this._count--;
        }
    }
};
Game.ItemMixins.Throwable = {
    name: 'Throwable',
    init: function(template) {
        this._throwable = template['throwable'] || false;
        this._attackValue = template['attackValue'] || 1;
    },
    getAttackValue: function() {
        return this._attackValue;
    },
    isThrowable: function() {
        return this._throwable;
    },
    listeners: {
        'details': function() {
            var results = [];
            if (this._throwable) {
                results.push({key: 'attack', value: this.getAttackValue()});
            }
            return results;
        }
    }
};

// Adding an item to a container removes it from the entity.
// Removing an item from a container adds it to the entity.
Game.ItemMixins.Container = {
    name: 'Container',
    init: function(template) {
        this._items = [];
    },
    getItems: function() {
        return this._items;
    },
    getItem: function(i) {
        return this._items[i];
    },
    addItem: function(entity, index, amount) {
        debugger;
        if(!entity.hasMixin('InventoryHolder') && !entity.hasMixin('Container')) {
            return false;
        }
        var item = entity.getItem(index);
        this._items.push(item);
        entity.removeItem(index, amount);

        if(entity.hasMixin('MessageRecipient'))
            Game.sendMessage(entity, "You place %s into %s", [item.describeThe(), this.describeThe()]);

    },
    removeItem: function(entity, index, amount) {
        debugger;
        if(!entity.hasMixin('InventoryHolder') && !entity.hasMixin('Container')) {
            return false;
        }
        var item = this.getItem(index);
        entity.addItem(item);
        this._items.splice(index, 1);

        if(entity.hasMixin('MessageRecipient'))
            Game.sendMessage(entity, "You remove %s from %s", [item.describeThe(), this.describeThe()]);
    },
    listeners: {
        'action': function(actionTaker) {
            var actions = {};
            var actionName = "Open %s".format(this.describeThe());

            // array of functions to execute. For each sub-array,
            // first value is the action function,
            // second value are the args,
            // third (optional) value is the 'this' context to use
            actions[actionName] = [
                [Game.Screen.containerScreen.setup, [actionTaker, actionTaker.getItems(), this, this.getItems()], Game.Screen.containerScreen],
                [Game.Screen.playScreen.setSubScreen, [Game.Screen.containerScreen], Game.Screen.playScreen]
            ];
            return actions;
        }
    }
};