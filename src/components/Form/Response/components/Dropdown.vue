<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-autocomplete
        v-bind:items="computedOptions"
        v-model="selectedOption"
        item-text="answer"
        item-value="id"
        :disabled="disabled"
        @change="onSave($event)"
      ></v-autocomplete>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'dropdown',
    props: ['question', 'answers', 'responses', 'submissionId', 'disabled'],
    data () {
      return {
        selectedOption: this.responses.length ? this.responses[0].answer_id : ''
      }
    },
    methods: {
      onSave (value) {
        if (typeof (value) === 'object') {
          return
        }
        if (this.responses.length) {
          this.$emit('update-response', [value, null, this.responses[0].id])
        } else {
          this.$emit('create-response', [value, null])
        }
      }
    },
    computed: {
      computedOptions () {
        return this.answers
      }
    }
  }
</script>
