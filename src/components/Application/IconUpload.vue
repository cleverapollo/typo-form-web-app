<template>
  <div v-on:click="startedUploading">
    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"
                  v-on:vdropzone-drop="startedUploading"
                  v-on:vdropzone-success="onUploaded"></vue-dropzone>
  </div>
</template>

<script>
  import vue2Dropzone from 'vue2-dropzone/dist/vue2Dropzone.js'
  import 'vue2-dropzone/dist/vue2Dropzone.css'

  const APP_URL = process.env.API_URL

  export default {
    name: 'IconUpload',
    props: ['url'],
    components: {
      vueDropzone: vue2Dropzone
    },
    computed: {
      label () {
        if (this.url) {
          const str = this.url.split('_', 2)
          return '<h3 style="color:black">' + str[1] + ' is uploaded</h3>'
        } else {
          return 'Please Drag and Drop to upload Icon'
        }
      },
      dropzoneOptions () {
        return {
          url: APP_URL + 'file',
          thumbnailWidth: 150,
          acceptedFiles: '.jpg, .png',
          dictDefaultMessage: this.label,
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
          this.$emit('update-icon', response.path)
        }
      }
    }
  }
</script>
