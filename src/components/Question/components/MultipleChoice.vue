<template>
  <div>
    <v-layout row v-for='(optionString, index) in computedOptions' :key='"Option " + index' class='"item" + index'>
      <div class='radio-wrapper'>
        <i aria-hidden="true" class="icon icon--selection-control material-icons">radio_button_unchecked</i>
      </div>
      <div class='input-wrapper'>
        <v-text-field
          autofocus
          :value='optionString'
        ></v-text-field>
      </div>
      <div class='close-wrapper' v-show='computedOptions.length > 1'>
        <v-btn flat icon @click='removeOption(index)'>
          <v-icon>close</v-icon>
        </v-btn>
      </div>
    </v-layout>
    <v-layout row v-show='computedHasOther'>
      <div class='radio-wrapper'>
        <i aria-hidden="true" class="icon icon--selection-control material-icons">radio_button_unchecked</i>
      </div>
      <div class='input-wrapper'>
        <v-text-field
          disabled
          value='Other...'
        ></v-text-field>
      </div>
      <div class='close-wrapper'>
        <v-btn flat icon @click='unsetHasOther()'>
          <v-icon>close</v-icon>
        </v-btn>
      </div>
    </v-layout>
    <div class='actions'>
      <div class='radio-wrapper'>
        <i aria-hidden="true" class="icon icon--selection-control material-icons">radio_button_unchecked</i>
      </div>
      <div class='input-wrapper'>
        <v-text-field
          value='Add option'
          @click='addOption'
        ></v-text-field>
      </div>
      <div v-show='!computedHasOther' style="padding: 1.6em 0 0 1.6em">
        or
      </div>
      <div v-show='!computedHasOther' style="padding: 9px 0">
        <v-btn flat color="primary" @click='setHasOther'>add "other"</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import * as _ from 'lodash'

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
