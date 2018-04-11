<template>
  <v-layout column>
    <v-flex xs10 offset-xs2 class="pb-3">
      <v-layout row>
        <v-flex v-for='(column, index) in computedColumns' :key='"OptionString " + index'>{{ column.answer }}</v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout row v-for='(row, index) in computedRows' :key='"row " + index'>
        <v-flex xs2>
          <v-layout row>
            <h3>{{row.answer}}</h3>
          </v-layout>
        </v-flex>
        <v-flex xs10>
          <v-radio-group v-model="checkAnswers[index]" row class="pt-0 pb-0">
            <v-radio v-for='(column, index2) in computedColumns' :key='"column " + index2'
                     :value="column.id" @change="onSave(row.id, column.id)"></v-radio>
          </v-radio-group>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'multiple-choice-grid',
    props: ['answers', 'responses'],
    data () {
      return {
        checkAnswers: []
      }
    },
    mounted () {
      let ex = []
      for (let i = 0; i < this.computedRows.length; i++) {
        const filteredResponses = this.responses.filter((response) => {
          return this.computedRows[i].id === response.answer_id
        })
        if (filteredResponses.length) {
          ex[i] = parseInt(filteredResponses[0].response)
        } else {
          ex[i] = null
        }
      }
      this.checkAnswers = ex
    },
    methods: {
      checked (answerid, response) {
        if (this.responses.length) {
          const objs = this.responses.filter((obj) => {
            return parseInt(obj.response) === response && obj.answer_id === answerid
          })
          if (objs.length) {
            return 'check'
          }
        }
        return 'unchecked'
      },
      isNew (answerid) {
        const index = this.responses.findIndex((response) => {
          return response.answer_id === answerid
        })
        if (index === -1) {
          return false
        } else {
          return true
        }
      },
      responseIdFromAnswer (answerid) {
        const response = this.responses.find((response) => {
          return response.answer_id === answerid
        })
        return response.id
      },
      onSave (answerid, response) {
        if (!this.isNew(answerid)) {
          this.$emit('create-response', [answerid, response])
        } else {
          this.$emit('update-response', [answerid, response, this.responseIdFromAnswer(answerid)])
        }
      }
    },
    computed: {
      computedRows () {
        return this.answers.filter((answer) => {
          return !answer.parameter
        })
      },
      computedColumns () {
        return this.answers.filter((answer) => {
          return answer.parameter
        })
      }
    }
  }
</script>
