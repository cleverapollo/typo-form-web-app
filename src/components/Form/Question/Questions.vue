<template>
  <v-container>
    <form>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            label="Question"
            @blur="checkUpdateName"
            v-model="editedName"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-text-field
            label="Description"
            v-model="editedDescription"
            @blur="checkUpdateDescription"
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12 sm7>
          <v-select
            :items="menuItems"
            item-text="title"
            item-value="title"
            v-model="questionTypeString"
            label="Question Type"
            auto
            persistent-hint
            hint=" "
            @change="updateQuestionType"
            required
          >
            <template slot="selection" slot-scope="data">
              <v-list-tile-avatar>
                <v-icon v-text="data.item.action"></v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content style="color: black">
                <v-list-tile-title>{{ data.item.title }}</v-list-tile-title>
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
                  <v-list-tile-title>{{ data.item.title }}</v-list-tile-title>
                </v-list-tile-content>
              </template>
            </template>
          </v-select>
        </v-flex>

        <v-flex xs12 sm4 offset-sm1 pt-2>
          <v-select
            :items="questionWidths"
            v-model="questionWidth"
            item-text="text"
            item-value="value"
            label="Question Width"
            @change="updateQuestionWidth($event)"
            required
          ></v-select>
        </v-flex>
      </v-layout>

      <v-layout row v-if="hasSort">
        <v-flex xs12>
          <v-select
            :items="answerSorts"
            v-model="sortId"
            item-text="sort"
            item-value="id"
            label="Sort Option"
            @change="updateQuestionSort($event)"
            required
          ></v-select>
        </v-flex>
      </v-layout>

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

    <triggers :formId="formId" :question="question" :questionOptions="questionOptions" type="Question" v-if="questionOptions.length > 0"></triggers>

    <v-toolbar pa-3>
      <v-spacer></v-spacer>

      <v-tooltip top>
        <v-btn slot="activator" color="grey darken-2" flat icon @click="duplicateQuestion">
          <v-icon>content_copy</v-icon>
        </v-btn>
        <span>Duplicate Question</span>
      </v-tooltip>

      <v-tooltip top>
        <v-btn slot="activator" color="grey darken-2" flat icon @click.stop="deleteQuestion = true">
          <v-icon>delete</v-icon>
        </v-btn>
        <span>Delete Question</span>
      </v-tooltip>

      <v-divider
        class="mx-3"
        inset
        vertical>
      </v-divider>

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
              {{ validationString }}
            </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-else disabled>
            <v-list-tile-title>
              {{ validationString }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <!-- //Delete Question -->
    <DeleteConfirmDialog @delete-action="onDeleteQuestion" :visible="deleteQuestion" @close="deleteQuestion = false"></DeleteConfirmDialog>
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
  import ABNLookup from './components/ABNLookup'
  import * as _ from 'lodash'

  import triggers from '../Triggers'

  export default {
    props: ['question', 'formId', 'sectionId', 'index'],
    components: {
      triggers
    },
    data () {
      return {
        deleteQuestion: false,
        editedName: this.question.question,
        editedDescription: this.question.description,
        questionTypeId: this.question.question_type_id,
        questionWidth: this.question.width,
        sortId: this.question.sort_id,
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
          'Content Block': ContentBlock,
          'ABN Lookup': ABNLookup
        },
        ifRequireValidation: {
          'Short answer': true,
          'Paragraph': true,
          'Multiple choice': true,
          'Checkboxes': true,
          'Dropdown': true
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
            action: 'search',
            title: 'ABN Lookup'
          }
        ],
        validationTypes: this.$store.getters.validationTypes,
        validations: this.$store.getters.loadedQuestionValidation(this.formId, this.question.id),
        validationData: '',
        validationType: ''
      }
    },
    computed: {
      validationString () {
        if (this.questionTypeString === 'Multiple choice') {
          return this.hasValidation ? 'Switch to Column Option' : 'Switch to Row Option'
        } else if (this.questionTypeString === 'Dropdown') {
          return this.hasValidation ? 'Switch to One-Selection' : 'Switch to Multi-Selection'
        } else {
          return this.hasValidation ? 'Remove Validation' : 'Include Validation'
        }
      },
      questionWidths () {
        let questionWidths = []
        for (let i = 1; i <= 12; i++) {
          questionWidths.push({
            value: i,
            text: Math.round((100 * i) / 12) + ' %'
          })
        }
        return questionWidths
      },
      section () {
        return this.$store.getters.loadedSection(this.formId, this.sectionId)
      },
      questionOptions () {
        const allQuestions = this.$store.getters.loadedAllQuestions(this.formId).filter((question) => { return question.id !== this.question.id })
        // return _.sortBy(allQuestions, element => {
        //   return element.id
        // })
        return allQuestions
      },
      answers () {
        const answers = this.question.answers
        if (this.answerSort === 'Text ASC') {
          return _.orderBy(answers, ['parameter', 'answer'], ['desc', 'asc'])
        }
        if (this.answerSort === 'Text DESC') {
          return _.orderBy(answers, ['parameter', 'answer'], ['desc', 'desc'])
        }
        if (this.answerSort === 'Number ASC') {
          return _.orderBy(answers, ['parameter', answer => parseInt(answer.answer)], ['desc', 'asc'])
        }
        if (this.answerSort === 'Number DESC') {
          return _.orderBy(answers, ['parameter', answer => parseInt(answer.answer)], ['desc', 'desc'])
        }
        return _.orderBy(answers, ['parameter', 'order'], ['desc', 'asc'])
      },
      questionTypes () {
        return this.$store.getters.questionTypes
      },
      answerSort () {
        const answerSort = _.find(this.answerSorts, sort => {
          return sort.id === this.sortId
        })
        return answerSort ? answerSort.sort : 'Undefined'
      },
      answerSorts () {
        return this.$store.getters.answerSorts
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
      },
      hasSort () {
        if (this.questionTypeString === 'Multiple choice') {
          return true
        }
        if (this.questionTypeString === 'Checkboxes') {
          return true
        }
        if (this.questionTypeString === 'Dropdown') {
          return true
        }
        return false
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
          this.$root.$emit('validation-remove', this.question.id)
        } else {
          this.$root.$emit('validation-create', this.question.id)
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
      updateQuestionSort (value) {
        this.sortId = value
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
            sortId: this.sortId,
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
      onDeleteQuestion () {
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
  .switch-mandatory {
    max-width: 120px;
  }
  .v-toolbar {
    box-shadow: none;
    background: white;
  }
</style>
