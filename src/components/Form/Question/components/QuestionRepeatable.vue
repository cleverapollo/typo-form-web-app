<template>
  <v-layout row wrap justify-space-around>
    <v-flex xs5 style="min-width: 130px">
      <v-text-field label="Minimum rows count" @change="updateRowsCount" v-model="minRowsInput" :rules="[validateMinRows]"></v-text-field>

      <h3>Rows</h3>

      <draggable v-model="computedQuestions" class="dragArea1" :options="{draggable: '.repeatableItem'}" style="min-height: 100px" @end="checkEnd">
        <v-layout row v-for="(question, index) in computedQuestions" :key="'Option ' + index" class="repeatableItem" :class="'item' + question.id">
          <v-flex style="max-width: 20px; min-width: 20px" class="mt-4">
            {{index+1}}.
          </v-flex>

          <v-flex xs10 style="min-width: 60px">
            <v-text-field
              :value="question.question"
              autofocus
              @change="updateQuestion(question.id, $event)"
            ></v-text-field>
          </v-flex>

          <v-flex style="width: 30px" v-show="computedQuestions.length > 1">
            <v-btn flat icon @click="deleteQuestion(question.id)" class="mt-3 mx-0">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>

        <v-layout row wrap d-inline-flex>
          <v-flex style="min-width: 20px" class="mt-4">
            {{computedQuestions.length+1}}.
          </v-flex>

          <v-flex xs10 style="max-width: 80px">
            <v-text-field
              value="Add Row"
              @click="createQuestion()"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </draggable>
    </v-flex>

    <v-flex xs5 style="min-width: 130px">
      <v-text-field label="Maximum rows count" @change="updateRowsCount" v-model="maxRowsInput" :rules="[validateMaxRows]"></v-text-field>

      <h3>Columns</h3>

      <draggable v-model="computedAnswers" class="dragArea2" :options="{draggable:'.repeatableItem'}" style="min-height: 100px" @end="checkEnd">
        <v-layout row v-for="(answer, index) in computedAnswers" :key="'Option ' + index" class="repeatableItem" :class="'item' + answer.id">
          <v-flex xs10 style="min-width: 100px">
            <v-text-field
              prepend-icon="radio_button_unchecked"
              :value="answer.answer"
              autofocus
              @change="updateAnswer(answer.id, $event)"
            ></v-text-field>
          </v-flex>

          <v-flex style="width: 30px" v-show="computedAnswers.length > 1">
            <v-btn flat icon @click="deleteAnswer(answer.id)" class="mt-3 mx-0">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>

        <v-layout row wrap d-inline-flex>
          <v-flex style="width: 130px">
            <v-text-field
              prepend-icon="radio_button_unchecked"
              value="Add Column"
              @click="createAnswer()"
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
      'minRows': {
        default: ''
      },
      'maxRows': {
        default: ''
      }
    },
    components: {
      draggable
    },
    data () {
      return {
        minRowsCount: this.minRows,
        maxRowsCount: this.maxRows
      }
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
        const questionId = this.questions.find((question) => {
          return question.question === 'Answers'
        }).id
        this.$emit('create-answer', [questionId, answer])
      },
      deleteAnswer (index) {
        const questionId = this.questions.find((question) => {
          return question.question === 'Answers'
        }).id
        this.$emit('delete-answer', [questionId, index])
      },
      updateAnswer (index, value) {
        const questionId = this.questions.find((question) => {
          return question.question === 'Answers'
        }).id
        this.$emit('update-answer', [questionId, index, value])
      },
      checkEnd: function (evt) {
        if (evt.to.className !== evt.from.className) {
          return
        }
        if (evt.newIndex === evt.oldIndex) {
          return
        }
        let newIndex = evt.newIndex

        if (evt.newIndex > evt.oldIndex) {
          newIndex = newIndex + 1
        }
        const elementId = parseInt(evt.item.className.substr(30))

        let order = 1
        if (evt.to.className === 'dragArea1') {
          if (this.computedQuestions.length === newIndex) {
            order = this.computedQuestions[newIndex - 1].order + 1
          } else {
            order = this.computedQuestions[newIndex].order
          }
          this.$emit('move-question', [elementId, order])
        } else {
          if (this.computedAnswers.length === newIndex) {
            order = this.computedAnswers[newIndex - 1].order + 1
          } else {
            order = this.computedAnswers[newIndex].order
          }
          const questionId = this.questions.find((question) => {
            return question.question === 'Answers'
          }).id
          this.$emit('move-answer', [questionId, elementId, order])
        }
      },
      validateMinRows (value) {
        this.minRowsInput = parseInt(value)
        if (isNaN(this.minRowsInput)) {
          this.minRowsInput = ''
        }
        if (this.maxRowsInput && this.minRowsInput > this.maxRowsInput) {
          return 'Minimum rows count is set bigger than maximum rows count.'
        } else {
          return true
        }
      },
      validateMaxRows (value) {
        this.maxRowsInput = parseInt(value)
        if (isNaN(this.maxRowsInput)) {
          this.maxRowsInput = ''
        }
        if (this.minRowsInput && this.minRowsInput > this.maxRowsInput) {
          return 'Maximum rows count is set smaller than minimum rows count.'
        } else {
          return true
        }
      },
      updateRowsCount () {
        if (this.validateMinRows(this.minRowsInput) === true && this.validateMaxRows(this.maxRowsInput) === true) {
          this.$emit('update-limitation', {
            'min_rows': this.minRowsInput,
            'max_rows': this.maxRowsInput
          })
        }
      }
    },
    computed: {
      computedQuestions: {
        get () {
          return this.questions.filter((question) => {
            return question.question !== 'Answers'
          }).sort((questionA, questionB) => {
            return questionA.order > questionB.order
          })
        },
        set (value) {
          // TODO: Draggable
        }
      },
      computedAnswers: {
        get () {
          if (!this.questions.length) {
            return []
          }
          return this.questions.find((question) => {
            return question.question === 'Answers'
          }).answers.sort((answerA, answerB) => {
            return answerA.order > answerB.order
          })
        },
        set (value) {
          // TODO: Draggable
        }
      },
      minRowsInput: {
        get: function () {
          return this.minRowsCount
        },
        set: function (value) {
          this.minRowsCount = value
        }
      },
      maxRowsInput: {
        get: function () {
          return this.maxRowsCount
        },
        set: function (value) {
          this.maxRowsCount = value
        }
      }
    }
  }
</script>
