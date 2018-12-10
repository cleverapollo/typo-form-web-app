<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-radio-group v-model="optionModel">
        <template v-for='(answer, index) in answers'>
          <v-radio
            color="info"
            :disabled="disabled"
            :key='"Option " + index'
            :label="answer.answer"
            :value="answer.id"
            @change="onSave(answer.id)"
          >
          </v-radio>
        </template>
      </v-radio-group>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'multiple-choice',
    props: ['question', 'answers', 'responses', 'disabled'],
    data () {
      return {
        optionModel: this.responses.length ? this.responses[0].answer_id : '',
        responseValue: null
      }
    },
    mounted () {
      if (this.responses.length) {
        this.responseValue = this.responses[0].response
      }
    },
    methods: {
      onSave (answerId) {
        if (this.responses.length) {
          this.responseValue = null
          this.$emit('update-response', [answerId, null, this.responses[0].id])
        } else {
          this.$emit('create-response', [answerId, null])
        }
      },
      onUpdate (answerId) {
        if (this.responses.length) {
          this.$emit('update-response', [answerId, this.responseValue, this.responses[0].id])
        }
      }
    }
  }
</script>

<style>
  .question-group .v-input--radio-group .v-input__control {
    width:100%;
  }
  .question-group .v-input--radio-group .v-input__control .v-text-field__slot .v-label {
    top:6px;
  }
  .question-group .v-input--radio-group .v-input__control .v-text-field__slot .v-label.v-label--active {
    top:12px;
  }
  .question-group .radio-other {
    position:relative;
    top:-20px;
  }
</style>
