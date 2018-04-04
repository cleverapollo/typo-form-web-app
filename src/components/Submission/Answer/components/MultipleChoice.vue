<template>
  <draggable v-model='computedOptions' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px'>
    <v-radio-group row >
      <v-radio v-for='(optionString, index) in computedOptions' :key='"Option " + index' :label="optionString" :value="'radio-1'+index" ></v-radio>
    </v-radio-group>
  </draggable>
</template>

<script>
//  import * as _ from 'lodash'
  export default {
    name: 'multiple-choice',
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
    methods: {
    },
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
  .radio-wrapper {
    display: inline-block;
  }
  .radio-wrapper > i {
    margin-top: 1em;
    margin-right: 0.3em;
  }
  .input-wrapper {
    display: inline-block;
    width: 70%;
  }
  .close-wrapper {
    display: inline-block;
    padding: 0.5em;
  }
  .actions {
    display: flex;
  }
  .actions > .input-wrapper {
    width: 6em;
  }
</style>
