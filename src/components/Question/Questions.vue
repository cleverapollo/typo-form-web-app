<template>
  <v-card active-class='active-question' class='elevation-12'>
    <v-toolbar>
      <v-toolbar-title>{{ 'Question ' + question.order }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-container fluid>
        <v-layout row>
          <v-flex xs4>
            <v-text-field
              label='Question'
              single-line
              autofocus
              @blur='checkUpdateName'
              v-model='editedName'
            ></v-text-field>
          </v-flex>
          <v-flex xs4 offset-xs1>
            <v-select
              :items='menuItems'
              item-text='title'
              item-value='title'
              v-model='questionTypeString'
              auto
              persistent-hint
              hint=' '
              @change='updateQuestionType'
            >
              <template slot='selection' slot-scope='data'>
                <v-list-tile-avatar>
                  <v-icon v-text='data.item.action'></v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content style='color: black'>
                  <v-list-tile-title v-html='data.item.title'></v-list-tile-title>
                </v-list-tile-content>
              </template>
              <template slot='item' slot-scope='data'>
                <template v-if='typeof data.item !== "object"'>
                  <v-list-tile-content v-text='data.item'></v-list-tile-content>
                </template>
                <template v-else>
                  <v-list-tile-avatar>
                    <v-icon v-text='data.item.action'></v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-html='data.item.title'></v-list-tile-title>
                  </v-list-tile-content>
                </template>
              </template>
            </v-select>
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex>
            <v-text-field
              label='Description'
              v-model='editedDescription'
              single-line
              autofocus
              @blur='checkUpdateDescription'
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex>
            <component
              :is='questionComponent'
              :options='questionOptions'
              :has-other='questionHasOther'
              :rows='questionRows'
              :columns='questionColumns'
              :has-validation='mandatory && hasValidation'
              @update-options='onOptionsUpdate'
              @update-hasOther='onHasOtherUpdate'
              @update-rows='onRowsUpdate'
              @update-columns='onColumnsUpdate'
            ></component>
          </v-flex>
        </v-layout>

        <v-divider></v-divider>
      </v-container>
    </v-card-text>
    <v-card-actions class='pa-3'>
        <v-spacer></v-spacer>
        <v-btn color='grey darken-2' flat icon @click='duplicateQuestion'><v-icon>content_copy</v-icon></v-btn>
        <v-btn color='grey darken-2' flat icon @click='deleteQuestion'><v-icon>delete</v-icon></v-btn>
        <v-switch
          label='Required'
          v-model='mandatory'
        ></v-switch>
        <v-checkbox
          v-show='mandatory'
          label='include validation'
          v-model='hasValidation'
        ></v-checkbox>
    </v-card-actions>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'
  import answers from '../Answer/Answers.vue'
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
  import * as _ from 'lodash'
  export default {
    props: ['question', 'form_id', 'section_id'],
    components: {
      draggable,
      answers
    },
    data () {
      return {
        editedName: this.question.question,
        editedDescription: this.question.description,
        questionTypeId: this.question.question_type_id,
        mandatory: !!this.question.mandatory, // got number type
        answers: this.question.answers,
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
        questionOptions: [],
        questionHasOther: false,
        questionRows: [],
        questionColumns: [],
        menuItems: [
          {
            action: 'short_text',
            title: 'Short answer'
          },
          {
            action: 'subject',
            title: 'Paragraph'
          },
          { divider: true },
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
          { divider: true },
          {
            action: 'cloud_upload',
            title: 'File upload'
          },
          { divider: true },
          {
            action: 'linear_scale',
            title: 'Linear scale'
          },
          {
            action: 'apps',
            title: 'Multiple choice grid'
          },
          {
            action: 'apps',
            title: 'Checkbox grid'
          },
          { divider: true },
          {
            action: 'event',
            title: 'Date'
          },
          {
            action: 'schedule',
            title: 'Time'
          }
        ],
        hasValidation: false
      }
    },
    computed: {
      questionTypes () {
        return this.$store.getters.loadedQuestionTypes
      },
      questionTypeString: {
        get: function () {
          const index = _.findIndex(this.questionTypes, type => { return type.id === this.questionTypeId })
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
          return this.questionsComponentsMap[ this.questionTypeString ]
        }
      }
    },
    watch: {
      mandatory (value) {
        this.updateQuestion()
      }
    },
    methods: {
      setQuestionType (str) {
        this.questionTypeId = _.findIndex(this.questionTypes, type => { return type.type === str }) + 1
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
      createAnswer: function (answer, parameter) {
        this.$store.dispatch('createAnswer',
          {
            formid: this.form_id,
            sectionid: this.section_id,
            questionid: this.question.id,
            answer: answer,
            order: 1,
            parameter: parameter
          })
      },
      deleteAnswers: function () {
        this.$store.dispatch('deleteAnswers', {
          formid: this.form_id,
          sectionid: this.section_id,
          questionid: this.question_id
        })
      },
      changeAnswers: function () {
        this.$store.dispatch('changeAnswers', {
          formid: this.form_id,
          sectionid: this.section_id,
          questionid: this.question_id
        })
      },
      group (value) {
        if (value === 'Short answer' ||
        value === 'Paragraph' ||
        value === 'File upload' ||
        value === 'Linear scale' ||
        value === 'Date' ||
        value === 'Time') {
          return 1
        } else if (value === 'Multiple choice' ||
        value === 'Checkboxes' ||
        value === 'Dropdown') {
          return 2
        } else if (value === 'Multiple choice grid' ||
        value === 'Checkbox grid') {
          return 3
        } else {
          return 1
        }
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

        const newQuestionTypeId = _.findIndex(this.questionTypes, type => { return type.type === value }) + 1
        const oldGroup = this.group(this.questionTypeId)
        const newGroup = this.group(newQuestionTypeId)
        if (oldGroup === 1 && newGroup === 2) {
          this.createAnswer('Option 1', true)
        } else if (oldGroup === 1 && newGroup === 3) {
          this.createAnswer('Column 1', true)
          this.createAnswer('Row 1', false)
        } else if (oldGroup === 2 && newGroup === 3) {
          this.createAnswer('Row 1', false)
        } else if (oldGroup === 3 && newGroup === 2) {
          this.changeAnswers()
        } else {
          this.deleteAnswers()
        }

        this.questionTypeString = value
        this.updateQuestion()
      },
      updateQuestion () {
        if (this.editedName.trim() === '' || this.editedDescription.trim() === '') {
          return
        }
        this.$store.dispatch('updateQuestion',
          {
            formid: this.form_id,
            sectionid: this.section_id,
            id: this.question.id,
            question: this.editedName,
            description: this.editedDescription,
            question_type_id: this.questionTypeId,
            mandatory: this.mandatory,
            order: this.question.order
          })
      },
      duplicateQuestion () {
        this.$store.dispatch('duplicateQuestion', {
          formid: this.form_id,
          sectionid: this.section_id,
          id: this.question.id
        })
      },
      deleteQuestion () {
        this.$store.dispatch('deleteQuestion', {
          formid: this.form_id,
          sectionid: this.section_id,
          id: this.question.id
        })
      },
      onOptionsUpdate (options) {
        console.log('options updated', options)
        this.questionOptions = options
      },
      onHasOtherUpdate (hasOther) {
        console.log('hasOther updated', hasOther)
        this.questionHasOther = hasOther
      },
      onRowsUpdate (rows) {
        console.log('rows updated', rows)
        this.questionRows = rows
      },
      onColumnsUpdate (columns) {
        console.log('columns updated', columns)
        this.questionColumns = columns
      }
    }
  }
</script>
