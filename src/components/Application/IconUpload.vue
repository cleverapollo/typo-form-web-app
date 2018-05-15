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

  const API_URL = process.env.API_URL
  const API_ORIGIN_URL = process.env.API_ORIGIN_URL

  export default {
    name: 'IconUpload',
    props: ['icon'],
    components: {
      vueDropzone: vue2Dropzone
    },
    computed: {
      label () {
        if (this.icon) {
          return '<img src="' + API_ORIGIN_URL + 'uploads/' + this.icon + '" class="icon-preview"/>'
        } else {
          return 'Please Drag and Drop to upload Icon'
        }
      },
      dropzoneOptions () {
        return {
          url: API_URL + 'file',
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
