<template>
  <div>
    <v-layout row v-for='(answer, index) in answers' :key='"Option " + index' class='"item" + index'>
      <v-checkbox :label="answer.answer" v-model='ex1' :value="answer.id" @change="onSave(answer.id)"></v-checkbox>
    </v-layout>
  </div>
</template>
<script>
  //  import * as _ from 'lodash'

  export default {
    name: 'checkboxes',
    props: ['answers', 'responses'],
    data () {
      return {
        ex1: []
      }
    },
    mounted () {
      this.ex1 = this.responses.map((response) => {
        return response.answer_id
      })
    },
    methods: {
      checkAble (answerid) {
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
      onSave (answerid) {
        if (!this.checkAble(answerid)) {
          this.$emit('create-response', [answerid, null])
        } else {
          this.$emit('delete-response', this.responseIdFromAnswer(answerid))
        }
      }
    }
  }
</script>

<style scoped>
  .radio-wrapper > i {
    margin-top: 1em;
    margin-right: 0.3em;
  }
</style>
