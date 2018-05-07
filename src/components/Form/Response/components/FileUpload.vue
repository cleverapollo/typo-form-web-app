<template>
  <div v-on:click="startedUploading">
    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"
                  v-on:vdropzone-drop="startedUploading"></vue-dropzone>
  </div>
</template>

<script>
  import vue2Dropzone from 'vue2-dropzone/dist/vue2Dropzone.js' // https://rowanwins.github.io/vue-dropzone/docs/dist/index.html#/props
  import 'vue2-dropzone/dist/vue2Dropzone.css'

  const APP_URL = process.env.API_URL

  export default {
    name: 'fileupload',
    props: ['submissionId'],
    components: {
      vueDropzone: vue2Dropzone
    },
    data: function () {
      return {
        dropzoneOptions: {
          url: APP_URL + 'submission/' + this.submissionId + '/response/file',
          thumbnailWidth: 150,
          maxFilesize: 1,
          headers: {'api_token': localStorage.getItem('token')}
        }
      }
    },
    methods: {
      startedUploading () {
        this.$refs.myVueDropzone.removeAllFiles()
      }
    }
  }
</script>
