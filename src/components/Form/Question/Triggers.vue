<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-layout wrap>
        <h3>Trigger Parent Questions</h3>
      </v-layout>

      <template v-for='(item, index) in triggers'>
        <trigger :formId="formId" :sectionId="sectionId" :question="question" :trigger="item"></trigger>
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
  export default {
    props: ['formId', 'sectionId', 'question'],
    components: {
      trigger
    },
    computed: {
      triggers () {
        return this.$store.getters.loadedQuestionTrigger(this.formId, this.question.id)
      }
    },
    methods: {
      createTrigger () {
        this.$store.dispatch('createTrigger', {
          formId: this.formId,
          parentQuestionId: 1,
          parentAnswerId: 1,
          value: 1,
          comparatorId: 1,
          operator: 1
        })
      }
    }
  }
</script>