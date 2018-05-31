<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div class="subheading">{{ question }}</div>
    </v-flex>
    <v-flex xs12>
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
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'multiple-choice-grid',
    props: ['question', 'answers', 'responses', 'submissionId'],
    data () {
      return {
        checkAnswers: []
      }
    },
    watch: {
      submissionId (value) {
        this.created()
      }
    },
    mounted () {
      this.created()
    },
    methods: {
      created () {
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
      checked (answerId, response) {
        if (this.responses.length) {
          const objs = this.responses.filter((obj) => {
            return parseInt(obj.response) === response && obj.answer_id === answerId
          })
          if (objs.length) {
            return 'check'
          }
        }
        return 'unchecked'
      },
      isNew (answerId) {
        const index = this.responses.findIndex((response) => {
          return response.answer_id === answerId
        })
        if (index === -1) {
          return false
        } else {
          return true
        }
      },
      responseIdFromAnswer (answerId) {
        const response = this.responses.find((response) => {
          return response.answer_id === answerId
        })
        return response.id
      },
      onSave (answerId, response) {
        if (!this.isNew(answerId)) {
          this.$emit('create-response', [answerId, response])
        } else {
          this.$emit('update-response', [answerId, response, this.responseIdFromAnswer(answerId)])
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
