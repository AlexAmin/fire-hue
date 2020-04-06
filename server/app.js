const v3 = require('node-hue-api').v3;
const LightState = v3.lightStates.LightState;
const firebaseAdmin = require('firebase-admin');
require('dotenv').config();
const serviceAccount = require('./firebase-key');
const {RoomCommand} = require("fire-hue-common/types");
const {LightCommand} = require("fire-hue-common/types");


firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

const a = new LightCommand();
const db = firebaseAdmin.firestore();
const lightsCollection = db.collection("lights");
const roomsCollection = db.collection("rooms");
const commandsCollection = db.collection("commands");


const HUE_USERNAME = process.env.HUE_USER;
// The name of the light we wish to retrieve by name
const LIGHT_ID = 1;

function convertHueLightToStoreLight(light){
    const name = light._data.name;
    const id = light._data.id;
    return {name: name, id: id}
}
function convertHueGroupToRoom(group){
    const name = group._data.name;
    const id = group._data.id;
    const lights = group._data.lights;
    return {name: name, id: id, lights: lights}
}

function executeLightCommand(api, command){
    const state = new LightState();
    command = LightCommand.fromObject(command);

    if(command.state === "on"){
        state
            .on()
            .ct(200)
            .brightness(100);
    }else{
        state.off()
    }

    api.lights.setLightState(command.id, state);
}

v3.discovery.nupnpSearch()
    .then(searchResults => {
        searchResults = searchResults.filter( result => result.name === "Alex");
        const host = searchResults[0].ipaddress;
        return v3.api.createLocal(host).connect(HUE_USERNAME);
    })
    .then(api => {
        commandsCollection.where("createdAt", ">", new Date()).onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach((change)=>{
                switch(change.type){
                    case "added":
                        const commandData = change.doc.data();
                        switch(commandData.target){
                            case "room":
                                break;
                            case "light":
                                executeLightCommand(api, commandData)
                                break;
                        }
                        break;
                    case "modified":
                        break;
                }
            })
        });
    });

function sync(){
    v3.discovery.nupnpSearch()
        .then(searchResults => {
            searchResults = searchResults.filter( result => result.name === "Alex");
            const host = searchResults[0].ipaddress;
            return v3.api.createLocal(host).connect(HUE_USERNAME);
        })
        .then(api => {
            api.groups.getAll()
                .then(allGroups=>{
                    const rooms = allGroups.filter(group => group._data.type === "Room");
                    rooms.forEach((room)=>{
                        roomsCollection.doc(String(room.id)).set(convertHueGroupToRoom(room));
                    })

                });
            api.lights.getAll()
                .then(allLights => {
                    // Display the lights from the bridge
                    allLights.forEach((light)=>{
                        //console.log(light);
                        light = convertHueLightToStoreLight(light);
                        lightsCollection.doc(String(light.id)).set(light)
                        return;
                        if(name.indexOf("Desk")>-1){
                            // Do stuff with myLightState
                            const state = new LightState()
                                .off()
                                .ct(200)
                                .brightness(100);
                            api.lights.setLightState(light._data.id, state);
                        }
                    })

                });
        })
        .then(result => {
            console.log(`Light state change was successful? ${result}`);
        })
    ;

}
