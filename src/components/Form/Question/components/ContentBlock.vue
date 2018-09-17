<template>
  <v-container>

    <v-layout row>
      <v-flex xs12>
        <v-text-field
          label="Description"
          @blur="updateQuestion"
          v-model="editedQuestion"
          required
        ></v-text-field>
      </v-flex>
    </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-textarea
            label="Content Block"
            v-model="editedDescription"
            @blur="updateQuestion"
          ></v-textarea>
        </v-flex>
      </v-layout>

    <triggers :formId="formId" type="Question" :question="question" :questionOptions="questionOptions" v-if="questionOptions.length > 0"></triggers>

    <v-divider></v-divider>

    <v-layout pa-3 class="card_actions">
      <v-spacer></v-spacer>
      <v-btn color="grey darken-2" flat icon @click="duplicateQuestion">
        <v-icon>content_copy</v-icon>
      </v-btn>
      <v-btn color="grey darken-2" flat icon @click.stop="deleteQuestion = true">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-layout>

    <!-- //Delete Question -->
    <DeleteConfirmDialog @delete-action="onDeleteQuestion" :visible="deleteQuestion" @close="deleteQuestion = false"></DeleteConfirmDialog>
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
        editedQuestion: this.question.question || 'Content Block',
        editedDescription: this.question.description,
        deleteQuestion: false
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
          question: this.editedQuestion,
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
      onDeleteQuestion () {
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
