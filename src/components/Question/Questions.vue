<template>
  <v-card active-class='active-question' class='elevation-12'>
    <v-toolbar>
      <v-toolbar-title>{{ 'Question ' + question.order }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.prevent='toggleExpand'>
        <v-icon>expand</v-icon>
      </v-btn>
      <v-menu bottom left>
        <v-btn icon slot='activator'>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for='(type, key) in types' :key='`type ${key}`' @click='selectComponent(key)'>
            <v-list-tile-title>{{ type.name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-card-title>
      <div>
        <h3>{{'Question ' + (question.order)}}</h3>
        <v-text-field
          name='name'
          label='Question'
          id='name'
          v-model='editedName'
          required></v-text-field>
        <v-text-field
          name='description'
          label='Description'
          id='description'
          v-model='editedDescription'
          required></v-text-field>
        <v-select
          :items='questionTypes'
          item-text='type'
          item-value='id'
          v-model='questionType'
          label='Question Type'
          single-line
        ></v-select>
        <v-switch
          :label='`Required`'
          v-model='mandatory'
        ></v-switch>
      </div>
      <!--<h1>{{ question.name }}</h1>-->
      <!--</div>-->
    <!--</v-card-title>-->
    <!--<v-card-text>-->
      <!--<component :is='questionComponent'></component>-->
    <!--</v-card-text>-->
    </v-card-title>
    <v-card-text>
      <draggable v-model='answers' class='dragArea' :options='{group:"people", draggable:".item" + question.id}' style='min-height: 100px'>
        <div v-for='(element, index) in answers' :key='"Answer " + element.id' class='"item" + question.id'>
          <answers :answer='element' :form_id='form_id' :section_id='section_id' :question_id ='question.id'></answers>
        </div>
        <div slot='footer' v-if='isQuestionEmpty'>
          <v-card>
            <v-card-title>
              <h3>There is no answers</h3>
            </v-card-title>
          </v-card>
        </div>
      </draggable>
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
        questionType: 1,
        mandatory: false,
        answers: this.question.answers,
        questionComponent: null,
        types: [
          {
            name: 'Short answer',
            component: null
          },
          {
            name: 'Paragraph',
            component: null
          },
          {
            name: 'Multiple Choice',
            component: null
          },
          {
            name: 'Checkboxes',
            component: null
          },
          {
            name: 'Drop-down',
            component: null
          },
          {
            name: 'File upload',
            component: null
          },
          {
            name: 'Linear scale',
            component: null
          },
          {
            name: 'Multiple choice grid',
            component: null
          },
          {
            name: 'Checkbox grid',
            component: null
          },
          {
            name: 'Date',
            component: null
          },
          {
            name: 'Time',
            component: null
          }
        ]
      }
    },
    computed: {
      questionTypes () {
        return this.$store.getters.loadedQuestionTypes
      },
      isQuestionEmpty () {
        return !this.answers.length
      }
    },
    methods: {
      toggleExpand: _.debounce(function () {
        this.expanded = !this.expanded
      }, 100),
      checkMove: function (evt) {
        console.log(evt)
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
      selectComponent: function (key) {
        this.questionComponent = this.types[ key ].component
      }
    }
  }
</script>
