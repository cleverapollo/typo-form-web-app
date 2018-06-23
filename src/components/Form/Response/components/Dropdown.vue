<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-select
        v-bind:items="computedOptions"
        v-model="selectedOption"
        item-text="answer"
        item-value="id"
        @change="onSave()"
        autocomplete
      ></v-select>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'dropdown',
    props: ['question', 'answers', 'responses', 'submissionId'],
    data () {
      return {
        selectedOption: this.responses.length ? this.responses[0].answer_id : ''
      }
    },
    methods: {
      onSave () {
        if (this.responses.length) {
          this.$emit('update-response', [this.selectedOption, null, this.responses[0].id])
        } else {
          this.$emit('create-response', [this.selectedOption, null])
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
