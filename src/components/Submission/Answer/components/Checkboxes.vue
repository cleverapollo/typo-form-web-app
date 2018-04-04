<template>
  <div>
    <v-layout row v-for='(optionString, index) in computedOptions' :key='"Option " + index' class='"item" + index'>
      <v-checkbox :label="optionString" v-model="checkAble"></v-checkbox>
    </v-layout>
  </div>
</template>

<script>
//  import * as _ from 'lodash'

  export default {
    name: 'checkboxes',
    props: {
      'options': {
        default: function () {
          return []
        }
      },
      'hasOther': {
        default: false
      }
    },
    data () {
      return {
        checkAble: false
      }
    },
    methods: {},
    mounted () {
      if (this.options.length === 0) {
        this.computedOptions = [
          'Option 1'
        ]
      }
    },
    computed: {
      computedOptions: {
        get: function () {
          return this.options
        },
        set: function (options) {
          this.$emit('update-options', options)
        }
      }
    }
  }
</script>

<style scoped>
  .radio-wrapper > i {
    margin-top: 1em;
    margin-right: 0.3em;
  }
</style>
