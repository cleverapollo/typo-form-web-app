<template>
  <v-layout row>
    <v-flex xs12>
      <v-text-field
        :value="message"
        counter
        textarea
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

<style scoped>
  .question-group .input-group.input-group--textarea {
    padding-top: 0px;
  }

  .question-group .input-group.input-group--textarea .input-group__input {
    border: 1px solid rgba(0,0,0,.42);
    padding: 15px;
  }
</style>
