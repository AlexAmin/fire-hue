const RGBColor = require("./RGBColor");
const v3 = require('node-hue-api').v3;
const Queue = require("./queue");
const LightState = v3.lightStates.LightState;
const firebaseAdmin = require('firebase-admin');
require('dotenv').config();
const serviceAccount = require('./firebase-key');
const {RoomCommand} = require("fire-hue-common/types");
const {LightCommand} = require("fire-hue-common/types");
const sync = require("./sync");
const connectHue = require("./connect");
const LIGHT_STATES = require("fire-hue-common").enum.States;

//Initialize Firebase Admin
firebaseAdmin.initializeApp({credential: firebaseAdmin.credential.cert(serviceAccount)});

//Hue API username must be provided in env variables
const HUE_USERNAME = process.env.HUE_USER;
//Optionally, a hue base name may be provided in case multiple base stations are present on the network
const HUE_BASE_STATION_NAME = process.env.HUE_BASE_STATION_NAME;
//If an IP address for the base station is supplied, no discovery will happen
//The script will directly attempt to connect to this station
const HUE_BASE_STATION_IP_ADDRESS = process.env.HUE_BASE_STATION_IP_ADDRESS

//Prepare database
const db = firebaseAdmin.firestore();
//All lights are within the lights collection
const lightsCollection = db.collection("lights");
//All rooms are within the rooms collection
const roomsCollection = db.collection("rooms");
//The client pushes new commands into the commands collection
const commandsCollection = db.collection("commands");
//This script will move commands into the commandHistory collection after they're processed
const commandHistoryCollection = db.collection("commandHistory");

//The connected Hue API client
let hueAPIClient;

//All lights in a dictionary, indexed by their id
let lights = {};

function executeRoomCommand(api, command){
    //TODO
}

function executeLightCommand(api, command){
    const state = new LightState();
    command = LightCommand.fromObject(command);
    //make lights turn on immediately without an effect
    state.effectNone();
    if(command.state === LIGHT_STATES.ON){
        state.on(true);
        state.brightness(command.brightness);
        if(command.color){
            const rgb = new RGBColor().fromHex(command.color);
            state.rgb(rgb.getRed(), rgb.getGreen(), rgb.getBlue());
        }
        console.log(`${lights[command.id]} turned on at ${command.brightness}% brightness and color ${command.color}`)
    }else{
        console.log(`${lights[command.id]} turned off`);
        state.off()
    }

    api.lights.setLightState(command.id, state);
}


function commandAdded(change){
    //Only listen for newly added commands
    if(change.type !== "added") {
        return;
    }
    //Get the actual command data from firestore
    const commandData = change.doc.data();
    //Firestore id of the command document
    const commandDocumentId = change.doc.id;
    //Remove the command and archive it asynchronously
    commandsCollection.doc(change.doc.id).delete()
        .then(()=>{
            commandHistoryCollection.doc(commandDocumentId).set(commandData)
        });
    //Execute the command
    switch(commandData.target){
        case "room":
            executeRoomCommand(hueAPIClient, commandData);
            break;
        case "light":
            executeLightCommand(hueAPIClient, commandData)
            break;
    }
}
async function start(){
    hueAPIClient = await connectHue(HUE_USERNAME, HUE_BASE_STATION_NAME, HUE_BASE_STATION_IP_ADDRESS);
    console.log("Hue connected");
    lights = await sync(hueAPIClient, roomsCollection, lightsCollection);
    console.log("Hue synced");
    console.log("Listening for commands");
    commandsCollection
        .onSnapshot(querySnapshot => {
            querySnapshot.docChanges()
                .forEach(commandAdded)
        });
}
start();
