<template>
  <v-flex xs12 :class='"sm" + (question.width ? question.width : 12)' question-group pa-3 v-if="isTrigger()">
    
    <v-layout row wrap question-head>
      <v-flex xs12>
        <div class="body-2">
          {{ editedName }}
          <span v-if="question.mandatory" class="red--text">*</span>
        </div>
      </v-flex>
      <v-flex xs12>
        <div class="body-1 grey--text text--darken-1" v-if='editedDescription'>
          {{ editedDescription }}
        </div>
      </v-flex>
    </v-layout>

    <component
      :is="questionComponent"
      :answers="answers"
      :responses="responses"
      :question-id="question.id"
      :question="editedName"
      :mandatory="question.mandatory"
      form-id="formId"
      :submission-id="submissionId"
      @create-response="createResponse"
      @update-response="updateResponse"
      @delete-response="deleteResponse"
    ></component>
  </v-flex>
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
  import ContentBlock from './components/ContentBlock'
  import TriggerMixin from '../TriggerMixin.js'

  export default {
    props: ['question', 'formId', 'submissionId', 'index', 'sectionId'],
    mixins: [TriggerMixin],
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
          'Time': timeComponent,
          'Content Block': ContentBlock
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
        let submission = this.$store.getters.loadedSubmission(this.formId, parseInt(this.submissionId))
        return submission.responses.filter((response) => {
          return response.question_id === this.question.id
        })
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
      },
      questionTriggers () {
        return this.$store.getters.loadedQuestionTrigger(this.formId, parseInt(this.question.id))
      }
    },
    methods: {
      isTrigger () {
        const $this = this
        let triggerF = false
        let tempF = true

        _.forEach(this.questionTriggers, function (questionTrigger) {
          if (questionTrigger.operator === 1) {
            triggerF |= tempF && $this.compareCondition(questionTrigger)
            tempF = true
          } else {
            tempF &= $this.compareCondition(questionTrigger)
          }
        })

        return triggerF || tempF
      },
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
          submissionId: parseInt(this.submissionId),
          questionId: this.question.id,
          formId: this.formId,
          answerId: answerId,
          response: response
        }).then((response) => {
          this.updateSubmission()
        })
      },
      updateResponse (args) {
        const answerId = args[0]
        const response = args[1]
        const id = args[2]
        this.$store.dispatch('updateResponse', {
          submissionId: parseInt(this.submissionId),
          questionId: this.question.id,
          formId: this.formId,
          answerId: answerId,
          response: response,
          id: id
        }).then((response) => {
          this.updateSubmission()
        })
      },
      deleteResponse (id) {
        this.$store.dispatch('deleteResponse', {
          submissionId: parseInt(this.submissionId),
          questionId: this.question.id,
          formId: this.formId,
          id: id
        }).then((response) => {
          this.updateSubmission()
        })
      },
      updateSubmission () {
        this.$store.dispatch('updateSubmission', {
          id: parseInt(this.submissionId),
          formId: this.formId,
          progress: this.progress
        })
      }
    }
  }
</script>

<style scoped>
  .error {
    color: red;
  }
  .question-group .question-head {
    padding-bottom:5px;
  }
  .question-group >>> .input-group.input-group--text-field {
    padding-top:0px;
  }
  .question-group {
    margin-bottom:30px;
  }
  .question-group >>> .input-group__details {
    min-height:auto;
  }
  .question-group >>> .input-group.input-group--textarea {
    padding-top: 0px;
  }
  .question-group >>> .input-group.input-group--textarea .input-group__input {
    border: 1px solid rgba(0,0,0,.42);
    padding: 15px;
  }
</style>