const firebase = require("firebase");

module.exports = class Command {
    constructor(state, target) {
        this.state = state;
        this.target = target;
        this.createdAt = new Date() //Firebase is fussy when we convert the instance of this class to an object and wont accept firebase.firestore.Timestamp anymore
    }

    /**
     * Firebase does not allow us to add class instances to the database
     * This casts the class instance into a plain object
     * @returns {{} & Command}
     */
    toObject() {
        const objectValue = Object.assign({}, this)
        delete objectValue.commandsCollection;
        return objectValue
    }
};
