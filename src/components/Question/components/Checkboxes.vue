<template>
  <draggable v-model='computedOptions' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px'>
    <v-layout row v-for='(optionString, index) in computedOptions' :key='"Option " + index' class='"item" + index'>
      <div class='radio-wrapper'>
        <i aria-hidden="true" class="icon icon--selection-control material-icons">check_box_outline_blank</i>
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
        <i aria-hidden="true" class="icon icon--selection-control material-icons">check_box_outline_blank</i>
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
        <i aria-hidden="true" class="icon icon--selection-control material-icons">check_box_outline_blank</i>
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
    <v-layout v-if='mandatory'>
      <v-flex xs4>
        <v-text-field
          name='min-answer-count'
          label='Minimum answer count'
          v-model='minAnswerCount'
          mask='###'
        ></v-text-field>
      </v-flex>
      <v-flex xs3 offset-xs1>
        <v-text-field
          name='max-answer-count'
          label='Maximum answer count'
          v-model='maxAnswerCount'
          mask='###'
        ></v-text-field>
      </v-flex>
    </v-layout>
  </draggable>
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
      },
      'mandatory': {
        type: Boolean,
        default: false
      }
    },
    components: {
      draggable
    },
    data () {
      return {
        minAnswerCount: 0,
        maxAnswerCount: 0
      }
    },
    methods: {
      addOption () {
        this.computedOptions.push(`Option ${this.computedOptions.length + 1}`)
      },
      removeOption (index) {
        const options = _.remove(this.computedOptions, (item, n) => { return n !== index })
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
