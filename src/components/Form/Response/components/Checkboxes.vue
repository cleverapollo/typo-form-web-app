<template>
  <div>
    <v-layout row v-for='(answer, index) in answers' :key='"Option " + index' class='"item" + index'>
      <v-checkbox :label="answer.answer" v-model='checkAnswers' :value="answer.id" @change="onSave(answer.id)"></v-checkbox>
    </v-layout>
    <v-flex xs12 class='error' v-show='validate() !== true'>
      {{ validate() }}
    </v-flex>
  </div>
</template>

<script>
  import validationMixin from '../ResponseValidationMixin'

  export default {
    name: 'checkboxes',
    mixins: [validationMixin],
    props: ['answers', 'responses'],
    data () {
      return {
        checkAnswers: []
      }
    },
    mounted () {
      this.checkAnswers = this.responses.map((response) => {
        return response.answer_id
      })
    },
    methods: {
      checkAble (answerid) {
        const index = this.responses.findIndex((response) => {
          return response.answer_id === answerid
        })
        return index !== -1
      },
      responseIdFromAnswer (answerid) {
        const response = this.responses.find((response) => {
          return response.answer_id === answerid
        })
        return response.id
      },
      onSave (answerid) {
        if (!this.checkAble(answerid)) {
          this.$emit('create-response', [answerid, null])
        } else {
          this.$emit('delete-response', this.responseIdFromAnswer(answerid))
        }
      }
    }
  }
</script>
