<template>
  <b-col
    sm="12"
    class="room-element mt-2 ml-3 mr-3"
    :style='"background-color: "+getBackgroundColor()'
  >
    <b-row>
      <b-col sm="6" class="room-element-name">
        <span class="align-middle">{{room.name}}</span>
      </b-col>
      <b-col sm="6">
        <b-row>
          <b-col cols="3" class="mt-3">
            <SwitchElement
              v-on:on="roomOn"
              v-on:off="roomOff"
            />
          </b-col>
          <b-col cols="3" class="mt-3">
            <b-input  type="color" @change="roomColor(room, $event)" />
          </b-col>
          <b-col cols="6" class="mt-3">
            <b-button v-if="beAnnoying" variant="success" v-on:click="notAnnoying()">Stop</b-button>
            <b-button v-else variant="danger" v-on:click="annoying(room)">Be Annoying</b-button>
          </b-col>
          <b-col cols="12" class="mt-3">
            <b-button @click="toggleLights">{{showLights ? "Hide Lights" : "Show Lights"}}</b-button>
          </b-col>
          <b-col cols="12" class="mt-3">
            <b-input type="range" @change="roomBrightness(room, $event)"/>
          </b-col>
        </b-row>
      </b-col>
      <Light
        v-if="showLights"
        v-for="(command, commandIndex) in room.commands"
        v-bind:key="command.id"
        :light="lights[command.id]"
        :command="command"
        :commandIndex="commandIndex"
        :room="room"
        v-on:lightOn="lightOn"
        v-on:lightOff="lightOff"
        v-on:setColor="setColor"
        v-on:setBrightness="setBrightness"
      />
    </b-row>
  </b-col>
</template>

<script>
  import Light from "./Light";
  import blend_colors from "../../blendColors";
  import SwitchElement from "./SwitchElement";

  const States = require("fire-hue-common/enum/states");

  export default {
    name: 'RoomElement',
    components: { Light, SwitchElement },
    data: ()=>{
      return {
        beAnnoying: false,
        showLights: false
      }
    },
    props: {
      room: Object,
      lights: Object
    },
    methods:{
      toggleLights(){
        this.showLights = !this.showLights;
      },
      getBackgroundColor(){
        const colors = [];
        this.room.commands.forEach((command)=>{
          if(command.color){
            colors.push(command.color);
          }
        });
        if(colors.length <= 1){
          console.log("not enough color");
          return "#000000"
        }
        let avgColor = colors[0];
        console.log("avg", avgColor);
        for(let i = 1; i<colors.length; i++){
          const color = colors[i];
          avgColor = blend_colors(avgColor, color, 0.5)
        }
        return avgColor;
      },
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
      roomOn(){
        console.log("on");
        this.room.commands.forEach((command, i)=>{
          this.room.commands[i].setState(States.ON)
        })
      },
      roomOff(){
        console.log("off");
        this.room.commands.forEach((command, i)=>{
          this.room.commands[i].setState(States.OFF);
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
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .room-element{
    border-radius: 8px;
    border: 1px black solid;
  }
  .room-element-name {
    color: white;
    display: flex;
    align-items: center;
  }
  .room-element-name span{
    font-size: 28px;
  }


</style>
