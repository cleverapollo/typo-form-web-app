<template>
	<div>
		File Upload
	</div>
</template>

<script>
  export default {
    name: 'fileupload',
    props: {
      'answers': {
        default: function () {
          return []
        }
      }
    },
    mounted () {
      if (this.answers.length) {
        this.$emit('delete-answers')
      }
    }
  }
</script>

<style scoped>

</style>
