<template>
  <v-card active-class='active-section' class='elevation-12'>
    <v-toolbar>
      <v-toolbar-title>{{ 'Section ' + section.order }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.prevent='toggleExpand'>
        <v-icon>expand</v-icon>
      </v-btn>
      <v-menu bottom left>
        <v-btn icon slot='activator'>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for='(action, key) in actions' :key="`action ${key}`" @click='action.cb'>
            <v-list-tile-title>{{ action.name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-card-title>
      <div class='section-name'>
        <template v-if='expanded'>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label='Section Name'
                v-model='editedName'
                autofocus
              ></v-text-field><!-- @blur='checkUpdate' -->
            </v-flex>
          </v-layout>
        </template>
        <template v-else>
          <h1 @click='toggleExpand'>{{ section.name }}</h1>
        </template>
      </div>
    </v-card-title>
    <v-card-text>
      <draggable v-model='list' v-show='expanded' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px' :move='checkMove' @add='checkAdd' @remove='checkRemove'>
        <div v-for='(element, index) in list' :key='(isSection(element)  ? "Section " : "Question ") + element.id' class='item' :class='{ question: !isSection(element) }'>
          <sections :section='element' :form_id='form_id' v-if='isSection(element)'></sections>
          <questions :question='element' :form_id='form_id' :section_id="section.id" v-else></questions>
        </div>
        <div slot='footer' v-if='isSectionEmpty'>
          <v-card>
            <v-card-title>
              <h3>There is no questions</h3>
            </v-card-title>
          </v-card>
        </div>
      </draggable>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class='success' @click='duplicateSection'>Duplicate Section</v-btn>
      <v-btn class="primary" @click='updateSection'>Update Section</v-btn>
      <v-btn class='error' @click='deleteSection'>Delete Section</v-btn>
      <app-create-section :order='list.length === 0 ? 1 : list[list.length-1].order + 1' :section_id='section.id' :form_id='form_id'></app-create-section>
      <app-create-question :order='list.length === 0 ? 1 : list[list.length-1].order + 1' :section_id='section.id' :form_id='form_id'></app-create-question>
    </v-card-actions>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'
  import questions from '../Question/Questions.vue'
  import * as _ from 'lodash'
  export default {
    name: 'sections',
    props: ['section', 'form_id'],
    components: {
      draggable,
      questions
    },
    data () {
      return {
        editedName: this.section.name,
        actions: [{
          name: 'Duplicate section',
          cb: this.duplicateSection.bind(this)
        },
        {
          name: 'Add question',
          cb: this.addQuestion.bind(this)
        }],
        expanded: false
      }
    },
    computed: {
      list: {
        get () {
          return this.$store.getters.loadedChildren(this.form_id, this.section.id)
        },
        set (value) {
          /* const updateObj = {
            id: this.section.id,
            value: value
          }
          this.$store.dispatch('updateSection', updateObj) */
        }
      },
      isSectionEmpty () {
        return !this.list.length
      }
    },
    methods: {
      toggleExpand: _.debounce(function () {
        this.expanded = !this.expanded
      }, 200),
      isSection (element) {
        return element.questions !== undefined
      },
      updateSection () {
        if (this.editedName.trim() === '') {
          return
        }
        this.$store.dispatch('updateSection',
          {
            formid: this.form_id,
            id: this.section.id,
            section_id: this.section.section_id,
            order: this.section.order,
            name: this.editedName
          })
      },
      duplicateSection () {
        this.$store.dispatch('duplicateSection', {
          formid: this.form_id,
          id: this.section.id
        })
      },
      deleteSection () {
        this.$store.dispatch('deleteSection', {
          formid: this.form_id,
          id: this.section.id
        })
      },
      checkMove: function (evt) {
        console.log('moved', evt)
        if (evt.to.className.includes('parent') && evt.dragged.className.includes('question')) {
          return false
        }
        return true
      },
      checkAdd: function (evt) {
        console.log('added', evt)
      },
      checkRemove: function (evt) {
        console.log('removed', evt)
      },
      addQuestion: function () {
        console.log('add question here')
      },
      checkUpdate: function () {
        if (this.editedName !== this.section.name) {
          this.updateSection()
        } else {
          this.toggleExpand()
        }
      }
    }
  }
</script>
