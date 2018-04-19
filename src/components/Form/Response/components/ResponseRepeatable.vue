<template>
  <v-layout column wrap class="pl-3 pr-3">
    <v-flex xs8 offset-xs2 class="pb-3">
      <v-layout row>
        <v-flex class="pl-2" v-for="(column, index) in computedAnswers" :key="'ColumnString ' + index">
          {{ column.answer }}
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex xs12>
      <v-layout row v-for="(row, index) in computedResponses" :key="'row ' + index">
        <v-flex xs2>
          <v-select
            v-bind:items="computedQuestions"
            v-model="selectedOptions[index]"
            item-text="question"
            item-value="id"
            @change="onChangedRow(index, row.order, $event)"
            label="Select"
            single-line
            bottom
          ></v-select>
        </v-flex>

        <v-flex xs8>
          <v-layout row wrap>
            <v-flex v-for="(column, index2) in computedAnswers" :key="'column ' + index2">
              <v-text-field style="width: 70px" class="pl-2" :value="getResponseValue(index, column.id, row.order)"
                            @change="onChangedColumn(index, column.id, row.order, $event)"></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs2>
          <v-btn fab dark small color="error" @click="removeResponse(index, row.order)">
            <v-icon dark>remove</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex xs12>
      <v-btn dark class="primary" @click="createResponse">
        <v-icon>add</v-icon>
      </v-btn>
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
      getResponseValue (rowindex, answerId, order) {
        const $this = this
        let response = this.responses.find((response) => {
          return response.question_id === $this.selectedOptions[rowindex] && response.answer_id === answerId && response.order === order
        })
        if (response) {
          return response.response
        }
        return ''
      },
      orderByResponses () {
        const length = this.computedResponses.length
        if (length) {
          return this.computedResponses[length - 1].order + 1
        } else {
          return 1
        }
      },
      createResponse () {
        this.$emit('create-response', [this.computedAnswers[0].id, '', this.computedQuestions[0].id, this.orderByResponses()])
        this.selectedOptions.push(this.computedQuestions[0].id)
      },
      removeResponse (rowindex, order) {
        const $this = this
        let responses = this.responses.filter((response) => {
          return response.question_id === $this.selectedOptions[rowindex] && response.order === order
        })
        responses.forEach((response) => {
          $this.$emit('delete-response', [response.id, response.question_id])
        })
      },
      onChangedRow (rowindex, order, value) {
        const $this = this
        let responses = this.responses.filter((response) => {
          return response.question_id === $this.selectedOptions[rowindex] && response.order === order
        })
        responses.forEach((response) => {
          $this.$emit('update-response', [response.answer_id, response.response, response.id, value, order])
        })
      },
      onChangedColumn (rowindex, answerId, order, value) {
        const $this = this
        let response = this.responses.find((response) => {
          return response.question_id === $this.selectedOptions[rowindex] && response.answer_id === answerId && response.order === order
        })

        if (response) {
          this.$emit('update-response', [response.answer_id, value, response.id, this.selectedOptions[rowindex], order])
        } else {
          this.$emit('create-response', [answerId, value, this.selectedOptions[rowindex], this.computedResponses[rowindex].order])
        }
      }
    },
    mounted () {
      if (!this.responses.length) {
        this.createResponse()
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
