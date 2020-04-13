<template>
  <b-col
    sm="12"
    class="room-element"
    :style='"background-color: "+getBackgroundColor()'
  >
    <b-row>
      <b-col sm="6">
        <h2>{{room.name}}</h2>
      </b-col>
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

  const States = require("fire-hue-common/enum/states");

  export default {
    name: 'RoomElement',
    components:{Light},
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
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .room-element{
    border-radius: 8px;

  }
</style>
