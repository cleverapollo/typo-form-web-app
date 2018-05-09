<template>
  <div v-on:click="startedUploading">
    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"
                  v-on:vdropzone-drop="startedUploading"
                  v-on:vdropzone-success="onUploaded"></vue-dropzone>
  </div>
</template>

<script>
  import vue2Dropzone from 'vue2-dropzone/dist/vue2Dropzone.js' // https://rowanwins.github.io/vue-dropzone/docs/dist/index.html#/props
  import 'vue2-dropzone/dist/vue2Dropzone.css'

  const APP_URL = process.env.API_URL

  export default {
    name: 'fileupload',
    props: ['submissionId', 'responses'],
    components: {
      vueDropzone: vue2Dropzone
    },
    data: function () {
      return {
        dropzoneOptions: {
          url: APP_URL + 'file',
          thumbnailWidth: 150,
//          maxFilesize: 1,
          headers: {'api_token': localStorage.getItem('token')}
        }
      }
    },
    methods: {
      startedUploading () {
        this.$refs.myVueDropzone.removeAllFiles()
      },
      onUploaded (file, response) {
        if (response.status === 'success') {
          if (this.responses.length) {
            this.$emit('update-response', [null, response.path, this.responses[0].id])
          } else {
            this.$emit('create-response', [null, response.path])
          }
        }
      }
    }
  }
</script>
