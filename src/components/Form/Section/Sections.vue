<template>
  <v-card active-class='active-section' class='elevation-12 ma-1'>
    <v-toolbar :class='{ "handle": submission_id === -1 }'>
      <v-toolbar-title>{{ 'Section ' + index }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.prevent='toggleExpand'>
        <v-icon v-if='expanded'>expand_less</v-icon>
        <v-icon v-else>expand_more</v-icon>
      </v-btn>
      <v-menu offset-y bottom left v-if="submission_id === -1">
        <v-btn icon slot='activator'>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click=''>
            <v-list-tile-title>
              <app-create-section :parent_section_id='section.id' :form_id='form_id'></app-create-section>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click=deleteSection>
            <v-list-tile-title>Delete Section</v-list-tile-title>
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
      <v-flex>
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
      <v-flex style='min-width: 130px; max-width: 130px;' class='mt-4' v-if="submission_id === -1">
        <v-switch
          label='Repeatable'
          v-model='hasRepeatableQuestions'
          @change='changeRepeatable($event)'
        ></v-switch>
      </v-flex>
    </v-card-title>
    <v-card-text class='px-0' v-show='expanded'>
      <div v-if='hasRepeatableQuestions'>
        <div v-if="submission_id === -1">
          <question-repeatable
            :questions='section.questions'
            :min-rows='section.min_rows'
            :max-rows='section.max_rows'
            @update-limitation='updateRepeatableLimitation'
            @create-question='createQuestion'
            @delete-question='deleteQuestion'
            @update-question='updateQuestion'
            @create-answer='createAnswer'
            @delete-answer='deleteAnswer'
            @update-answer='updateAnswer'
            @move-answer='moveAnswer'
            @move-question='moveQuestion'
          >
          </question-repeatable>
        </div>
        <div v-else>
          <response-repeatable
            :questions='section.questions'
            :min-rows='section.min_rows'
            :max-rows='section.max_rows'
            :responses='responses'
            @create-response='createResponse'
            @update-response='updateResponse'
            @delete-response='deleteResponse'
          >
          </response-repeatable>
        </div>
      </div>
      <draggable v-else v-model='list' :class="'section' + section.id"
                 :options='{group:"parent", draggable:".item", handle:".handle"}' style='min-height: 100px'
                 @end="checkEnd">
        <div v-for='(element, index) in list' :key='(isSection(element)  ? "Section " : "Question ") + element.id'
             :class='(isSection(element)  ? "section" : "question") + element.id' class='pb-2 item'>
          <sections :section='element' :form_id='form_id' v-if='isSection(element)' :submission_id='submission_id'
                    :index='index + 1'></sections>
          <div v-else>
            <questions :question='element' :form_id='form_id' :section_id="section.id" :index='index + 1'
                       v-if="submission_id === -1"></questions>
            <responses :question='element' :form_id='form_id' :section_id="section.id" :index='index + 1'
                       :submission_id='submission_id' v-else></responses>
          </div>
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
  import responses from '../Response/Responses'
  import questionRepeatable from '../Question/components/QuestionRepeatable'
  import ResponseRepeatable from '../Response/components/ResponseRepeatable'
  import * as _ from 'lodash'

  export default {
    name: 'sections',
    props: ['section', 'form_id', 'submission_id', 'index'],
    components: {
      draggable,
      questions,
      responses,
      questionRepeatable,
      ResponseRepeatable
    },
    data () {
      return {
        editedName: this.section.name,
        expanded: true,
        editMode: false,
        hasRepeatableQuestions: this.section.repeatable,
        min_rows: this.section.min_rows,
        max_rows: this.section.max_rows
      }
    },
    watch: {
      repeatable (value) {
        this.hasRepeatableQuestions = value
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
      },
      repeatable () {
        return this.section.repeatable
      },
      responses () {
        if (!this.submission_id) {
          return []
        }
        let submission = this.$store.getters.loadedSubmission(parseInt(this.form_id), parseInt(this.submission_id))
        let responses = submission.responses.filter((response) => {
          const questions = this.section.questions.filter((question) => {
            return question.id === response.question_id
          })
          if (questions.length) {
            return true
          }
          return false
        })

        return _.sortBy(responses, element => {
          return element.order
        })
      }
    },
    methods: {
      changeRepeatable (value) {
        this.$store.dispatch('deleteQuestions', {
          formid: this.form_id,
          sectionid: this.section.id
        })
        if (value) {
          this.createQuestion(['Answers', 'This question contains answers', 1, true])
        }
        this.updateSection()
      },
      createQuestion (args) {
        const qustionName = args[0]
        const questionDescription = args[1]
        const questionType = args[2]
        const mandatory = args[3]

        this.$store.dispatch('createQuestion', {
          formid: this.form_id,
          sectionid: this.section.id,
          question: qustionName,
          description: questionDescription,
          question_type_id: questionType,
          mandatory: mandatory
        })
      },
      deleteQuestion (id) {
        this.$store.dispatch('deleteQuestion', {
          formid: this.form_id,
          sectionid: this.section.id,
          id: id
        })
      },
      updateQuestion (args) {
        const index = args[0]
        const value = args[1]
        this.$store.dispatch('updateQuestion', {
          formid: this.form_id,
          sectionid: this.section.id,
          id: index,
          question: value
        })
      },
      createAnswer (args) {
        const questionid = args[0]
        const answer = args[1]
        this.$store.dispatch('createAnswer', {
          formid: this.form_id,
          sectionid: this.section.id,
          questionid: questionid,
          answer: answer,
          parameter: true
        })
      },
      deleteAnswer (args) {
        const questionid = args[0]
        const index = args[1]
        this.$store.dispatch('deleteAnswer', {
          formid: this.form_id,
          sectionid: this.section.id,
          questionid: questionid,
          id: index
        })
      },
      updateAnswer (args) {
        const questionid = args[0]
        const index = args[1]
        const answer = args[2]
        this.$store.dispatch('updateAnswer', {
          formid: this.form_id,
          sectionid: this.section.id,
          questionid: questionid,
          id: index,
          answer: answer
        })
      },
      createResponse (args) {
        if (this.submission_id <= 0) {
          return
        }
        const answerid = args[0]
        const response = args[1]
        const questionid = args[2]
        const order = args[3]
        this.$store.dispatch('createResponse', {
          submissionid: this.submission_id,
          questionid: questionid,
          formid: this.form_id,
          answerid: answerid,
          response: response,
          order: order
        })
      },
      updateResponse (args) {
        const answerid = args[0]
        const response = args[1]
        const id = args[2]
        const questionid = args[3]
        const order = args[4]
        this.$store.dispatch('updateResponse', {
          submissionid: this.submission_id,
          questionid: questionid,
          formid: this.form_id,
          answerid: answerid,
          response: response,
          id: id,
          order: order
        })
      },
      deleteResponse (args) {
        this.$store.dispatch('deleteResponse', {
          submissionid: this.submission_id,
          questionid: args[1],
          formid: this.form_id,
          id: args[0]
        })
      },
      setEditMode () {
        if (this.submission_id === -1) {
          this.editMode = true
        }
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
            name: this.editedName,
            repeatable: this.hasRepeatableQuestions,
            min_rows: this.min_rows,
            max_rows: this.max_rows
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
      moveAnswer (args) {
        const questionid = args[0]
        const id = args[1]
        const order = args[2]
        this.$store.dispatch('moveAnswer', {
          formid: this.form_id,
          sectionid: this.section.id,
          questionid: questionid,
          id: id,
          order: order
        })
      },
      moveQuestion (args) {
        const id = args[0]
        const order = args[1]
        this.$store.dispatch('moveQuestion',
          {
            formid: this.form_id,
            questionid: id,
            oldparent_section_id: this.section.id,
            parent_section_id: this.section.id,
            order: order
          })
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
      },
      updateRepeatableLimitation (limitation) {
        this.min_rows = limitation.min_rows || this.min_rows
        this.max_rows = limitation.max_rows || this.max_rows
        this.updateSection()
      }
    }
  }
</script>
