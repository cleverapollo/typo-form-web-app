<template>
  <v-layout row>
    <v-flex xs12>
      <div v-html="message"></div>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    props: ['answers', 'responses'],
    computed: {
      message () {
        if (this.answers.length) {
          return this.answers[0].answer
        }
        return ''
      }
    }
  }
</script>
