<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-layout wrap>
        <h3>Trigger Parent Questions</h3>
      </v-layout>

      <template v-for='(item, index) in triggers'>
        <trigger :formId="formId" :trigger="item" :questionOptions="questionOptions" :isLast="isLast(index)"></trigger>
        <v-divider v-if='!isLast(index)'></v-divider>
      </template>

      <v-layout wrap>
        <v-btn dark block color="primary" @click="createTrigger">
          <v-icon dark>add</v-icon>
          Add
        </v-btn>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import trigger from './Trigger'
  import * as _ from 'lodash'
  export default {
    props: ['formId', 'question', 'questionOptions', 'type'],
    components: {
      trigger
    },
    computed: {
      triggers () {
        let triggers = this.$store.getters.loadedQuestionTrigger(this.formId, this.question.id)
        triggers = triggers.filter((trigger) => {
          if (this.type === 'Section') {
            return trigger.type === 'Section'
          } else {
            return trigger.type !== 'Section'
          }
        })
        return _.sortBy(triggers, element => {
          return element.order
        })
      }
    },
    methods: {
      createTrigger () {
        this.$store.dispatch('createTrigger', {
          formId: this.formId,
          questionId: this.question.id,
          parentQuestionId: this.questionOptions[0].id,
          comparatorId: 1,
          operator: 0,
          type: this.type
        })
      },
      isLast (index) {
        return this.triggers.length - 1 === index
      }
    }
  }
</script>