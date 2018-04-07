<template>
  <v-card active-class='active-section' class='elevation-12' v-bind:class='{"mx-5": section.parent_section_id !== null}'>
    <v-toolbar class='handle'>
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
          <v-list-tile v-show='!hasRepeatableQuestions' @click=''>
            <v-list-tile-title>
              <app-create-question :section_id='section.id' :form_id='form_id'></app-create-question>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-card-title>
      <v-layout column>
        <v-layout row>
          <v-flex xs12>
            <div class='section-name'>
              <template v-if='editMode'>
                <v-text-field
                  label='Section Name'
                  v-model='editedName'
                  autofocus
                  @blur='checkNameUpdate'
                ></v-text-field>
              </template>
              <template v-else>
                <h1 @click='setEditMode'>{{ section.name }}</h1>
              </template>
            </div>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-spacer></v-spacer>
            <v-checkbox
              label='Repeatable'
              v-model='hasRepeatableQuestions'
            ></v-checkbox>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-card-title>
    <v-card-text class='px-0'>
      <question-repeatable v-if='hasRepeatableQuestions' :questions='section.questions' :answers='section.questions[0].answers'></question-repeatable>
      <draggable v-else v-model='list' v-show='expanded' :class="'section' + section.id" :options='{group:"people", draggable:".item", handle:".handle"}' style='min-height: 100px' @end="checkEnd">
        <div v-for='(element, index) in list' :key='(isSection(element)  ? "Section " : "Question ") + element.id' :class='(isSection(element)  ? "section" : "question") + element.id' class='pb-5 item'>
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
  import questions from '../Question/Questions'
  import QuestionRepeatable from '../Question/components/QuestionRepeatable'
  export default {
    name: 'sections',
    props: ['section', 'form_id'],
    components: {
      draggable,
      questions,
      QuestionRepeatable
    },
    data () {
      return {
        editedName: this.section.name,
        actions: [{
          name: 'Delete section',
          cb: this.deleteSection.bind(this)
        }],
        expanded: true,
        editMode: false,
        hasRepeatableQuestions: this.section['repeatable']
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
      checkNameUpdate: function () {
        if (this.editedName !== this.section.name) {
          this.updateSection()
        } else {
          this.editMode = false
        }
      },
      checkEnd: function (evt) {
        if (evt.to.className === evt.from.className && evt.newIndex === evt.oldIndex) {
          return
        }
        if (evt.item.className.includes('question') && evt.to.className.includes('parent')) {
          return
        }
        let newIndex = evt.newIndex

        if (evt.to.className === evt.from.className && evt.newIndex > evt.oldIndex) {
          newIndex = newIndex + 1
        }

        const elementClass = evt.item.className
        const parentClass = evt.to.className
        let parentSectionId = parentClass.substr(7)
        if (parentSectionId === '') {
          parentSectionId = null
        } else {
          parentSectionId = parseInt(parentSectionId)
        }

        const children = this.$store.getters.loadedChildren(this.form_id, parentSectionId)
        let order = 0
        if (children.length === 0) {
          order = 1
        } else if (children.length === newIndex) {
          order = children[newIndex - 1].order + 1
        } else {
          order = children[newIndex].order
        }

        if (elementClass.includes('section')) {
          const elementId = parseInt(elementClass.substr(17))
          this.$store.dispatch('moveSection',
            {
              formid: this.form_id,
              sectionid: elementId,
              parent_section_id: parentSectionId,
              order: order
            })
        } else {
          const oldparentClass = evt.from.className
          const oldparentSectionId = parseInt(oldparentClass.substr(7))
          const elementId = parseInt(elementClass.substr(18))
          this.$store.dispatch('moveQuestion',
            {
              formid: this.form_id,
              questionid: elementId,
              oldparent_section_id: oldparentSectionId,
              parent_section_id: parentSectionId,
              order: order
            })
        }
      }
    }
  }
</script>
