<template>
  <v-layout row wrap>
    <v-flex xs12 sm1>
      <v-select
        :items="questionOptions"
        item-text="question"
        item-value="id"
        v-model="parentQuestionId"
        label="Parent Question"
        single-line
        @change="updateTrigger"
      ></v-select>
    </v-flex>
    <v-flex xs12 sm1 offset-sm1>
      <v-select
        :items="answers"
        item-text="answer"
        item-value="id"
        v-model="parentAnswerId"
        label="Parent Answer"
        single-line
        @change="updateTrigger"
      ></v-select>
    </v-flex>
    <v-flex xs12 sm1 offset-sm1>
      <v-select
        :items="comparators"
        item-text="comparator"
        item-value="id"
        v-model="comparatorId"
        label="Comparator"
        single-line
        @change="updateTrigger"
      ></v-select>
    </v-flex>
    <v-flex xs12 sm1 offset-sm1>
      <v-text-field
        label="Value"
        type="text"
        v-model="value"
        @change="updateTrigger"
      ></v-text-field>
    </v-flex>
    <v-flex xs12 sm1 offset-sm1>
      <v-select
        :items="operators"
        item-text="operator"
        item-value="id"
        v-model="operator"
        label="Operator"
        single-line
        @change="updateTrigger"
      ></v-select>
    </v-flex>
    <v-flex xs12 sm1 offset-sm1 text-xs-center>
      <v-btn fab dark small color="error"
             @click="deleteTrigger()">
        <v-icon dark>remove</v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    props: ['formId', 'sectionId', 'question', 'trigger'],
    data () {
      return {
        parentQuestionId: this.trigger.parent_question_id,
        parentAnswerId: this.trigger.parent_answer_id,
        value: this.trigger.value,
        comparatorId: this.trigger.comparator_id,
        operator: this.trigger.operator,
        operators: [
          { id: 0, operator: 'AND' },
          { id: 1, operator: 'OR' }
        ]
      }
    },
    computed: {
      section () {
        return this.$store.getters.loadedSection(this.formId, this.sectionId)
      },
      questionOptions () {
        return this.section.questions.filter((question) => { return question.id !== this.question.id })
      },
      answers () {
        return this.$store.getters.loadedAnswers(this.formId, this.sectionId, this.parentQuestionId)
      },
      comparators () {
        return this.$store.gettes.comparators
      }
    },
    methods: {
      deleteTrigger () {
        this.$store.dispatch('deleteTrigger', {
          formId: this.formId,
          id: this.trigger.id
        })
      },
      updateTrigger () {
        if (this.parentQuestionId !== this.trigger.parentQuestionId && this.answers.length > 0) {
          this.parentAnswerId = this.answers[0].id
        }
        this.$store.dispatch('updateTrigger', {
          id: this.trigger.id,
          formId: this.formId,
          parentQuestionId: this.parentQuestionId,
          parentAnswerId: this.parentAnswerId,
          value: this.value,
          comparatorId: this.comparatorId,
          operator: this.operator
        })
      }
    }
  }
</script>