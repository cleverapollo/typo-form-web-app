<template>
  <v-card active-class='active-question' class='elevation-12'>
    <v-toolbar>
      <v-toolbar-title>{{ 'Question ' + question.order }}</v-toolbar-title>
      <!--<v-menu bottom left>-->
        <!--<v-btn icon slot='activator'>-->
          <!--{{ questionTypeString }}-->
        <!--</v-btn>-->
        <!--<v-list>-->
          <!--<v-list-tile v-for='(type, key) in types' :key='`type ${key}`' @click='setTypeKey(key)'>-->
            <!--<v-list-tile-title>{{ type.name }}</v-list-tile-title>-->
          <!--</v-list-tile>-->
        <!--</v-list>-->
      <!--</v-menu>-->
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
          <v-flex xs7 offset-xs1>
            <v-select
              :items='questionTypes'
              item-text='type'
              item-value='id'
              v-model='questionTypeId'
              label='Question Type'
              single-line
              auto
              @change='updateQuestionType'
            ></v-select>
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
          :label='`Required`'
          v-model='mandatory'
        ></v-switch>
        <!--<app-create-answer :order='answers.length === 0 ? 1 : answers[answers.length-1].order + 1' :form_id='form_id' :section_id='section_id' :question_id='question.id'></app-create-answer>-->
    </v-card-actions>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'
//  import answers from '../Answer/Answers.vue'
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
      draggable
    },
    data () {
      return {
        editedName: this.question.question,
        editedDescription: this.question.description,
        questionTypeId: this.question.question_type_id,
        mandatory: this.question.mandatory,
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
        questionColumns: []
      }
    },
    computed: {
      questionTypes () {
        return this.$store.getters.loadedQuestionTypes
      },
      questionComponent: {
        get: function () {
          const index = _.findIndex(this.questionTypes, type => { return type.id === this.questionTypeId })
          if (this.questionTypes[index]) {
            return this.questionsComponentsMap[ this.questionTypes[index].type ]
          } else {
            return this.questionsComponentsMap[ 'Short answer' ]
          }
        }
      }
    },
    watch: {
      mandatory (value) {
        this.updateQuestion()
      }
    },
    methods: {
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
      updateQuestionType (value) {
        this.questionTypeId = value
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
