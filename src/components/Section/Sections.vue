<template>
  <v-card active-class='active-section' class='elevation-12'
          v-bind:class='{"mx-5": section.parent_section_id !== null}'>
    <v-toolbar v-if="form_type==='questions'">
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
              <app-create-section :parent_section_id='section.id' :form_id='form_id'></app-create-section>
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
      <draggable v-if="form_type==='questions'" v-model='list' v-show='expanded' class='dragArea'
                 :options='{group:"people", draggable:".item"}'
                 style='min-height: 100px'>
        <div v-for='(element, index) in list' :key='(isSection(element)  ? "Section " : "Question ") + element.id'
             class='item pb-5' :class='{ question: !isSection(element) }'>
          <sections :section='element' :form_id='form_id' v-if='isSection(element)' :submission_id='submission_id'
                    :form_type="form_type"></sections>
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
      <div v-else>
        <div v-for='(element, index) in list' :key='(isSection(element)  ? "Section " : "Question ") + element.id'
             class='item pb-5' :class='{ question: !isSection(element) }'>
          <sections :section='element' :form_id='form_id' :submission_id='submission_id'
                    v-if='isSection(element)'></sections>
          <answer :question='element' :form_id='form_id' :submission_id='submission_id' :section_id="section.id"
                  v-else></answer>
        </div>
        <div slot='footer' v-if='isSectionEmpty'>
          <v-card>
            <v-card-title>
              <h3>There is no questions</h3>
            </v-card-title>
          </v-card>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'
  import questions from '../Question/Questions.vue'
  import answer from '../Submission/Answer/Answers.vue'

  export default {
    name: 'sections',
    props: ['section', 'form_id', 'submission_id', 'form_type'],
    components: {
      draggable,
      questions,
      answer
    },
    data () {
      return {
        editedName: this.section.name,
        actions: [{
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
          // TODO: Drggable components
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
            parent_section_id: this.section.parent_section_id,
            name: this.editedName
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