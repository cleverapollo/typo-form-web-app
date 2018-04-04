<template>
  <div>
    <v-layout row v-for='(optionString, index) in computedOptions' :key='"Option " + index' class='"item" + index'>
      <v-checkbox :label="optionString" v-model="checkAble"></v-checkbox>
    </v-layout>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import * as _ from 'lodash'

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
    components: {
      draggable
    },
    methods: {
      addOption () {
        this.computedOptions.push(`Option ${this.computedOptions.length + 1}`)
      },
      removeOption (index) {
        const options = _.remove(this.computedOptions, (item, n) => {
          return n !== index
        })
        this.computedOptions = options
      },
      setHasOther () {
        this.computedHasOther = true
      },
      unsetHasOther () {
        this.computedHasOther = false
      }
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
      },
      computedHasOther: {
        get: function () {
          return this.hasOther
        },
        set: function (hasOther) {
          this.$emit('update-hasOther', hasOther)
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
