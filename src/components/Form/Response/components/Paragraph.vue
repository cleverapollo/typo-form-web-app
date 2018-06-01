<template>
  <v-layout row>
    <v-flex xs12>
      <v-text-field
        :label="question"
        :value="message"
        counter
        max="120"
        full-width
        multi-line
        @change="onSave($event)"
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
  import validationMixin from '../ResponseValidationMixin'

  export default {
    name: 'paragraph',
    mixins: [validationMixin],
    props: ['question', 'answers', 'responses'],
    methods: {
      onSave (value) {
        if (this.responses.length) {
          this.$emit('update-response', [null, value, this.responses[0].id])
        } else {
          this.$emit('create-response', [null, value])
        }
      }
    },
    computed: {
      message () {
        if (this.responses.length) {
          return this.responses[0].response
        }
        return ''
      }
    }
  }
</script>
