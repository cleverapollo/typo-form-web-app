<template>
  <v-container>
    <form>
      <v-text-field
        label="Question"
        single-line
        @blur="checkUpdateName"
        v-model="editedName"
      ></v-text-field>

      <v-text-field
        label="Description"
        v-model="editedDescription"
        single-line
        @blur="checkUpdateDescription"
      ></v-text-field>

      <v-select
        :items="menuItems"
        item-text="title"
        item-value="title"
        v-model="questionTypeString"
        auto
        persistent-hint
        hint=" "
        @change="updateQuestionType"
      >
        <template slot="selection" slot-scope="data">
          <v-list-tile-avatar>
            <v-icon v-text="data.item.action"></v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content style="color: black">
            <v-list-tile-title v-html="data.item.title"></v-list-tile-title>
          </v-list-tile-content>
        </template>

        <template slot="item" slot-scope="data">
          <template v-if="typeof data.item !== 'object'">
            <v-list-tile-content v-text="data.item"></v-list-tile-content>
          </template>

          <template v-else>
            <v-list-tile-avatar>
              <v-icon v-text="data.item.action"></v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-html="data.item.title"></v-list-tile-title>
            </v-list-tile-content>
          </template>
        </template>
      </v-select>

      <v-select
        :items="grids"
        v-model="questionWidth"
        label="Question Width"
        single-line
        @change="updateQuestionWidth($event)"
      ></v-select>

      <component
        :is="questionComponent"
        :question-id="question.id"
        :form-id="formId"
        :answers="answers"
        :has-validation="mandatory && hasValidation"
        @create-answer="createAnswer"
        @delete-answer="deleteAnswer"
        @delete-answers="deleteAnswers"
        @change-answer="changeAnswer"
        @update-answer="updateAnswer"
        @move-answer="moveAnswer"
        @create-validation="createValidation"
        @update-validation="updateValidation"
        @remove-validation="removeValidation"
      ></component>
    </form>

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

      <div class="v-divider">&nbsp</div>

      <v-switch
        label="Required"
        v-model="mandatory"
        hide-details
        class="switch-mandatory"
      ></v-switch>

      <v-menu v-if="ifRequireValidation[questionTypeString]" offset-y bottom right>
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>

        <v-list>
          <v-list-tile v-if="mandatory" @click="createRemoveValidation">
            <v-list-tile-title>
              {{ hasValidation ? "Remove Validation" : "Include Validation" }}
            </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-else disabled>
            <v-list-tile-title>
              Include Validation
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-layout>
  </v-container>
</template>

<script>
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
  import * as _ from 'lodash'

  import triggers from './Triggers'

  export default {
    props: ['question', 'formId', 'sectionId', 'index'],
    components: {
      triggers
    },
    data () {
      return {
        editedName: this.question.question,
        editedDescription: this.question.description,
        questionTypeId: this.question.question_type_id,
        questionWidth: this.question.width,
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
        ifRequireValidation: {
          'Short answer': true,
          'Paragraph': true,
          'Checkboxes': true
        },
        menuItems: [
          {
            action: 'short_text',
            title: 'Short answer'
          },
          {
            action: 'subject',
            title: 'Paragraph'
          },
          {divider: true},
          {
            action: 'radio_button_checked',
            title: 'Multiple choice'
          },
          {
            action: 'check_box',
            title: 'Checkboxes'
          },
          {
            action: 'arrow_drop_down_circle',
            title: 'Dropdown'
          },
          {divider: true},
          {
            action: 'cloud_upload',
            title: 'File upload'
          },
          {divider: true},
          {
            action: 'linear_scale',
            title: 'Linear scale'
          },
          {
            action: 'grain',
            title: 'Multiple choice grid'
          },
          {
            action: 'apps',
            title: 'Checkbox grid'
          },
          {divider: true},
          {
            action: 'event',
            title: 'Date'
          },
          {
            action: 'schedule',
            title: 'Time'
          },
          {
            action: 'view_headline',
            title: 'Content Block'
          }
        ],
        validationTypes: this.$store.getters.validationTypes,
        validations: this.$store.getters.loadedQuestionValidation(this.formId, this.question.id),
        validationData: '',
        validationType: ''
      }
    },
    computed: {
      grids () {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      },
      section () {
        return this.$store.getters.loadedSection(this.formId, this.sectionId)
      },
      questionOptions () {
        return this.$store.getters.loadedAllQuestions(this.formId).filter((question) => { return question.id !== this.question.id })
      },
      answers () {
        return _.sortBy(this.question.answers, element => {
          return 1000000 * (element.parameter ? 0 : 1) + element.order
        })
      },
      questionTypes () {
        return this.$store.getters.questionTypes
      },
      hasValidation () {
        this.validationTypes = this.$store.getters.validationTypes
        this.validations = this.$store.getters.loadedQuestionValidation(this.formId, this.question.id)
        return !!(this.validations && this.validations.length && this.validations.length === 1)
      },
      questionTypeString: {
        get: function () {
          const index = _.findIndex(this.questionTypes, type => {
            return type.id === this.questionTypeId
          })
          if (this.questionTypes[index]) {
            return this.questionTypes[index].type
          } else {
            return 'Undefined'
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
    watch: {
      mandatory (value) {
        this.updateQuestion()
      }
    },
    methods: {
      createRemoveValidation () {
        if (this.hasValidation) {
          window.Vue.$emit('validation-remove', this.question.id)
        } else {
          window.Vue.$emit('validation-create', this.question.id)
        }
      },
      setQuestionType (str) {
        this.questionTypeId = _.findIndex(this.questionTypes, type => {
          return type.type === str
        }) + 1
      },
      checkUpdateName: function () {
        if (this.editedName !== this.question.question) {
          this.updateQuestion()
        }
      },
      checkUpdateDescription: function () {
        if (this.editedDescription !== this.question.description) {
          this.updateQuestion()
        }
      },
      createAnswer: function (args) {
        const answer = args[0]
        const parameter = args[1]
        this.$store.dispatch('createAnswer',
          {
            formId: this.formId,
            sectionId: this.sectionId,
            questionId: this.question.id,
            answer: answer,
            parameter: parameter
          })
      },
      updateAnswer: function (args) {
        const id = args[0]
        const answer = args[1]
        this.$store.dispatch('updateAnswer',
          {
            formId: this.formId,
            sectionId: this.sectionId,
            questionId: this.question.id,
            id: id,
            answer: answer
          })
      },
      deleteAnswer: function (id) {
        this.$store.dispatch('deleteAnswer', {
          formId: this.formId,
          sectionId: this.sectionId,
          questionId: this.question.id,
          id: id
        })
      },
      deleteAnswers: function () {
        this.$store.dispatch('deleteAnswers', {
          formId: this.formId,
          sectionId: this.sectionId,
          questionId: this.question.id
        })
      },
      changeAnswer: function () {
        this.$store.dispatch('changeAnswers', {
          formId: this.formId,
          sectionId: this.sectionId,
          questionId: this.question.id
        })
      },
      updateQuestionWidth (value) {
        this.questionWidth = value
        this.updateQuestion()
      },
      updateQuestionType (value) {
        // 1, 2, 6, 7, 10, 11 - QuestionType Group 1
        // 3, 4, 5 - QuestionType Group 2
        // 8, 9 - QuestionType Group 3
        // Group 1 -> Group 2: createAnswer('Option 1', true)
        // Gropu 1 -> Group 3: createAnswer('Column 1', true), createAnswer('Row 1', false)
        // -> Group1 : deleteAnswers
        // Group3 -> Group 2: deleteAnswer('Row 1', false)
        // Group2 -> Group 3: createAnswer('Row 1', false)

        this.questionTypeString = value
        this.updateQuestion()
        this.removeValidation()
      },
      updateQuestion () {
        if (this.editedName.trim() === '') {
          return
        }
        this.$store.dispatch('updateQuestion',
          {
            formId: this.formId,
            sectionId: this.sectionId,
            id: this.question.id,
            question: this.editedName,
            description: this.editedDescription,
            questionTypeId: this.questionTypeId,
            mandatory: this.mandatory,
            width: this.questionWidth
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
      },
      moveAnswer (args) {
        const id = args[0]
        const order = args[1]
        this.$store.dispatch('moveAnswer', {
          formId: this.formId,
          sectionId: this.sectionId,
          questionId: this.question.id,
          id: id,
          order: order
        })
      },
      createValidation (...args) {
        const name = args[0]
        const validationTypeId = _.find(this.validationTypes, type => {
          return name === type.type
        }).id
        this.$store.dispatch('createValidation', {
          formId: this.formId,
          questionId: this.question.id,
          validationTypeId: validationTypeId,
          validationData: `${args[1]},${args[2]}`
        })
      },
      updateValidation (...args) {
        const name = args[0]
        const validationTypeId = _.find(this.validationTypes, type => {
          return name === type.type
        }).id
        const validationId = this.validations[0].id
        this.$store.dispatch('updateValidation', {
          id: validationId,
          formId: this.formId,
          questionId: this.question.id,
          validationTypeId: validationTypeId,
          validationData: `${args[1]},${args[2]}`
        })
      },
      removeValidation () {
        if (!this.validations.length) {
          return
        }
        const validationId = this.validations[0].id
        this.$store.dispatch('deleteValidation', {
          id: validationId,
          formId: this.formId
        })
      }
    }
  }
</script>

<style scoped>
  .card_actions .btn, .card_actions>* {
    margin: 0 4px;
  }

  .switch-mandatory {
    max-width: 120px;
    margin-left: 20px;
  }

  .v-divider {
    line-height: 2;
    border-right: 1px solid #ccc;
  }
</style>
