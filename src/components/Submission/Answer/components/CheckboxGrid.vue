<template>
  <v-layout column>
    <v-flex xs10 offset-xs2 class="pb-3">
      <v-layout row>
        <v-flex v-for='(column, index) in computedColumns' :key='"ColumnString " + index'>
          {{ column.answer }}
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout row v-for='(row, index) in computedRows' :key='"row " + index'>
        <v-flex xs2>
          {{ row.answer }}
        </v-flex>
        <v-checkbox v-for='(column, index2) in computedColumns' :key='"column " + index2'
                    v-model="ex1[index]" :value="column.id" @change="onSave(row.id, column.id)"></v-checkbox>

      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  //  import * as _ from 'lodash'

  export default {
    name: 'checkbox-grid',
    props: ['answers', 'responses'],
    data () {
      return {
        ex1: []
      }
    },
    mounted () {
      let ex = []
      for (let i = 0; i < this.computedRows.length; i++) {
        const filteredResponses = this.responses.filter((response) => {
          return this.computedRows[i].id === response.answer_id
        })
        ex[i] = filteredResponses.map((response) => {
          return parseInt(response.response)
        })
      }
      this.ex1 = ex
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
    },
    methods: {
      checkAble (answerid, responseid) {
        const index = this.responses.findIndex((response) => {
          return response.answer_id === answerid && parseInt(response.response) === responseid
        })
        if (index === -1) {
          return false
        } else {
          return true
        }
      },
      responseIdFromAnswer (answerid, responseid) {
        const response = this.responses.find((response) => {
          return response.answer_id === answerid && parseInt(response.response) === responseid
        })
        return response.id
      },
      onSave (answerid, response) {
        if (!this.checkAble(answerid, response)) {
          this.$emit('create-response', [answerid, response])
        } else {
          this.$emit('delete-response', this.responseIdFromAnswer(answerid, response))
        }
      }
    }
  }
</script>

<style scoped>
  .radio-wrapper {
    display: inline-block;
  }

  .radio-wrapper > i {
    font-style: normal;
    color: inherit;
    margin-top: 1em;
    margin-right: 0.3em;
  }

  .input-wrapper {
    display: inline-block;
    width: 70%;
  }

  .close-wrapper {
    display: inline-block;
    padding: 0.5em;
  }

  .actions {
    display: flex;
  }

  .actions > .input-wrapper {
    width: 7em;
  }
</style>
