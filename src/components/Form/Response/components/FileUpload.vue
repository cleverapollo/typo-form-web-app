<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-progress-linear v-model="progress" v-if="progress"></v-progress-linear>
      <v-btn raised class="primary" @click="onPickFile">Upload File</v-btn>
      <input
        type="file"
        style="display: none"
        ref="fileInput"
        accept="*"
        @change="onFilePicked">
      <v-btn v-if="imageUrl" class="primary" @click="onDownload">Download</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
  const API_URL = process.env.API_URL
  export default {
    name: 'fileupload',
    props: ['question', 'submissionId', 'responses', 'disabled'],
    data () {
      return {
        progress: 0,
        imageUrl: this.responses.length ? this.responses[0].response : null
      }
    },
    methods: {
      onDownload () {
        const AWS = require('aws-sdk')
        process.hrtime = require('browser-process-hrtime')
        AWS.config.update(
          {
            accessKeyId: 'AKIAJWM47OALHVXO3LMA',
            secretAccessKey: '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'
          }
        )
        // AWS.config.region = 'ap-southeast-2'
        var s3 = new AWS.S3({apiVersion: '2006-03-01'})
        s3.getObject(
          { Bucket: 'informed365', Key: this.imageUrl.split('https://informed365.s3.ap-southeast-2.amazonaws.com/')[1] },
          (error, data) => {
            if (error != null) {
              alert('Failed to retrieve an object: ' + error)
            } else {
              // alert('Loaded ' + data.ContentLength + ' bytes')
              console.log(data.Body)
              // do something with data.Body
            }
          }
        )
      },
      onPickFile () {
        if (!this.disabled) {
          this.$refs.fileInput.click()
        }
      },
      onFilePicked (event) {
        const files = event.target.files
        let filename = files[0].name
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please add a valid file!')
        }

        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('progress', (event) => {
          this.progress = event.total * 100 / event.loaded
        }, false)

        let formData = new FormData()
        formData.append('file', files[0])
        const config = {
          headers: {'content-type': 'multipart/form-data'}
        }

        window.axios.post(API_URL + 'file', formData, config)
          .then(
            response => {
              if (this.responses.length) {
                this.$emit('update-response', [null, response.data.path, this.responses[0].id])
              } else {
                this.$emit('create-response', [null, response.data.path])
              }
              this.imageUrl = response.data.path
              this.progress = 0
            }
          )
      }
    }
  }
</script>
