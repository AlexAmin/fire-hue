<template>
  <b-container class="home">
    <router-link to="/rooms">
      Rooms
    </router-link>
    <div v-for="light in this.lights" v-bind:key="light.id">
      {{light.name}}
      <button v-on:click="lightOn(light)">On</button>
      <button v-on:click="lightOff(light)">Off</button>
    </div>
  </b-container>
</template>

<script>
  // @ is an alias to /src
  import firebase from 'firebase'

  const States = require("fire-hue-common/enum/states");
  const {LightCommand} = require("fire-hue-common/types");

  export default {
    name: 'Home',
    components: {
    },
    data: () => {
      return {
        firestore: null,
        lights: [],
        rooms: []
      }
    },
    methods:{
      lightOn(light){
        const commandsCollection = this.firestore.collection('commands');
        const command = new LightCommand(States.ON, light.id, null);
        commandsCollection.add(command.toObject())
      },
      lightOff(light){
        const commandsCollection = this.firestore.collection('commands');
        const command = new LightCommand(States.OFF, light.id, null);
        console.log(command.toObject());
        commandsCollection.add(command.toObject())
      }
    },
    async created () {
      this.firestore = firebase.firestore();
      const roomsCollection = this.firestore.collection('rooms');
      const lightsCollection = this.firestore.collection('lights');
      const lightsSnapshot = await lightsCollection.get();
      const roomsSnapshot = await roomsCollection.get();
      const rooms = roomsSnapshot.docs.map(doc=> doc.data());
      const lights = lightsSnapshot.docs.map(doc=> doc.data());
      this.lights = lights;
      this.rooms = rooms;
    }
  }
</script>
