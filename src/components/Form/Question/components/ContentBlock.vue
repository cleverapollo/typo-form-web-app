<template>
  <v-container>
    <v-textarea
      label="Content Block"
      v-model="editedDescription"
      @blur="updateQuestion"
    ></v-textarea>

    <triggers :formId="formId" :sectionId="sectionId" :question="question" :questionOptions="questionOptions" v-if="questionOptions.length > 0"></triggers>

    <v-divider></v-divider>

    <v-layout pa-3 class="card_actions">
      <v-spacer></v-spacer>
      <v-btn color="grey darken-2" flat icon @click="duplicateQuestion">
        <v-icon>content_copy</v-icon>
      </v-btn>
      <v-btn color="grey darken-2" flat icon @click="deleteQuestion">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
  import triggers from '../../Triggers'
  export default {
    props: ['question', 'formId', 'sectionId', 'index'],
    components: {
      triggers
    },
    data () {
      return {
        editedDescription: this.question.description
      }
    },
    computed: {
      questionOptions () {
        return this.$store.getters.loadedAllQuestions(this.formId).filter((question) => { return question.id !== this.question.id })
      }
    },
    methods: {
      updateQuestion () {
        this.$store.dispatch('updateQuestion', {
          formId: this.formId,
          sectionId: this.sectionId,
          id: this.question.id,
          question: 'Content Block',
          description: this.editedDescription
        })
      },
      duplicateQuestion () {
        this.$store.dispatch('duplicateQuestion', {
          formId: this.formId,
          sectionId: this.sectionId,
          id: this.question.id
        })
      },
      deleteQuestion () {
        this.$store.dispatch('deleteQuestion', {
          formId: this.formId,
          sectionId: this.sectionId,
          id: this.question.id
        })
      }
    },
    mounted () {
      if (this.question.answers.length) {
        this.$emit('delete-answers')
      }
    }
  }
</script>

<style scoped>
  .card_actions .btn, .card_actions>* {
    margin: 0 4px;
  }
</style>
