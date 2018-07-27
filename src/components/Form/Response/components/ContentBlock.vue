<template>
  <v-flex xs12 pb-3 px-3>
    <div v-html="$sanitize(message)"></div>
  </v-flex>
</template>

<script>
  export default {
    props: ['question', 'formId', 'sectionId', 'index'],
    computed: {
      message () {
        return this.question.description
      }
    }
  }
</script>
