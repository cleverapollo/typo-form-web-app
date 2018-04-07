<template>
  <v-layout>
    <v-flex xs5 offset-xs1>
      <h3>Questions</h3>
      <draggable v-model='computedQuestions' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px'>
        <v-layout row v-for='(question, index) in computedQuestions' :key='"Option " + index' :class='"item" + index'>
          <v-flex style='max-width: 20px; min-width: 20px' class='mt-4'>
            {{index+1}}.
          </v-flex>
          <v-flex xs10 style='min-width: 60px'>
            <v-text-field
              :value='question.question'
              autofocus
              @change='updateAnswer(question.id, $event)'
            ></v-text-field>
          </v-flex>
          <v-flex style='width: 30px'  v-show='computedQuestions.length > 1'>
            <v-btn flat icon @click='deleteAnswer(index)' class='mt-3'>
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row d-inline-flex>
          <v-flex style='min-width: 20px' class='mt-4'>
            {{computedQuestions.length+1}}.
          </v-flex>
          <v-flex xs10 style='max-width: 80px'>
            <v-text-field
              value='Add option'
              @click='createQuestion()'
            ></v-text-field>
          </v-flex>
        </v-layout>
      </draggable>
    </v-flex>
    <v-flex xs5>
      <h3>Answers</h3>
      <draggable v-model='computedAnswers' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px'>
        <v-layout row v-for='(answer, index) in computedAnswers' :key='"Option " + index' :class='"item" + index'>
          <v-flex xs10 style='min-width: 120px'>
            <v-text-field
              prepend-icon='radio_button_unchecked'
              :value='answer.answer'
              autofocus
              @change='updateAnswer(answer.id, $event)'
            ></v-text-field>
          </v-flex>
          <v-flex style='width: 30px' v-show='computedAnswers.length > 1'>
            <v-btn flat icon @click='deleteAnswer(index)' class='mt-3'>
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row d-inline-flex>
          <v-flex style='width: 125px'>
            <v-text-field
              prepend-icon='radio_button_unchecked'
              value='Add option'
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
      },
      'answers': {
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
      },
      createAnswer () {
      },
      deleteAnswer (index) {
      },
      updateAnswer (index, value) {
      }
    },
    computed: {
      computedQuestions () {
        return this.questions
      },
      computedAnswers () {
        return this.answers
      }
    }
  }
</script>

<style scoped>

</style>
