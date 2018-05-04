<template>
  <v-card active-class="active-question" class="ma-2">
    <v-toolbar>
      <v-toolbar-title>{{ "Question " + index }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-layout row>
        <v-flex xs4>
          <h2>
            {{ editedName }}
          </h2>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex>
          <p>
            {{ editedDescription }}
          </p>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex xs12>
          <component
            :is="questionComponent"
            :answers="answers"
            :responses="responses"
            :question-id="question.id"
            :form-id="formId"
            :submission-id="submissionId"
            @create-response="createResponse"
            @update-response="updateResponse"
            @delete-response="deleteResponse"
          ></component>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'
  import * as _ from 'lodash'
  import shortAnswer from './components/ShortAnswer'
  import paragraph from './components/Paragraph'
  import multipleChoice from './components/MultipleChoice'
  import checkboxes from './components/Checkboxes'
  import dropdown from './components/Dropdown'
  import fileupload from './components/FileUpload'
  import linearScale from './components/LinearScale'
  import multipleChoiceGrid from './components/MultipleChoiceGrid'
  import checkboxGrid from './components/CheckboxGrid'
  import dateComponent from './components/Date'
  import timeComponent from './components/Time'

  export default {
    props: ['question', 'formId', 'submissionId', 'index', 'sectionId'],
    components: {
      draggable
    },
    data () {
      return {
        editedName: this.question.question,
        editedDescription: this.question.description,
        questionTypeId: this.question.question_type_id,
        mandatory: !!this.question.mandatory, // got number type
        questionsComponentsMap: {
          'Short answer': shortAnswer,
          'Paragraph': paragraph,
          'Multiple choice': multipleChoice,
          'Checkboxes': checkboxes,
          'Dropdown': dropdown,
          'File upload': fileupload,
          'Linear scale': linearScale,
          'Multiple choice grid': multipleChoiceGrid,
          'Checkbox grid': checkboxGrid,
          'Date': dateComponent,
          'Time': timeComponent
        },
        hasValidation: false
      }
    },
    computed: {
      answers () {
        return _.sortBy(this.question.answers, element => {
          return 1000000 * (1 - element.parameter) + element.order
        })
      },
      responses () {
        if (!this.submissionId) {
          return []
        }
        let submission = this.$store.getters.loadedSubmission(parseInt(this.formId), parseInt(this.submissionId))
        return submission.responses.filter((response) => {
          return response.question_id === this.question.id
        })
      },
      questionTypes () {
        return this.$store.getters.questionTypes
      },
      questionTypeString: {
        get: function () {
          const index = _.findIndex(this.questionTypes, type => {
            return type.id === this.questionTypeId
          })
          if (this.questionTypes[index]) {
            return this.questionTypes[index].type
          } else {
            return 'Short answer'
          }
        },
        set: function (str) {
          this.setQuestionType(str)
        }
      },
      questionComponent: {
        get: function () {
          return this.questionsComponentsMap[this.questionTypeString]
        }
      }
    },
    methods: {
      setQuestionType (str) {
        this.questionTypeId = _.findIndex(this.questionTypes, type => {
          return type.type === str
        }) + 1
      },
      createResponse (args) {
        if (!this.submissionId) {
          return
        }
        const answerId = args[0]
        const response = args[1]
        this.$store.dispatch('createResponse', {
          submissionId: this.submissionId,
          questionId: this.question.id,
          formId: this.formId,
          answerId: answerId,
          response: response
        })
      },
      updateResponse (args) {
        const answerId = args[0]
        const response = args[1]
        const id = args[2]
        this.$store.dispatch('updateResponse', {
          submissionId: this.submissionId,
          questionId: this.question.id,
          formId: this.formId,
          answerId: answerId,
          response: response,
          id: id
        })
      },
      deleteResponse (id) {
        this.$store.dispatch('deleteResponse', {
          submissionId: this.submissionId,
          questionId: this.question.id,
          formId: this.formId,
          id: id
        })
      }
    }
  }
</script>

<style scoped>
  .error {
    color: red;
  }
</style>
