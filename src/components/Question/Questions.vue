<template>
  <v-card active-class='active-question' class='elevation-12'>
    <v-toolbar>
      <v-toolbar-title>{{ 'Question ' + question.order }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-select
        :items='questionTypes'
        item-text='type'
        item-value='id'
        v-model='questionTypeId'
        label='Question Type'
        single-line
        hide-details
      ></v-select>
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
    <v-card-title>
      <div>
        <template v-if='editModeName'>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label='Question Name'
                v-model='editedName'
                autofocus
                @blur='checkUpdateName'
              ></v-text-field>
            </v-flex>
          </v-layout>
        </template>
        <template v-else>
          <h3 @mousedown='setEditModeName'>{{ question.question }}</h3>
        </template>
        <template v-if='editModeDescription'>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label='Description'
                v-model='editedDescription'
                autofocus
                @blur='checkUpdateDescription'
              ></v-text-field>
            </v-flex>
          </v-layout>
        </template>
        <template v-else>
          <h4 @mousedown='setEditModeDescription'>{{ question.description }}</h4>
        </template>
        <v-switch
          :label='`Required`'
          v-model='mandatory'
        ></v-switch>
      </div>
      <!--<h1>{{ question.name }}</h1>-->
      <!--</div>-->
    <!--</v-card-title>-->
    </v-card-title>
    <v-card-text>
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
      <!--<div slot='footer' v-if='isQuestionEmpty'>-->
        <!--<v-card>-->
          <!--<v-card-title>-->
            <!--<h3>There is no answers</h3>-->
          <!--</v-card-title>-->
        <!--</v-card>-->
      <!--</div>-->
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class='success' @click='duplicateQuestion'>Duplicate Question</v-btn>
      <v-btn class='primary' @click='updateQuestion'>Update Qustion</v-btn>
      <v-btn class='error' @click='deleteQuestion'>Delete Question</v-btn>
      <app-create-answer :order='answers.length === 0 ? 1 : answers[answers.length-1].order + 1' :form_id='form_id' :section_id='section_id' :question_id='question.id'></app-create-answer>
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
        editModeName: false,
        editModeDescription: false,
        editedName: this.question.question,
        editedDescription: this.question.description,
        questionTypeId: 1,
        mandatory: false,
        answers: this.question.answers,
        questionsComponentsMap: {
          'Short answer': shortAnswer,
          'Paragraph': paragraph,
          'Multiple choice': multipleChoice,
          'Checkboxes': checkboxes,
          'Dropdown': dropdown,
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
    mounted () {
      console.log('questionTypes', this.questionTypes)
    },
    computed: {
      questionTypes () {
        return this.$store.getters.loadedQuestionTypes
      },
      isQuestionEmpty () {
        return !this.answers.length
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
    methods: {
      checkMove: function (evt) {
        console.log(evt)
      },
      checkUpdateName: function () {
        if (this.editedName !== this.question.question) {
          this.updateQuestion()
        } else {
          this.editModeName = false
        }
      },
      checkUpdateDescription: function () {
        if (this.editedDescription !== this.question.description) {
          this.updateQuestion()
        } else {
          this.editModeDescription = false
        }
      },
      setEditModeName () {
        setTimeout(() => {
          this.editModeName = true
        }, 0)
      },
      setEditModeDescription () {
        setTimeout(() => {
          this.editModeDescription = true
        }, 0)
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
            question_type_id: this.questionType,
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
