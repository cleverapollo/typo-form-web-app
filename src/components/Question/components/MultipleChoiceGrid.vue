<template>
  <v-layout>
    <v-flex xs5>
      <h3>Rows</h3>
      <draggable v-model='rows' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px'>
        <v-layout row v-for='(rowAnswer, index) in rows' :key='"Option " + index' :class='"item" + index'>
          <v-flex style='max-width: 20px; min-width: 20px' class='mt-4'>
            {{index+1}}.
          </v-flex>
          <v-flex xs10 style='min-width: 60px'>
            <v-text-field
              :value='rowAnswer.answer'
              autofocus
              @change='updateAnswer(rowAnswer.id, $event)'
            ></v-text-field>
          </v-flex>
          <v-flex style='width: 30px'  v-show='rows.length > 1'>
            <v-btn flat icon @click='deleteAnswer(index)' class='mt-3'>
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row d-inline-flex>
          <v-flex style='min-width: 20px' class='mt-4'>
            {{rows.length+1}}.
          </v-flex>
          <v-flex xs10 style='max-width: 80px'>
            <v-text-field
              value='Add option'
              @click='createAnswer(false)'
            ></v-text-field>
          </v-flex>
        </v-layout>
      </draggable>
    </v-flex>
    <v-flex xs5 offset-xs1>
      <h3>Columns</h3>
      <draggable v-model='columns' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px'>
        <v-layout row v-for='(columnAnswer, index) in columns' :key='"Option " + index' :class='"item" + index'>
          <v-flex xs10 style='min-width: 120px'>
            <v-text-field
              prepend-icon='radio_button_unchecked'
              :value='columnAnswer.answer'
              autofocus
              @change='updateAnswer(columnAnswer.id, $event)'
            ></v-text-field>
          </v-flex>
          <v-flex style='width: 30px' v-show='columns.length > 1'>
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
              @click='createAnswer(true)'
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
    name: 'multiple-choice-grid',
    props: {
      'answers': {
        default: function () {
          return []
        }
      }
    },
    components: {
      draggable
    },
    methods: {
      createAnswer (parameter) {
        let str = `Row ${this.rows.length + 1}`
        if (parameter) {
          str = `Column ${this.columns.length + 1}`
        }
        this.$emit('create-answer', [str, parameter])
      },
      deleteAnswer (index) {
        this.$emit('delete-answer', this.answers[index].id)
      },
      updateAnswer (index, value) {
        this.$emit('update-answer', [index, value])
      }
    },
    mounted () {
      if (this.answers.length === 0) {
        this.createAnswer(true)
        this.createAnswer(false)
      } else {
        if (this.answers.length === 2 && this.answers[0].answer.substr(0, 11) === 'LinearScale' && this.answers[1].answer.substr(0, 11) === 'LinearScale') {
          this.$emit('delete-answers')
        } else {
          const lastAnswer = this.answers[this.answers.length - 1]
          const firstAnswer = this.answers[0]
          if (!lastAnswer.parameter && lastAnswer.answer === 'Other...') {
            this.$emit('change-answer')
          }
          if (lastAnswer.parameter) {
            this.createAnswer(false)
          }
          if (!firstAnswer.parameter) {
            this.createAnswer(true)
          }
        }
      }
    },
    computed: {
      rows () {
        return this.answers.filter(e => {
          return !e.parameter
        })
      },
      columns () {
        return this.answers.filter(e => {
          return e.parameter
        })
      }
    }
  }
</script>
