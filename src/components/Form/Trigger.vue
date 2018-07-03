<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm4 offset-sm1>
        <v-select
          :items="questionOptions"
          item-text="question"
          item-value="id"
          v-model="parentQuestionId"
          label="Parent Question"
          single-line
          autocomplete
          @change="updateParentQuestion($event)"
        ></v-select>
      </v-flex>
      <v-flex xs12 sm4 offset-sm2>
        <v-select
          :items="comparators"
          item-text="comparator"
          item-value="id"
          v-model="comparatorId"
          label="Comparator"
          single-line
          @change="updateComparator($event)"
        ></v-select>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm4 offset-sm1>
        <v-select
          :items="parentQuestionType == 8 || parentQuestionType == 9 ? trueAnswers : answers"
          item-text="answer"
          item-value="id"
          v-model="parentAnswerId"
          label="Parent Answer"
          single-line
          @change="updateParentAnswer($event)"
          v-if='selectedTriggerType && selectedTriggerType.answer'
        ></v-select>
      </v-flex>
      <v-flex xs12 sm4 offset-sm2 v-if="parentQuestionType == 8 || parentQuestionType == 9">
        <v-select
          :items="falseAnswers"
          item-text="answer"
          item-value="id"
          v-model="value"
          label="Value"
          single-line
          @change="updateValue($event)"
          v-if='selectedTriggerType && selectedTriggerType.value'
        ></v-select>
      </v-flex>
      <v-flex xs12 sm4 offset-sm2 v-else>
        <v-text-field
          label="Value"
          type="text"
          v-model="value"
          @change="updateValue($event)"
          v-if='selectedTriggerType && selectedTriggerType.value'
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm2 offset-sm4>
        <v-select
          :items="operators"
          item-text="operator"
          item-value="id"
          v-model="operator"
          label="Operator"
          single-line
          @change="updateOperator($event)"
          v-if='!isLast'
        ></v-select>
      </v-flex>
      <v-flex xs12 sm1 offset-sm1 text-xs-center>
        <v-btn fab dark small color="error"
               @click="deleteTrigger()">
          <v-icon dark>remove</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['formId', 'trigger', 'questionOptions', 'isLast'],
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
      parentQuestion () {
        return this.$store.getters.loadedAllQuestion(this.formId, this.parentQuestionId)
      },
      answers () {
        return this.parentQuestion.answers
      },
      trueAnswers () {
        return this.answers.filter(e => {
          return e.parameter
        })
      },
      falseAnswers () {
        return this.answers.filter(e => {
          return !e.parameter
        })
      },
      parentQuestionType () {
        return this.parentQuestion.question_type_id
      },
      triggerTypes () {
        return this.$store.getters.triggerTypes.filter(e => {
          return e.question_type_id === this.parentQuestionType
        })
      },
      comparators () {
        return this.$store.getters.comparators.filter(e => {
          return this.triggerTypes.map(x => x.comparator_id).includes(e.id)
        })
      },
      selectedTriggerType () {
        const selected = this.$store.getters.triggerTypes.filter(e => {
          return e.question_type_id === this.parentQuestionType && e.comparator_id === this.comparatorId
        })
        if (selected.length > 0) {
          return selected[0]
        }
        return null
      }
    },
    methods: {
      updateParentQuestion (value) {
        if (typeof (value) === 'object') {
          return
        }
        this.parentQuestionId = value
        this.updateTrigger()
      },
      updateParentAnswer (value) {
        this.parentAnswerId = value
        this.updateTrigger()
      },
      updateComparator (value) {
        this.comparatorId = value
        this.updateTrigger()
      },
      updateValue (value) {
        this.value = value
        this.updateTrigger()
      },
      updateOperator (value) {
        this.operator = value
        this.updateTrigger()
      },
      deleteTrigger () {
        this.$store.dispatch('deleteTrigger', {
          formId: this.formId,
          id: this.trigger.id
        })
      },
      updateTrigger () {
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