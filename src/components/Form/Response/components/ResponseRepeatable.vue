<template>
  <v-layout row wrap justify-space-around>
    <v-flex xs10 offset-xs2 class="pb-3">
      <v-layout row>
        <v-flex v-for='(column, index) in computedAnswers' :key='"ColumnString " + index'>
          {{ column.answer }}
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout row v-for='(row, index) in computedResponses' :key='"row " + index'>
        <v-flex xs2>
          <v-select
            v-bind:items="computedQuestions"
            v-model="selectedOptions[index]"
            item-text="question"
            item-value="id"
            @change="onChangedRow(index)"
            label="Select"
            single-line
            bottom
          ></v-select>
        </v-flex>
        <v-text-field v-for='(column, index2) in computedAnswers' :key='"column " + index2'
                      :value="getResponseValue(index, column.id)"
                      @change="onChangedColumn(index, column.id, $event)"></v-text-field>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'response-repeatable',
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
      },
      'responses': {
        default: []
      }
    },
    components: {},
    data () {
      return {
        minRowsCount: this.minRows,
        maxRowsCount: this.maxRows,
        selectedOptions: []
      }
    },
    methods: {
      getResponseValue (rowindex, answerid) {
        const $this = this
        let response = this.responses.find((response) => {
          return response.question_id === $this.selectedOptions[rowindex] && response.answerid === answerid
        })
        if (response) {
          return response.response
        }
        return ''
      },
      onChangedRow (rowindex) {
        const $this = this
        let responses = this.responses.filter((response) => {
          return response.question_id === $this.selectedOptions[rowindex]
        })
        responses.forEach((response) => {
          $this.$emit('update-response', [response.answer_id, response.response, response.id, $this.selectedOptions[rowindex]])
        })
      },
      onChangedColumn (rowindex, answerid, value) {
        const $this = this
        let response = this.response.find((response) => {
          return response.question_id === $this.selectedOptions[rowindex] && response.answer_id === answerid
        })
        if (response) {
          this.$emit('update-response', [response.answer_id, response.response, response.id, this.selectedOptions[rowindex]])
        } else {
          this.$emit('create-response', [answerid, value, this.selectedOptions[rowindex]])
        }
      }
    },
    mounted () {
      if (!this.responses.length) {
        this.$emit('create-response', [this.computedAnswers[0].id, '', this.computedQuestions[0].id])
      }
      let options = []
      if (this.computedResponses.length) {
        this.computedResponses.forEach((response, index) => {
          options[index] = response.question_id
        })
      } else {
        options[0] = this.computedQuestions[0].id
      }
      this.selectedOptions = options
    },
    computed: {
      computedResponses () {
        if (this.responses.length) {
          let responses = []
          var index = 0
          var temp = this.responses[0]
          this.responses.forEach((response) => {
            if (response.order !== temp.order) index++
            responses[index] = response
            temp = response
          })
          return responses
        }
        return []
      },
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
