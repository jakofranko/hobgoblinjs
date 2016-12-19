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