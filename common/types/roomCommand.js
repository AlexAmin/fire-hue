const CommandTargets = require("../enum/commandTargets");
const Command = require("./command");

class RoomCommand extends Command {
    /**
     * @param state {States}
     * @param roomId
     * @param color {String?}
     */
    constructor(state, roomId, color) {
        super(state, CommandTargets.ROOM);
        this.id = roomId;
        this.color = color;
    }
}
/**
 * When retrieving an object from firebase, its a plain object
 * this function casts it back to a proper class instance
 * @param object
 * @returns {RoomCommand}
 */
RoomCommand.fromObject = function(object){
    const roomCommand = new RoomCommand();
    Object.keys(roomCommand).forEach(key=>roomCommand[key]=object[key]);
    return roomCommand
};
module.exports = RoomCommand;
