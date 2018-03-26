<template>
  <v-card>
    <v-toolbar>
      <v-spacer></v-spacer>
      <v-btn icon @click='toggleExpand'>
        <v-icon>expand</v-icon>
      </v-btn>
      <v-menu bottom left>
        <v-btn icon slot='activator'>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for='(item, key) in items' @click='item.cb'>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-card-title>
      <div class="section-name">
        <template v-if='expanded'>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label='Section Name'
                :value='section.name'
              ></v-text-field>
            </v-flex>
          </v-layout>
        </template>
        <template v-else>
          <h1>{{ 'Section ' + section.order }}</h1>
          <h2>{{ section.name }}</h2>
        </template>
      </div>
    </v-card-title>
    <v-card-text>
      <draggable v-model='list' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px' :move='checkMove' @add='checkAdd' @remove='checkRemove'>
        <div v-for='(element, index) in list' :key='(isSection(element)  ? "Section " : "Question ") + element.id' class='item' v-bind:class='{ question: !isSection(element) }'>
          <sections :section='element' :formid='formid' v-if='isSection(element)'></sections>
          <questions :element='element' v-else></questions>
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
      <v-btn class='success' @click=onDuplicateSection>Duplicate Section</v-btn>
      <v-btn class='error' @click=onDeleteSection>Delete Section</v-btn>
      <app-create-section :order='list.length === 0 ? 1 : list[list.length-1].order + 1' :section_id='section.id' :form_id='formid'></app-create-section>
      <app-create-question :order='list.length === 0 ? 1 : list[list.length-1].order + 1' :section_id='section.id'></app-create-question>
    </v-card-actions>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'
  import questions from '../Question/Questions.vue'
  export default {
    name: 'sections',
    props: ['section', 'formid'],
    components: {
      draggable,
      questions
    },
    data () {
      return {
        editedName: this.section.name,
        items: [{
          name: 'Duplicate section',
          cb: this.onDuplicateSection.bind(this)
        },
        {
          name: 'Add question',
          cb: this.addQuestion.bind(this)
        }],
        expanded: true
      }
    },
    computed: {
      list: {
        get () {
          return this.$store.getters.loadedChildren(this.formid, this.section.id)
        },
        set (value) {
          const updateObj = {
            id: this.section.id,
            value: value
          }
          this.$store.dispatch('updateSection', updateObj)
        }
      },
      isSectionEmpty () {
        return !this.list.length
      }
    },
    methods: {
      isSection (element) {
        return element.questions !== undefined
      },
      onUpdateSection () {
        if (this.editedName.trim() === '') {
          return
        }
        this.$store.dispatch('updateSection',
          {
            formid: this.section.form_id,
            section_id: this.section.section_id,
            order: this.section.order,
            name: this.editedName
          })
      },
      onDuplicateSection () {
        this.$store.dispatch('duplicateSection', {
          formid: this.formid,
          id: this.section.id
        })
      },
      onDeleteSection () {
        this.$store.dispatch('deleteSection', {
          formid: this.formid,
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
      toggleExpand: function () {
        this.expanded = !this.expanded
      },
      addQuestion: function () {
        console.log('add question here')
      }
    }
  }
</script>
