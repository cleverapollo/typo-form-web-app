<template>
  <v-card flat active-class="active-section" v-if="!isSectionTrigger(section) || submissionId === -1">

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

          <template v-else-if="sections.length > 1">
            <div class="title px-3" @click="setEditMode">{{ editedName }}</div>
          </template>
        </div>
      </v-flex>

      <v-flex style="min-width: 130px; max-width: 130px;" v-if="submissionId === -1">
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
          <v-list-tile @click="" v-if="!includeQuestion && !hasRepeatableQuestions">
            <v-list-tile-avatar>
              <v-icon>create_new_folder</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <CreateSection :parentSectionId="section.id" :formId="formId"></CreateSection>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click.stop="deleteSection = true">
            <v-list-tile-avatar>
              <v-icon>delete</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>Delete Section</v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="" v-if="!includeSection">
            <v-list-tile-avatar>
              <v-icon>add</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <CreateQuestion :sectionId="section.id" :formId="formId"></CreateQuestion>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="createContentBlock" v-if="!includeSection">
            <v-list-tile-avatar>
              <v-icon>add_comment</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>Create Content Block</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text v-show="expanded">
      <v-layout row wrap justify-space-around v-if="hasRepeatableQuestions && submissionId === -1">
        <v-flex xs5 style="min-width: 130px">
          <v-text-field
            label="Minimum rows count"
            @change="updateRowsCount"
            v-model="min_rows"
            :rules="[validateMinRows]">
          </v-text-field>
        </v-flex>

        <v-flex xs5 style="min-width: 130px">
          <v-text-field
            label="Maximum rows count"
            @change="updateRowsCount"
            v-model="max_rows"
            :rules="[validateMaxRows]">
          </v-text-field>
        </v-flex>
      </v-layout>

      <triggers :formId="formId" :question="section" :questionOptions="questionOptions" type="Section" v-if="questionOptions.length > 0 && submissionId === -1"></triggers>
      
      <!-- //Form -->
      <template v-if="submissionId == -1">
        <v-flex xs12>

          <v-expansion-panel popout>
            <draggable
              v-model="list"
              :class="'section' + section.id"
              :options="{group: 'parent', draggable: '.v-expansion-panel__container', handle: '.item'}"
              @end="checkEnd"
              class="layout row wrap">
              <v-expansion-panel-content
                v-for="(element,index) in list"
                :key="index"
                :class="'element' + element.id"
              >
                <div slot="header">
                  <h3>
                    <v-icon class="item">drag_handle</v-icon>
                    {{index + 1 }}. {{ element.question || section.name }}
                  </h3>
                </div>
                <v-card>
                  <v-card-text>

                    <v-flex
                      xs12
                      :class="'element' + element.id">
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
                        :key="'question' + element.id"
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

                  </v-card-text>
                </v-card> 
              </v-expansion-panel-content>
            </draggable>
          </v-expansion-panel>

        </v-flex>
      </template>

      <!-- //Submission -->
      <template v-else>

        <!-- //Standard -->
        <v-layout row wrap v-if="!hasRepeatableQuestions">
          <template v-for="(element, index) in list" v-if="!isTrigger(element)">
            <responses
              :question="element"
              :formId="formId"
              :sectionId="section.id"
              :index="index + 1"
              :submissionId="submissionId"
              :key="'question' + element.id"
              :order="1"
              :status="status"
              v-if="getQuestionType(element.question_type_id) !== 'Content Block'"
            ></responses>

            <ResponseContentBlock
              :question="element"
              :key="'question' + element.id"
              v-if="getQuestionType(element.question_type_id) === 'Content Block'"
            ></ResponseContentBlock>
          </template>
        </v-layout>

        <!-- //Repeatable -->
        <template v-else>
          <v-layout
            row
            wrap
            v-for="order in hasRepeatableQuestions"
            :key="'repeat' + order"
          >

            <template v-for="(element, index) in list">
              <responses
                :question="element"
                :formId="formId"
                :sectionId="section.id"
                :index="index + 1"
                :submissionId="submissionId"
                :order="order"
                :hide="list.length === 1 && order > 1"
                :key="'question' + element.id + '-' + order"
                :status="status"
                v-if="getQuestionType(element.question_type_id) !== 'Content Block'"
              ></responses>

              <ResponseContentBlock
                :question="element"
                :key="'question' + element.id + '-' + order"
                v-if="getQuestionType(element.question_type_id) === 'Content Block'"
              ></ResponseContentBlock>
            </template>

            <template v-if='hasRepeatableQuestions > section.min_rows'>
              <v-flex xs12 sm1 offset-sm11 text-xs-center>
                <v-btn dark fab small color="error" @click="removeSection(order)" :disabled="status === 'Closed'">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-flex>
            </template>

          </v-layout>

          <v-layout wrap v-if='submissionId !== -1 && hasRepeatableQuestions && (hasRepeatableQuestions < section.max_rows || !section.max_rows)'>
            <v-btn dark block color="primary" @click="addSection" :disabled="status === 'Closed'">
              <v-icon dark>add</v-icon>
              Add {{section.name}}
            </v-btn>
          </v-layout>
        </template>

      </template>

<!--
      <draggable
        v-model="list"
        :class="'section' + section.id"
        :options="{group: 'parent', draggable: '.item'}"
        @end="checkEnd"
        style="min-height: 100px"
        class="layout row wrap"
        v-if="submissionId === -1 || !hasRepeatableQuestions"
      >
        <template v-for="(element, index) in list">
          <v-flex
            xs12
            class="item"
            :class="'element' + element.id"
            v-if="submissionId === -1">
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
              :key="'question' + element.id"
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
              :key="'question' + element.id"
              :order="1"
              :status="status"
              v-if="getQuestionType(element.question_type_id) !== 'Content Block'"
            ></responses>

            <ResponseContentBlock
              :question="element"
              :key="'question' + element.id"
              v-if="getQuestionType(element.question_type_id) === 'Content Block'"
            ></ResponseContentBlock>
          </template>
        </template>

        <div slot="footer" v-if="isSectionEmpty">
          <v-card>
            <v-card-title>
              <h3>This section has no questions.</h3>
            </v-card-title>
          </v-card>
        </div>
      </draggable>

      <v-layout
        row
        wrap
        v-else
        v-for="order in hasRepeatableQuestions"
        :key="'repeat' + order"
      >

        <template v-for="(element, index) in list">
          <responses
            :question="element"
            :formId="formId"
            :sectionId="section.id"
            :index="index + 1"
            :submissionId="submissionId"
            :order="order"
            :hide="list.length === 1 && order > 1"
            :key="'question' + element.id + '-' + order"
            :status="status"
            v-if="getQuestionType(element.question_type_id) !== 'Content Block'"
          ></responses>

          <ResponseContentBlock
            :question="element"
            :key="'question' + element.id + '-' + order"
            v-if="getQuestionType(element.question_type_id) === 'Content Block'"
          ></ResponseContentBlock>
        </template>

        <template v-if='hasRepeatableQuestions > section.min_rows'>
          <v-flex xs12 sm1 offset-sm11 text-xs-center>
            <v-btn dark fab small color="error" @click="removeSection(order)" :disabled="status === 'Closed'">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </template>

      </v-layout>

      <v-layout wrap v-if='submissionId !== -1 && hasRepeatableQuestions && (hasRepeatableQuestions < section.max_rows || !section.max_rows)'>
        <v-btn dark block color="primary" @click="addSection" :disabled="status === 'Closed'">
          <v-icon dark>add</v-icon>
          Add {{section.name}}
        </v-btn>
      </v-layout>

-->

    </v-card-text>

    <!-- //Delete Section -->
    <DeleteConfirmDialog @delete-action="onDeleteSection" :visible="deleteSection" @close="deleteSection = false"></DeleteConfirmDialog>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'
  import questions from '../Question/Questions'
  import responses from '../Response/Responses'
  import QuestionContentBlock from '../Question/components/ContentBlock'
  import ResponseContentBlock from '../Response/components/ContentBlock'
  import CreateSection from './CreateSection'
  import CreateQuestion from '../Question/CreateQuestion'
  import * as _ from 'lodash'
  import TriggerMixin from '../TriggerMixin.js'
  import triggers from '../Triggers'

  export default {
    name: 'sections',
    props: ['section', 'formId', 'submissionId'],
    mixins: [TriggerMixin],
    components: {
      draggable,
      questions,
      responses,
      CreateSection,
      CreateQuestion,
      QuestionContentBlock,
      ResponseContentBlock,
      triggers
    },
    data () {
      return {
        editedName: this.section.name,
        expanded: true,
        editMode: false,
        hasRepeatableQuestions: this.section.repeatable,
        min_rows: this.section.min_rows,
        max_rows: this.section.max_rows,
        deleteSection: false
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
      sections () {
        return this.$store.getters.loadedSections(this.formId)
      },
      submission () {
        if (!this.submissionId) {
          return null
        }
        return this.$store.getters.loadedSubmission(parseInt(this.formId), parseInt(this.submissionId))
      },
      statuses () {
        return this.$store.getters.statuses
      },
      status () {
        if (!this.submission) {
          return null
        }
        return this.getStatus(this.submission.status_id)
      },
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
      responses () {
        if (!this.submissionId) {
          return []
        }
        let responses = this.submission.responses.filter((response) => {
          const questions = this.section.questions.filter((question) => {
            return question.id === response.question_id
          })
          return questions.length
        })

        return _.sortBy(responses, element => {
          return element.order
        })
      },
      includeSection () {
        if (!this.list.length) {
          return false
        }
        return !!this.list[0].questions
      },
      includeQuestion () {
        if (!this.list.length) {
          return false
        }
        return !!this.list[0].answers
      },
      questionOptions () {
        const allQuestions = this.$store.getters.loadedAllQuestions(this.formId)
        // return _.sortBy(allQuestions, element => {
        //   return element.id
        // })
        return allQuestions
      }
    },
    methods: {
      getStatus (statusId) {
        const status = this.statuses.find((status) => {
          return status.id === statusId
        })
        return status ? status.status : 'undefined'
      },
      addSection () {
        this.hasRepeatableQuestions += 1
        this.updateSection()
      },
      removeSection (order) {
        if (this.hasRepeatableQuestions === 1) {
          return
        }
        this.hasRepeatableQuestions -= 1
        this.deleteSectionResponse(order)
        this.updateSection()
      },
      changeRepeatable (value) {
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
      deleteSectionResponse (order) {
        this.$store.dispatch('deleteSectionResponse', {
          submissionId: parseInt(this.submissionId),
          formId: this.formId,
          sectionId: this.section.id,
          order: order
        }).then((response) => {
          this.updateSubmission()
        })
      },
      updateSubmission () {
        this.$store.dispatch('updateSubmission', {
          id: parseInt(this.submissionId),
          formId: this.formId,
          progress: this.progress(parseInt(this.formId), parseInt(this.submissionId))
        })
      },
      setEditMode () {
        if (this.submissionId === -1) {
          this.editMode = true
        }
      },
      toggleExpand () {
        this.expanded = !this.expanded
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
      onDeleteSection () {
        this.$store.dispatch('deleteSection', {
          formId: this.formId,
          id: this.section.id
        })
      },
      checkNameUpdate () {
        if (this.editedName !== this.section.name) {
          this.updateSection()
        }
        this.editMode = false
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

        if (evt.item.className.length > 40) {
          return
        }

        let newIndex = evt.newIndex

        if (evt.to.className === evt.from.className && evt.newIndex > evt.oldIndex) {
          newIndex = newIndex + 1
        }

        const elementClass = evt.item.className
        const parentClass = evt.to.className
        const parentSectionId = parseInt(parentClass.substr(23))

        const children = _.sortBy(this.$store.getters.loadedChildren(this.formId, parentSectionId), element => {
          return element.order
        })

        let order = 1
        if (children.length === newIndex) {
          order = children[newIndex - 1].order + 1
        } else {
          order = children[newIndex].order
        }

        const oldparentClass = evt.from.className
        const oldParentSectionId = parseInt(oldparentClass.substr(23))
        const elementId = parseInt(elementClass.substr(36))
        this.$store.dispatch('moveQuestion',
          {
            formId: this.formId,
            questionId: elementId,
            oldParentSectionId: oldParentSectionId,
            parentSectionId: parentSectionId,
            order: order
          })
      },
      validateMinRows (value) {
        this.min_rows = parseInt(value)
        if (isNaN(this.min_rows)) {
          this.min_rows = ''
        }
        if (this.max_rows && this.min_rows > this.max_rows) {
          return 'Minimum rows count is set bigger than maximum rows count.'
        } else {
          return true
        }
      },
      validateMaxRows (value) {
        this.max_rows = parseInt(value)
        if (isNaN(this.max_rows)) {
          this.max_rows = ''
        }
        if (this.min_rows && this.min_rows > this.max_rows) {
          return 'Maximum rows count is set smaller than minimum rows count.'
        } else {
          return true
        }
      },
      updateRowsCount () {
        if (this.validateMinRows(this.min_rows) === true && this.validateMaxRows(this.max_rows) === true) {
          this.updateSection()
        }
      }
    }
  }
</script>

<style scoped>
  .v-card__title {
    flex-wrap: unset !important;
  }
</style>
