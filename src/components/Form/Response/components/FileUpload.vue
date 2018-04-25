<template>
  <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
</template>

<script>
  import vue2Dropzone from 'vue2-dropzone/dist/vue2Dropzone.js' // https://rowanwins.github.io/vue-dropzone/docs/dist/index.html#/props
  import 'vue2-dropzone/dist/vue2Dropzone.css'
  export default {
    name: 'fileupload',
    components: {
      vueDropzone: vue2Dropzone
    },
    data: function () {
      return {
        dropzoneOptions: {
          url: '/file',
          thumbnailWidth: 150,
          maxFilesize: 1
          // headers: { "My-Awesome-Header": "header value" }
        }
      }
    }
  }
</script>
