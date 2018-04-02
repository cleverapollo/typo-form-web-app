<template>
  <v-layout row>
    <v-flex xs4>
      <v-text-field
        value='Month, day, year'
        append-icon="event"
        disabled
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'date-component'
  }
</script>

<style scoped>

</style>
