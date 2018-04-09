<template>
  <v-layout row wrap justify-space-around>
    <v-flex xs5 style='min-width: 130px'>
      <h3>Rows</h3>
      <draggable v-model='computedQuestions' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px'>
        <v-layout row v-for='(question, index) in computedQuestions' :key='"Option " + index' :class='"item" + index'>
          <v-flex style='max-width: 20px; min-width: 20px' class='mt-4'>
            {{index+1}}.
          </v-flex>
          <v-flex xs10 style='min-width: 60px'>
            <v-text-field
              :value='question.question'
              autofocus
              @change='updateQuestion(question.id, $event)'
            ></v-text-field>
          </v-flex>
          <v-flex style='width: 30px' v-show='computedQuestions.length > 1'>
            <v-btn flat icon @click='deleteQuestion(question.id)' class='mt-3 mx-0'>
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row wrap d-inline-flex>
          <v-flex style='min-width: 20px' class='mt-4'>
            {{computedQuestions.length+1}}.
          </v-flex>
          <v-flex xs10 style='max-width: 80px'>
            <v-text-field
              value='Add Row'
              @click='createQuestion()'
            ></v-text-field>
          </v-flex>
        </v-layout>
      </draggable>
    </v-flex>
    <v-flex xs5 style='min-width: 130px'>
      <h3>Columns</h3>
      <draggable v-model='computedAnswers' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px'>
        <v-layout row v-for='(answer, index) in computedAnswers' :key='"Option " + index' :class='"item" + index'>
          <v-flex xs10 style='min-width: 100px'>
            <v-text-field
              prepend-icon='radio_button_unchecked'
              :value='answer.answer'
              autofocus
              @change='updateAnswer(answer.id, $event)'
            ></v-text-field>
          </v-flex>
          <v-flex style='width: 30px' v-show='computedAnswers.length > 1'>
            <v-btn flat icon @click='deleteAnswer(answer.id)' class='mt-3 mx-0'>
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row wrap d-inline-flex>
          <v-flex style='width: 130px'>
            <v-text-field
              prepend-icon='radio_button_unchecked'
              value='Add Column'
              @click='createAnswer()'
            ></v-text-field>
          </v-flex>
        </v-layout>
      </draggable>
    </v-flex>
  </v-layout>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    name: 'question-repeatable',
    props: {
      'questions': {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    components: {
      draggable
    },
    methods: {
      createQuestion () {
        const question = `Row ${this.computedQuestions.length + 1}`
        this.$emit('create-question', [question, 'Row', 1, true])
      },
      updateQuestion (index, value) {
        this.$emit('update-question', [index, value])
      },
      deleteQuestion (index) {
        this.$emit('delete-question', index)
      },
      createAnswer () {
        const answer = `Column ${this.computedAnswers.length + 1}`
        const questionid = this.questions.find((question) => {
          return question.question === 'Answers'
        }).id
        this.$emit('create-answer', [questionid, answer])
      },
      deleteAnswer (index) {
        const questionid = this.questions.find((question) => {
          return question.question === 'Answers'
        }).id
        this.$emit('delete-answer', [questionid, index])
      },
      updateAnswer (index, value) {
        const questionid = this.questions.find((question) => {
          return question.question === 'Answers'
        }).id
        this.$emit('update-answer', [questionid, index, value])
      }
    },
    computed: {
      computedQuestions () {
        return this.questions.filter((question) => {
          return question.question !== 'Answers'
        })
      },
      computedAnswers () {
        if (!this.questions.length) {
          return []
        }
        return this.questions.find((question) => {
          return question.question === 'Answers'
        }).answers
      }
    }
  }
</script>

<style scoped>

</style>
