<template>
  <v-layout row>
    <v-flex xs12>
      <v-text-field
        label="Message"
        v-model="message"
        counter
        max="120"
        full-width
        multi-line
        single-line
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'paragraph',
    data: () => ({
      message: ''
    })
  }
</script>

<style scoped>

</style>
