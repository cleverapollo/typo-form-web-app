<template>
	<v-layout column>
    <v-layout row class='height-75'>
      <v-flex xs8 class='vertical-middle'>
        Allow only specific file types
      </v-flex>
      <v-flex xs2 class='vertical-middle'>
        <v-switch hide-details v-model='config.specificFileType'></v-switch>
      </v-flex>
    </v-layout>
    <v-layout row class='height-75'>
      <v-flex xs8 class='vertical-middle'>
        Maximum number of files
      </v-flex>
      <div class='sel-number vertical-middle'>
        <v-select v-model='config.maxFilesNumber' :items='maxFilesNumberOptions'></v-select>
      </div>
    </v-layout>
    <v-layout row class='height-75'>
      <v-flex xs8 class='vertical-middle'>
        Maximum file size
      </v-flex>
      <div class='vertical-middle sel-size'>
        <v-select v-model='config.maxFileSize' :items='maxFileSizeOptions'></v-select>
      </div>
    </v-layout>
  </v-layout>
</template>

<script>
  export default {
    name: 'file-upload',
    props: {
      'answers': {
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        config: {
          specificFileType: false,
          maxFilesNumber: 1,
          maxFileSize: '10 MB'
        },
        maxFilesNumberOptions: [1, 5, 10],
        maxFileSizeOptions: ['1 MB', '10 MB', '100 MB', '1 GB', '10 GB']
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
  .height-75 {
    height: 75px;
  }
  .vertical-middle {
    display: flex;
    align-items: center;
  }
  .sel-number {
    width: 60px;
  }
  .sel-size {
    width: 100px;
  }
</style>
