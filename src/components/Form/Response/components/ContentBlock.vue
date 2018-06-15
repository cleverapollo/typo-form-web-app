<template>
  <v-flex xs12>
    <div v-html="message"></div>
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
