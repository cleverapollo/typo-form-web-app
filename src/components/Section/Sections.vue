<template>
  <v-card active-class='active-section' class='elevation-12 mx-5'>
    <v-toolbar>
      <v-toolbar-title>{{ 'Section ' + section.order }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.prevent='toggleExpand'>
        <v-icon v-if='expanded'>expand_less</v-icon>
        <v-icon v-else>expand_more</v-icon>
      </v-btn>
      <v-menu offset-y bottom left>
        <v-btn icon slot='activator'>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click=''>
            <v-list-tile-title>
              <app-create-section :section_id='section.id' :form_id='form_id'></app-create-section>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-for='(action, key) in actions' :key="`action ${key}`" @click='action.cb'>
            <v-list-tile-title>{{ action.name }}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click=''>
            <v-list-tile-title>
              <app-create-question :section_id='section.id' :form_id='form_id'></app-create-question>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-card-title>
      <div class='section-name'>
        <template v-if='editMode'>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label='Section Name'
                v-model='editedName'
                autofocus
                @blur='checkUpdate'
              ></v-text-field>
            </v-flex>
          </v-layout>
        </template>
        <template v-else>
          <h1 @click='setEditMode'>{{ section.name }}</h1>
        </template>
      </div>
    </v-card-title>
    <v-card-text class='px-0'>
      <draggable v-model='list' v-show='expanded' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px'>
        <div v-for='(element, index) in list' :key='(isSection(element)  ? "Section " : "Question ") + element.id' class='item pb-5' :class='{ question: !isSection(element) }'>
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
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'
  import questions from '../Question/Questions.vue'
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
          name: 'Delete section',
          cb: this.deleteSection.bind(this)
        }],
        expanded: true,
        editMode: false
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
      setEditMode () {
        this.editMode = true
      },
      toggleExpand () {
        this.expanded = !this.expanded
      },
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
      checkUpdate: function () {
        if (this.editedName !== this.section.name) {
          this.updateSection()
        } else {
          this.editMode = false
        }
      }
    }
  }
</script>