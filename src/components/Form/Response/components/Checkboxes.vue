<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-layout row v-for='(answer, index) in answers' :key='"Option " + index' class='"item" + index'>
        <v-checkbox 
          color="info"
          :label="answer.answer" 
          v-model='checkAnswers' 
          :value="answer.id" 
          @change="onSave(answer.id)"
          hide-details
          ></v-checkbox>
      </v-layout>
    </v-flex>
    <v-flex xs12 class='error' v-show='validate() !== true'>
      {{ validate() }}
    </v-flex>
  </v-layout>
</template>

<script>
  import validationMixin from '../ResponseValidationMixin'

  export default {
    name: 'checkboxes',
    mixins: [validationMixin],
    props: ['question', 'answers', 'responses', 'submissionId'],
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
    watch: {
      submissionId (value) {
        this.checkAnswers = this.responses.map((response) => {
          return response.answer_id
        })
      }
    },
    methods: {
      checkAble (answerId) {
        const index = this.responses.findIndex((response) => {
          return response.answer_id === answerId
        })
        return index !== -1
      },
      responseIdFromAnswer (answerId) {
        const response = this.responses.find((response) => {
          return response.answer_id === answerId
        })
        return response.id
      },
      onSave (answerId) {
        if (!this.checkAble(answerId)) {
          this.$emit('create-response', [answerId, null])
        } else {
          this.$emit('delete-response', this.responseIdFromAnswer(answerId))
        }
      }
    }
  }
</script>
