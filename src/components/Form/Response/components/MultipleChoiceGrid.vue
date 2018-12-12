<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-layout column>
        <v-flex xs9 offset-xs3 class="pb-3">
          <v-layout row>
            <v-flex v-for='(column, index) in computedColumns' :key='"OptionString " + index'>
              {{ column.answer }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex multiple-choice-grid>
          <v-layout pa-2 question-row row v-for='(row, index) in computedRows' :key='"row " + index'>
            <v-flex xs3>
              <div class="body-2">{{row.answer}}</div>
            </v-flex>
            <v-flex>
              <v-radio-group v-model="checkAnswers[index]" row class="py-0">
                <v-radio
                  color="info"
                  v-for='(column, index2) in computedColumns'
                  :key='"column " + index2'
                  :value="column.id"
                  @change="onSave(row.id, column.id)"
                  :style="'width: ' + 100/computedColumns.length + '%'"
                  class="mx-0"
                  :disabled="disabled"
                ></v-radio>
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
    props: ['question', 'answers', 'responses', 'formId', 'disabled'],
    data () {
      return {
        checkAnswers: []
      }
    },
    watch: {
      formId (value) {
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

<style>
  .multiple-choice-grid .question-row:nth-child(even) {
    background: #f5f5f5;
  }
  .multiple-choice-grid .v-input--radio-group .v-input__control {
    width: 100%;
  }
</style>