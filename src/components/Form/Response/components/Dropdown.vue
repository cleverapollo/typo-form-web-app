<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div class="subheading">{{ question }}</div>
    </v-flex>
    <v-flex xs12>
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
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'dropdown',
    props: ['question', 'answers', 'responses', 'submissionId'],
    data () {
      return {
        selectedOption: null
      }
    },
    watch: {
      submissionId (value) {
        if (this.responses.length) {
          this.selectedOption = parseInt(this.responses[0].response)
        }
      }
    },
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
