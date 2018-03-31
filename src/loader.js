// Game.Loader is a simple utility to track modules as they load (for the purpose of a load screen or some such).
// The loader can be initialized with an arbitrary list of module names. Additional modules
// can be `register`ed to the loader instance, as well as sub-modules.
Game.Loader = function(modules) {
	this.modules = {};
	for (var i = 0; i < modules.length; i++) {
		this.modules[modules[i]] = {
			submodules: {},
			progress: 0
		};
	}
	this.totalProgress = 0;
	this.currentlyLoading = [];
};
Game.Loader.prototype.getProgress = function() {
	return this.totalProgress;
};
Game.Loader.prototype.registerModule = function(module, submodule) {
	if(module in this.modules === false) {
		this.modules[module] = {
			submodules: {},
			progress: 0
		};
	} else if(submodule in this.modules[module].submodules === false) {
		this.modules[module].submodules[submodule] = {
			progress: 0
		};
	}
};
Game.Loader.prototype.startModule = function(module) {
	if(this.currentlyLoading.indexOf(module) === -1)
		this.currentlyLoading.push(module);
};
Game.Loader.prototype.startSubmodule = function(module, submodule) {
	if(this.currentlyLoading.indexOf(module) === -1)
		throw new Error("'" + module + "' is not currently loading.");
	if(this.currentlyLoading.indexOf(submodule) === -1)
		this.currentlyLoading.push(submodule);
};
Game.Loader.prototype.finishModule = function(module) {
	if(module in this.modules === false)
		throw new Error("'" + module + "' is not a registered module");

	// Make progress 100
	this.modules[module].progress = 100;

	// Remove item from currently loading list
	var index = this.currentlyLoading.indexOf(module);
	this.currentlyLoading.splice(index, 1);

	this._updateProgress();
};
Game.Loader.prototype.finishSubmodule = function(module, submodule) {
	if(this.currentlyLoading.indexOf(module) === -1)
		throw new Error("'" + module + "' is not currently loading.");
	else if(this.currentlyLoading.indexOf(submodule) === -1)
		throw new Error("'" + submodule + "' is not currently loading");
	else if(module in this.modules === false)
		throw new Error("'" + module + "' is not a registered module");
	else if(submodule in this.modules[module].submodules === false)
		throw new Error("'" + submodule + "' is not a registered submodule of '" + module + "'");

	this.modules[module].submodules[submodule].progress = 100;
	var index = this.currentlyLoading.indexOf(submodule);
	this.currentlyLoading.splice(index, 1);

	this._updateProgress();
};
Game.Loader.prototype.updateModule = function(module, amount) {
	if(module in this.modules === false)
		throw new Error("'" + module + "' is not a registered module");

	this.modules[module].progress = amount;

	this._updateProgress();
};
Game.Loader.prototype.updateSubmodule = function(module, submodule, amount) {
	if(module in this.modules === false)
		throw new Error("'" + module + "' is not a registered module");
	else if(submodule in this.modules[module].submodules === false)
		throw new Error("'" + submodule + "' is not a submodule of '" + module + "'");

	this.modules[module].submodules[submodule].progress = amount;

	// Update module progress as a function of the submodule's progress
	var numSubmodules = Object.keys(this.modules[module].submodules).length,
		maxProgress = numSubmodules * 100,
		currentProgress = 0;

	for(var sm in this.modules[module].submodules)
		currentProgress += this.modules[module].submodules[sm].progress;

	this.modules[module].progress = (currentProgress / maxProgress) * 100;

	this._updateProgress();
};
Game.Loader.prototype._updateProgress = function() {
	var numModules = Object.keys(this.modules).length,
		maxProgress = numModules * 100,
		currentProgress = 0,
        submodules, moduleMaxProgress, moduleProgress;

    for(var module in this.modules) {
        submodules = Object.keys(this.modules[module].submodules);
        moduleMaxProgress = submodules.length * 100;
        moduleProgress = 0;
        if(submodules.length) {
            for(var submodule in this.modules[module].submodules) {
                moduleProgress +=  this.modules[module].submodules[submodule].progress
            }

            this.modules[module].progress = (moduleProgress / moduleMaxProgress) * 100;
        }

        currentProgress += this.modules[module].progress;
    }

	for(var module in this.modules)
		currentProgress += this.modules[module].progress;

	this.totalProgress = (currentProgress / maxProgress) * 100;
};
