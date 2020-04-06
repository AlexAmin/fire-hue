const CommandTargets = require("../enum/commandTargets");
const Command = require("./command");

class LightCommand extends Command {
    /**
     * @param state {States}
     * @param lightId {Number!}
     * @param color {String?}
     */
    constructor(state, lightId, color) {
        super(state, CommandTargets.LIGHT);
        this.id = lightId;
        this.color = color;
    }
}
/**
 * When retrieving an object from firebase, its a plain object
 * this function casts it back to a proper class instance
 * @param object
 * @returns {LightCommand}
 */
LightCommand.fromObject = function(object){
    const lightCommand = new LightCommand();
    Object.keys(lightCommand).forEach(key=>lightCommand[key]=object[key]);
    return lightCommand
};
module.exports = LightCommand;
