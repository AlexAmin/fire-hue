<template>
  <div class="home">
    <div v-for="light in this.lights" v-bind:key="light.id">
      {{light.name}}
    </div>
  </div>
</template>

<script>
  // @ is an alias to /src
  import firebase from 'firebase'

  export default {
    name: 'Home',
    components: {
    },
    data: () => {
      return {
        lights: [],
        rooms: []
      }
    },
    async created () {
      const db = firebase.firestore();
      const roomsCollection = db.collection('rooms');
      const lightsCollection = db.collection('lights');
      const lightsSnapshot = await lightsCollection.get();
      const roomsSnapshot = await roomsCollection.get();
      const rooms = roomsSnapshot.docs.map(doc=> doc.data());
      const lights = lightsSnapshot.docs.map(doc=> doc.data());
      this.lights = lights;
      this.rooms = rooms;
    }
  }
</script>
