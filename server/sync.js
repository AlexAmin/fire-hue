const v3 = require('node-hue-api').v3;
const LightState = v3.lightStates.LightState;
const RGBColor = require("./RGBColor");
module.exports = async function sync(api, roomsCollection, lightsCollection){
    //Get all light groups (Rooms etc.)
    const allGroups = await api.groups.getAll();
    //Filter them to grab only rooms
    const rooms = allGroups.filter(group => group._data.type === "Room");
    //Store each room in firestore
    for (const room of rooms) {
        await roomsCollection.doc(String(room.id)).set(convertHueGroupToRoom(room));
    }

    //Get all lights
    const allLights = await api.lights.getAll();
    const formattedLights = {};
    //Store all lights in firestore
    for (const light of allLights) {
        await lightsCollection.doc(String(light.id)).set(convertHueLightToStoreLight(light));
        formattedLights[light.id] = light.name;
    }

    return formattedLights;
};

function convertHueLightToStoreLight(light){
    const name = light._data.name;
    const id = light._data.id;
    if(light.state.xy){
        const colorJSON = new RGBColor()
            .fromXY(light.state.xy[0], light.state.xy[1], light.state.bri)
            .toJSON();
        return {name: name, id: id, color: colorJSON}
    }
    return {name: name, id: id}
}

function convertHueGroupToRoom(group){
    const name = group._data.name;
    const id = group._data.id;
    const lights = group._data.lights;
    return {name: name, id: id, lights: lights}
}
