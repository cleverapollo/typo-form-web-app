<template>
  <v-card flat active-class="active-section">

    <!--
    <v-toolbar :class="{ 'handle': submissionId === -1 }">
      <v-toolbar-title>Section</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click.prevent="toggleExpand">
        <v-icon v-if="expanded">expand_less</v-icon>
        <v-icon v-else>expand_more</v-icon>
      </v-btn>

      <v-menu offset-y bottom left v-if="submissionId === -1">
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>

        <v-list>
          <v-list-tile @click="" v-if="includeSection || !includeQuestion">
            <v-list-tile-title>
              <CreateSection :parentSectionId="section.id" :formId="formId"></CreateSection>
            </v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="deleteSection">
            <v-list-tile-title>Delete Section</v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-show="!hasRepeatableQuestions" @click="" v-if="!includeSection || includeQuestion">
            <v-list-tile-title>
              <CreateQuestion :sectionId="section.id" :formId="formId"></CreateQuestion>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    -->

    <v-card-title>
      <v-flex>
        <div class="section-name">
          <template v-if="editMode">
            <v-text-field
              label="Section Name"
              v-model="editedName"
              @blur="checkNameUpdate"
            ></v-text-field>
          </template>

          <template v-else>
            <div class="title" @click="setEditMode">{{ editedName }}</div>
          </template>
        </div>
      </v-flex>

      <v-flex style="min-width: 130px; max-width: 130px;" class="mt-4" v-if="submissionId === -1">
        <v-switch
          label="Repeatable"
          v-model="hasRepeatableQuestions"
          @change="changeRepeatable($event)"
        ></v-switch>
      </v-flex>

      <v-menu offset-y bottom left v-if="submissionId === -1">
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>

        <v-list>
          <v-list-tile @click="" v-if="includeSection || !includeQuestion">
            <v-list-tile-title>
              <CreateSection :parentSectionId="section.id" :formId="formId"></CreateSection>
            </v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="deleteSection">
            <v-list-tile-title>Delete Section</v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-show="!hasRepeatableQuestions" @click="" v-if="!includeSection || includeQuestion">
            <v-list-tile-title>
              <CreateQuestion :sectionId="section.id" :formId="formId"></CreateQuestion>
            </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-show="!hasRepeatableQuestions" @click="createContentBlock" v-if="!includeSection || includeQuestion">
            <v-list-tile-title>Create Content Block</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text v-show="expanded">
      <template v-if="hasRepeatableQuestions">
        <question-repeatable
          :section="section"
          :form-id="formId"
          @update-limitation="updateRepeatableLimitation"
          @create-question="createQuestion"
          @delete-question="deleteQuestion"
          @update-question="updateQuestion"
          @create-answer="createAnswer"
          @delete-answer="deleteAnswer"
          @update-answer="updateAnswer"
          @move-answer="moveAnswer"
          @move-question="moveQuestion"
          v-if="submissionId === -1"
        >
        </question-repeatable>
        <response-repeatable
          :questions="section.questions"
          :min-rows="section.min_rows"
          :max-rows="section.max_rows"
          :responses="responses"
          @create-response="createResponse"
          @update-response="updateResponse"
          @delete-response="deleteResponse"
          v-else
        >
        </response-repeatable>
      </template>

      <draggable
        v-else
        v-model="list"
        :class="'section' + section.id"
        :options="{group: 'parent', draggable: '.item', handle: '.handle'}"
        @end="checkEnd"
        style="min-height: 100px"
      >
        <div
          v-for="(element, index) in list"
          :key="(isSection(element)  ? 'Section ' : 'Question ') + element.id"
          :class="(isSection(element)  ? 'section' : 'question') + element.id"
          class="pb-2 item"
        >
          <v-flex v-if="submissionId === -1">
            <sections
              :section="element"
              :formId="formId"
              :submissionId="submissionId"
              v-if="element.questions"
            ></sections>

            <questions
              :question="element"
              :formId="formId"
              :sectionId="section.id"
              :index="index + 1"
              v-if="element.answers && getQuestionType(element.question_type_id) !== 'Content Block'"
            ></questions>

            <QuestionContentBlock
              :question="element"
              :formId="formId"
              :sectionId="section.id"
              :index="index + 1"
              v-if="element.answers && getQuestionType(element.question_type_id) === 'Content Block'"
            ></QuestionContentBlock>
          </v-flex>

          <template v-else>
            <responses
              :question="element"
              :formId="formId"
              :sectionId="section.id"
              :index="index + 1"
              :submissionId="submissionId"
              v-if="getQuestionType(element.question_type_id) !== 'Content Block'"
            ></responses>

            <ResponseContentBlock
              :question="element"
              v-if="getQuestionType(element.question_type_id) === 'Content Block'"
            ></ResponseContentBlock>
          </template>
        </div>

        <div slot="footer" v-if="isSectionEmpty">
          <v-card>
            <v-card-title>
              <h3>This section has no questions.</h3>
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
  import QuestionContentBlock from '../Question/components/ContentBlock'
  import ResponseContentBlock from '../Response/components/ContentBlock'
  import CreateSection from './CreateSection'
  import CreateQuestion from '../Question/CreateQuestion'
  import * as _ from 'lodash'

  export default {
    name: 'sections',
    props: ['section', 'formId', 'submissionId'],
    components: {
      draggable,
      questions,
      responses,
      questionRepeatable,
      ResponseRepeatable,
      CreateSection,
      CreateQuestion,
      QuestionContentBlock,
      ResponseContentBlock
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
      section (value) {
        this.editedName = value.name
        this.hasRepeatableQuestions = value.repeatable
        this.min_rows = value.min_rows
        this.max_rows = value.max_rows
      }
    },
    computed: {
      list: {
        get () {
          return _.sortBy(this.$store.getters.loadedChildren(this.formId, this.section.id), element => {
            return element.order
          })
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
        if (!this.submissionId) {
          return []
        }
        let submission = this.$store.getters.loadedSubmission(parseInt(this.formId), parseInt(this.submissionId))
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
      },
      includeSection () {
        var includeSection = false
        this.list.forEach(function (item) {
          if (item.questions) {
            includeSection = true
          }
        })
        return includeSection
      },
      includeQuestion () {
        var includeQuestion = false
        this.list.forEach(function (item) {
          if (item.answers) {
            includeQuestion = true
          }
        })
        return includeQuestion
      },
      questionTypes () {
        return this.$store.getters.questionTypes
      }
    },
    methods: {
      getQuestionType (questionTypeId) {
        const questionType = this.questionTypes.find((questionType) => {
          return questionType.id === questionTypeId
        })
        return questionType ? questionType.type : 'undefined'
      },
      changeRepeatable (value) {
        this.$store.dispatch('deleteQuestions', {
          formId: this.formId,
          sectionId: this.section.id
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
          formId: this.formId,
          sectionId: this.section.id,
          question: qustionName,
          description: questionDescription,
          questionTypeId: questionType,
          mandatory: mandatory
        })
      },
      createContentBlock () {
        const questionType = this.questionTypes.find((questionType) => {
          return questionType.type === 'Content Block'
        })
        this.$store.dispatch('createQuestion', {
          formId: this.formId,
          sectionId: this.section.id,
          question: 'Content Block',
          description: '',
          questionTypeId: questionType.id,
          mandatory: false
        })
      },
      deleteQuestion (id) {
        this.$store.dispatch('deleteQuestion', {
          formId: this.formId,
          sectionId: this.section.id,
          id: id
        })
      },
      updateQuestion (args) {
        const index = args[0]
        const value = args[1]
        this.$store.dispatch('updateQuestion', {
          formId: this.formId,
          sectionId: this.section.id,
          id: index,
          question: value
        })
      },
      createAnswer (args) {
        const questionId = args[0]
        const answer = args[1]
        this.$store.dispatch('createAnswer', {
          formId: this.formId,
          sectionId: this.section.id,
          questionId: questionId,
          answer: answer,
          parameter: true
        })
      },
      deleteAnswer (args) {
        const questionId = args[0]
        const index = args[1]
        this.$store.dispatch('deleteAnswer', {
          formId: this.formId,
          sectionId: this.section.id,
          questionId: questionId,
          id: index
        })
      },
      updateAnswer (args) {
        const questionId = args[0]
        const index = args[1]
        const answer = args[2]
        this.$store.dispatch('updateAnswer', {
          formId: this.formId,
          sectionId: this.section.id,
          questionId: questionId,
          id: index,
          answer: answer
        })
      },
      createResponse (args) {
        if (this.submissionId <= 0) {
          return
        }
        const answerId = args[0]
        const response = args[1]
        const questionId = args[2]
        const order = args[3]
        this.$store.dispatch('createResponse', {
          submissionId: parseInt(this.submissionId),
          questionId: questionId,
          formId: this.formId,
          answerId: answerId,
          response: response,
          order: order
        }).then((response) => {
          this.updateSubmission()
        })
      },
      updateResponse (args) {
        const answerId = args[0]
        const response = args[1]
        const id = args[2]
        const questionId = args[3]
        const order = args[4]
        this.$store.dispatch('updateResponse', {
          submissionId: parseInt(this.submissionId),
          questionId: questionId,
          formId: this.formId,
          answerId: answerId,
          response: response,
          id: id,
          order: order
        }).then((response) => {
          this.updateSubmission()
        })
      },
      deleteResponse (args) {
        this.$store.dispatch('deleteResponse', {
          submissionId: parseInt(this.submissionId),
          questionId: args[1],
          formId: this.formId,
          id: args[0]
        }).then((response) => {
          this.updateSubmission()
        })
      },
      updateSubmission () {
        this.$store.dispatch('updateSubmission', {
          id: parseInt(this.submissionId),
          formId: this.formId,
          progress: this.progress()
        })
      },
      progress () {
        const sections = this.$store.getters.loadedSections(this.formId)
        let questionCount = 0
        let responseCount = 0
        sections.forEach(function (section) {
          let questions = this.$store.getters.loadedQuestions(this.formId, section.id).filter(question => question.mandatory)
          questionCount += questions.length
          questions.forEach(function (question) {
            let responses = this.$store.getters.loadedResponses(this.formId, this.id).filter(response => response.question_id === question.id)
            responseCount += responses.length ? 1 : 0
          }, this)
        }, this)

        return questionCount !== 0 ? responseCount * 100 / questionCount : 0
      },
      setEditMode () {
        if (this.submissionId === -1) {
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
            formId: this.formId,
            id: this.section.id,
            parentSectionId: this.section.parentSectionId,
            name: this.editedName,
            repeatable: this.hasRepeatableQuestions,
            min_rows: this.min_rows,
            max_rows: this.max_rows
          })
      },
      deleteSection () {
        this.$store.dispatch('deleteSection', {
          formId: this.formId,
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
        const questionId = args[0]
        const id = args[1]
        const order = args[2]
        this.$store.dispatch('moveAnswer', {
          formId: this.formId,
          sectionId: this.section.id,
          questionId: questionId,
          id: id,
          order: order
        })
      },
      moveQuestion (args) {
        const id = args[0]
        const order = args[1]
        this.$store.dispatch('moveQuestion',
          {
            formId: this.formId,
            questionId: id,
            oldParentSectionId: this.section.id,
            parentSectionId: this.section.id,
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

        const children = _.sortBy(this.$store.getters.loadedChildren(this.formId, parentSectionId), element => {
          return element.order
        })

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
              formId: this.formId,
              sectionId: elementId,
              parentSectionId: parentSectionId,
              order: order
            })
        } else {
          const oldparentClass = evt.from.className
          const oldParentSectionId = parseInt(oldparentClass.substr(7))
          const elementId = parseInt(elementClass.substr(18))
          this.$store.dispatch('moveQuestion',
            {
              formId: this.formId,
              questionId: elementId,
              oldParentSectionId: oldParentSectionId,
              parentSectionId: parentSectionId,
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
