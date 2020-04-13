<template>
  <b-col sm="4" class="mt-3">
    <b-card>
      <b-card-body>
        <b-row>
          <b-col sm="12">
            <h3>{{light.name}}</h3>
          </b-col>
          <b-col sm="6" class="mt-2">
            <b-button class="power-button" :variant="command.state === getStates().ON ? 'success' : 'secondary'" v-on:click="lightOn()">On</b-button>
          </b-col>
          <b-col sm="6" class="mt-2">
            <b-button class="power-button" :variant="command.state === getStates().OFF ? 'danger' : 'secondary'"  v-on:click="lightOff()">Off</b-button>
          </b-col>
          <b-input type="color" v-model="command.color" @change="setColor($event)" />
          <b-input type="range" min="0" max="100" step="10" v-model="command.brightness" @change="setBrightness($event)"/>
        </b-row>
      </b-card-body>
    </b-card>
  </b-col>
</template>

<script>
  const States = require("fire-hue-common/enum/states");

  export default {
    name: 'Light',
    data: ()=>{
      return {
        beAnnoying: false
      }
    },
    props: {
      light: Object,
      command: Object,
      room: Object,
      commandIndex: Number
    },
    methods:{
      getStates(){
        return States;
      },
      lightOn(){
        this.$emit("lightOn", this.room, this.commandIndex)
      },
      lightOff(){
        this.$emit("lightOff", this.room, this.commandIndex)
      },
      setColor(event){
        this.$emit("setColor", this.room, this.commandIndex, event);
      },
      setBrightness(event){
        this.$emit("setBrightness", this.room, this.commandIndex, event);
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
