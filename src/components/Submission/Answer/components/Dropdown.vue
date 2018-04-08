<template>
  <div>
    <v-layout>
      <v-select
        v-bind:items="computedOptions"
        v-model="selectedOption"
        item-text="answer"
        item-value="id"
        @change="onSave($event)"
        label="Select"
        single-line
        bottom
      ></v-select>
    </v-layout>
  </div>
</template>

<script>
  //  import * as _ from 'lodash'
  export default {
    name: 'dropdown',
    props: ['answers', 'responses'],
    data: () => ({
      selectedOption: null
    }),
    methods: {
      onSave (value) {
        if (this.responses.length) {
          this.$emit('update-response', [null, value, this.responses[0].id])
        } else {
          this.$emit('create-response', [null, value])
        }
      }
    },
    mounted () {
      if (this.responses.length) {
        this.selectedOption = parseInt(this.responses[0].response)
      }
    },
    computed: {
      computedOptions () {
        return this.answers
      }
    }
  }
</script>