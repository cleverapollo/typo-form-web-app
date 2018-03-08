<template>
  <v-alert error dismissible @input="onClose" :value="true">
    <div v-html="text"></div>
  </v-alert>
</template>

<script>
  export default {
    props: ['text'],
    methods: {
      onClose () {
        this.$emit('dismissed')
      }
    }
  }
</script>
