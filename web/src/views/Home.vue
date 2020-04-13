<template>
  <b-container class="home">
    <!--<router-link to="/rooms">
      Rooms
    </router-link>-->
    <b-row>
      <b-col sm="12" v-for="room in rooms" v-bind:key="room.id">
        <b-row>
          <b-col sm="12">
            <b-card>
              <b-card-body>
                <b-card-body></b-card-body>
                <h2>{{room.name}}</h2>
                <b-row>
                  <b-col sm="6">
                    <b-button class="power-button" v-on:click="roomOn(room)">On</b-button>
                  </b-col>
                  <b-col sm="6">
                    <b-button class="power-button" v-on:click="roomOff(room)">Off</b-button>
                  </b-col>
                  <b-col sm="12">
                    <b-input class="mt-2" type="color" @change="roomColor(room, $event)" />
                  </b-col>
                  <b-col sm="12">
                    <b-input class="mt-2" type="range" @change="roomBrightness(room, $event)"/>
                  </b-col>
                  <b-col class="mt-3">
                    <b-button v-if="beAnnoying" variant="success" v-on:click="notAnnoying()">Stop</b-button>
                    <b-button v-else variant="danger" v-on:click="annoying(room)">Be Annoying</b-button>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-col>
          <b-col sm="4" class="mt-3" v-for="(command, commandIndex) in room.commands" v-bind:key="command.id">
            <b-card>
              <b-card-body>
                <b-row>
                  <b-col sm="12">
                    <h3>{{lights[command.id].name}}</h3>
                  </b-col>
                  <b-col sm="6" class="mt-2">
                    <b-button class="power-button" :variant="command.state === getStates().ON ? 'success' : 'secondary'" v-on:click="lightOn(room, commandIndex)">On</b-button>
                  </b-col>
                  <b-col sm="6" class="mt-2">
                    <b-button class="power-button" :variant="command.state === getStates().OFF ? 'danger' : 'secondary'"  v-on:click="lightOff(room, commandIndex)">Off</b-button>
                  </b-col>
                  <b-input type="color" v-model="command.color" @change="setColor(room, commandIndex, $event)" />
                  <b-input type="range" min="0" max="100" step="10" v-model="command.brightness" @change="setBrightness(room, commandIndex, $event)"/>
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
        rooms: [],
        beAnnoying: false
      }
    },
    methods:{
      lightOn(room, commandIndex){
        room.commands[commandIndex].setState(States.ON);
      },
      lightOff(room, commandIndex){
        room.commands[commandIndex].setState(States.OFF);
      },
      setColor(room, commandIndex, event){
        room.commands[commandIndex].setColor(event);
      },
      setBrightness(room, commandIndex, event){
        room.commands[commandIndex].setBrightness(event);
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
        room.commands.forEach((command, i)=>{
          room.commands[i].setColor(event);
        })
      },
      roomBrightness(room, event){
        room.commands.forEach((command, i)=>{
          room.commands[i].setBrightness(event);
        })
      },
      getStates(){
        return States;
      },
      getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      async wait(timeMS){
        return await new Promise((resolve, reject)=>{setTimeout(()=>{resolve()},timeMS)})
      },
      async annoying(room){
        this.beAnnoying = true;
        this.roomOn(room);
        await this.wait(150);

        const colors = ["#3271A8", "#ff5733", "#b233ff", "#ff3333", "#33ff4f", "#FFFFFF", "#000000"];
        const brightnesses = [100, 90, 80, 70, 60, 50, 40, 30, 20];
        while(this.beAnnoying) {
          const commandIndex = this.getRandomInt(0, room.lights.length-1);
          const color = colors[this.getRandomInt(0, colors.length-1)];
          const brightness = brightnesses[this.getRandomInt(0, brightnesses.length-1)];
          this.setColor(room, commandIndex, color);
          this.setBrightness(room, commandIndex, brightness);
          await this.wait(300);
        }
      },
      notAnnoying(){
        this.beAnnoying = false;
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
