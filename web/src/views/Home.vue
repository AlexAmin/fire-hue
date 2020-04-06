<template>
  <b-container class="home">
    <router-link to="/rooms">
      Rooms
    </router-link>
    <b-row>
      <b-col sm="12" v-for="room in rooms" v-bind:key="room.id">
        <b-row>
          <b-col sm="12">
            <b-card>
              <b-card-body>
                <b-card-body></b-card-body>
                <h2>{{room.name}}</h2>
                <b-col sm="6">
                  <b-button class="'power-button'" v-on:click="roomOn(room)">On</b-button>
                </b-col>
                <b-col sm="6">
                  <b-button class="'power-button'" v-on:click="roomOff(room)">Off</b-button>
                </b-col>
                <b-input type="color" @change="roomColor(room, $event)" />
                <b-input type="range" @change="roomBrightness(room, $event)"/>
              </b-card-body>
            </b-card>
          </b-col>
          <b-col sm="4" class="mt-3" v-for="command in room.commands" v-bind:key="command.id">
            <b-card>
              <b-card-body>
                <b-row>
                  <b-col sm="12">
                    <h3>{{lights[command.id].name}}</h3>
                  </b-col>
                  <b-col sm="6">
                    <b-button :class="'power-button '" :variant="command.state === getStates().ON ? 'success' : 'secondary'" v-on:click="lightOn(lights[command.id])">On</b-button>
                  </b-col>
                  <b-col sm="6">
                    <b-button :class="'power-button '" :variant="command.state === getStates().OFF ? 'danger' : 'secondary'"  v-on:click="lightOff(lights[command.id])">Off</b-button>
                  </b-col>
                  <b-input type="color" v-model="command.color" @change="roomColor(room, $event)" />
                  <b-input type="range" v-model="command.brightness" @change="roomBrightness(room, $event)"/>
                </b-row>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
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
        commandsCollection: null,
        lights: [],
        rooms: []
      }
    },
    methods:{
      lightOn(light){
        const commandsCollection = this.firestore.collection('commands');
        const command = new LightCommand(States.ON, light.id, null, 100);
        commandsCollection.add(command.toObject())
      },
      lightOff(light){
        const commandsCollection = this.firestore.collection('commands');
        const command = new LightCommand(States.OFF, light.id, null, 100);
        commandsCollection.add(command.toObject())
      },
      colorChanged(light, event){
        const commandsCollection = this.firestore.collection('commands');
        const command = new LightCommand(States.ON, light.id, event.target.value, 100);
        commandsCollection.add(command.toObject())
      },
      brightnessChanged(light, event){
        const commandsCollection = this.firestore.collection('commands');
        const command = new LightCommand(States.ON, light.id, null, event.target.value);
        commandsCollection.add(command.toObject())
      },
      roomOn(room){
        room.commands.forEach((command, i)=>{
          room.commands[i].setState(States.ON)
        })
      },
      roomOff(room){
        room.commands.forEach((command, i)=>{
          room.commands[i].setState(States.OFF);
        })
      },
      roomColor(room, event){
        console.log(room, event);
        room.commands.forEach((command, i)=>{
          room.commands[i].setColor(event);
        })
      },
      roomBrightness(room, event){
        console.log(room, event);
        room.commands.forEach((command, i)=>{
          room.commands[i].setBrightness(event);
        })
      },
      getStates(){
        return States;
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
          room.commands.push(new LightCommand(States.OFF, light, null, 0, this.commandsCollection))
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
