<template>
  <v-layout row>
    <v-flex xs4>
      <v-menu
        lazy
        :close-on-content-click="false"
        v-model="menu"
        transition="scale-transition"
        offset-y
        full-width
        :nudge-right="40"
        max-width="290px"
        min-width="290px"
      >
        <v-text-field
          slot="activator"
          label="Picker in time"
          v-model="time"
          prepend-icon="access_time"
          readonly
        ></v-text-field>
        <v-time-picker v-model="time" autosave></v-time-picker>
      </v-menu>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'time-component',
    data () {
      return {
        time: null,
        menu: false
      }
    }
  }
</script>

<style scoped>

</style>
