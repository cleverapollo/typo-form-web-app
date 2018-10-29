<template>
  <div />
</template>
<script>
  export default {
    name: 'Number',
    props: ['answers'],
    mounted () {
      if (this.answers.length) {
        this.$emit('delete-answers')
      }
    }
  }
</script>
