<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div v-on:click="startedUploading">
        <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"
                      v-on:vdropzone-drop="startedUploading"
                      v-on:vdropzone-success="onUploaded"></vue-dropzone>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  import vue2Dropzone from 'vue2-dropzone/dist/vue2Dropzone.js'
  import 'vue2-dropzone/dist/vue2Dropzone.css'

  const API_URL = process.env.API_URL

  export default {
    name: 'fileupload',
    props: ['question', 'submissionId', 'responses', 'disabled'],
    components: {
      vueDropzone: vue2Dropzone
    },
    computed: {
      label () {
        if (this.responses.length) {
          const str = this.responses[0].response.split('_', 2)

          return '<h3 style="color:black">' + str[1] + ' is uploaded</h3>'
        } else {
          return 'Please Drag and Drop'
        }
      },
      dropzoneOptions () {
        return {
          url: API_URL + 'file',
          thumbnailWidth: 150,
          dictDefaultMessage: this.label,
          headers: {'API-Token': localStorage.getItem('token')}
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
    },
    mounted () {
      if (this.disabled) {
        this.$refs.myVueDropzone.disable()
      }
    }
  }
</script>
