<template>
  <b-container class="home">
    <!--<router-link to="/rooms">
      Rooms
    </router-link>-->
    <b-row>
      <RoomElement
        v-for="room in rooms" v-bind:key="room.id"
        :room="room"
        :lights="lights"
      />
    </b-row>
  </b-container>
</template>

<script>
  // @ is an alias to /src
  import firebase from 'firebase'
  import RoomElement from "../components/RoomElement";

  const States = require("fire-hue-common/enum/states");
  const {LightCommand} = require("fire-hue-common/types");

  export default {
    name: 'Home',
    components: {
      RoomElement
    },
    data: () => {
      return {
        firestore: null,
        commandsCollection: null,
        lights: [],
        rooms: []
      }
    },
    methods:{
      rgbToHex(rgb) {
        if(!rgb){
          return null;
        }
        rgb = `rgb(${rgb.red},${rgb.green},${rgb.blue}`;
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
          ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
      }
    },
    async created () {
      this.firestore = firebase.firestore();
      this.commandsCollection = this.firestore.collection('commands');
      const roomsCollection = this.firestore.collection('rooms');
      const lightsCollection = this.firestore.collection('lights');
      const lightsSnapshot = await lightsCollection.get();
      const roomsSnapshot = await roomsCollection.get();
      const rooms = roomsSnapshot.docs.map(doc=> doc.data());
      const lights = lightsSnapshot.docs.map(doc=> doc.data());
      const lightMap = {};
      lights.forEach((light)=>{
        lightMap[light.id] = light;
      });

      rooms.forEach((room)=>{
        room.commands = [];
        room.lights.forEach((light)=>{
          room.commands.push(new LightCommand(States.OFF, light, this.rgbToHex(lightMap[light].color), 0, this.commandsCollection))
        });
      });

      this.lights = lightMap;
      this.rooms = rooms;
    }
  }
</script>

<style>
  .power-button{
    width: 100%
  }
</style>
