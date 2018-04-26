<template>
  <div>
    <v-card-actions>
      <app-create-section
        :parentSectionId="-1"
        :formId="formId"
        v-if="submissionId === -1"
      ></app-create-section>

      <v-flex v-if="isAdmin">
        <v-btn
          color="primary"
          @click="changeView('responses')"
          v-if="submissionId === -1"
        >
          View Responses
        </v-btn>

        <v-btn
          color="primary"
          @click="changeView('questions')"
          v-else
        >
          View Questions
        </v-btn>
      </v-flex>

      <v-spacer></v-spacer>

      <v-btn
        color="error"
        @click="deleteSubmission"
        v-if="removable"
      >
        Delete
      </v-btn>

      <v-btn
        color="primary"
        @click="sendSubmission"
        v-if="sendAble"
      >
        Send
      </v-btn>
    </v-card-actions>

    <v-card class="mb-3" v-if="submissionId > 0">
      <v-layout row wrap class="pa-3">
        <v-toolbar-title  class="d-flex align-center">Submission Progress</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-progress-circular
          xs4
          :size="100"
          :width="15"
          :rotate="-90"
          :value="progress"
          color="primary"
        >
          {{ progress.toFixed(2) }}
        </v-progress-circular>
      </v-layout>
    </v-card>

    <v-layout row wrap>
      <v-flex xs3>
        <form-tree
          :formId="formId"
          :section="section"
          :list="list"
          :view="view"
          @section-clicked="sectionClicked"
        ></form-tree>
      </v-flex>

      <v-flex>
        <sections
          :section="section"
          :formId="formId"
          :submissionId="submissionId"
          v-if="section"
        ></sections>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import * as _ from 'lodash'
  import sections from './Section/Sections'
  import FormTree from './FormTree'

  export default {
    props: ['applicationName', 'formId', 'submissionId', 'isAdmin', 'view'],
    components: {
      sections,
      FormTree
    },
    computed: {
      list: {
        get () {
          return this.$store.getters.loadedChildren(this.formId, null)
        },
        set (value) {
          // TODO: draggable
        }
      },
      statuses () {
        return this.$store.getters.statuses
      },
      sendAble () {
        if (this.submissionId <= 0) {
          return false
        }

        if (this.statuses) {
          const statusIndex = _.findIndex(this.statuses, status => {
            return status.id === this.submission.status_id
          })
          if (statusIndex > 0 && this.statuses[statusIndex].status !== 'opened') {
            return false
          }
        }

        return (this.progress === 100)
      },
      removable () {
        if (this.submissionId <= 0) {
          return false
        }

        if (this.statuses) {
          const statusIndex = _.findIndex(this.statuses, status => {
            return status.id === this.submission.status_id
          })
          if (statusIndex > 0 && (this.statuses[statusIndex].status !== 'opened' && this.statuses[statusIndex].status !== 'closed')) {
            return false
          }
        }

        return true
      },
      submission () {
        return this.$store.getters.loadedSubmission(this.formId, this.submissionId)
      },
      progress () {
        if (this.submissionId > 0) {
          const sections = this.$store.getters.loadedSections(this.formId)
          let questionCount = 0
          let responseCount = 0
          sections.forEach(function (section) {
            let questions = this.$store.getters.loadedQuestions(this.formId, section.id).filter(question => question.mandatory)
            questionCount += questions.length
            questions.forEach(function (question) {
              let responses = this.$store.getters.loadedResponses(this.formId, this.submissionId).filter(response => response.question_id === question.id)
              responseCount += responses.length
            }, this)
          }, this)

          return responseCount * 100 / questionCount
        }
      },
      section () {
        let rtSection = this.$store.getters.loadSelectedSection()
        if (!rtSection) {
          if (this.view === 'questions') {
            const sections = this.$store.getters.loadedChildren(this.formId, null)
            if (sections.length === 0) {
              rtSection = null
            } else {
              rtSection = sections[0]
            }
          } else {
            rtSection = this.getChildSection(this.list)
          }
          this.$store.dispatch('selectSection', rtSection)
        } else {
          if (this.view === 'responses') {
            const children = this.$store.getters.loadedChildren(this.formId, rtSection.id)
            if (children.length > 0 && children[0].questions) {
              rtSection = this.getChildSection(rtSection)
              this.$store.dispatch('selectSection', rtSection)
            }
          }
        }
        return rtSection
      }
    },
    methods: {
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

        const children = this.$store.getters.loadedChildren(this.formId, parentSectionId)
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
      deleteSubmission: function () {
        this.$store.dispatch('deleteSubmission',
          {
            formId: this.formId,
            id: this.submissionId
          }
        )
      },
      sendSubmission: function () {
        const statusIndex = _.findIndex(this.statuses, status => {
          return status.status === 'closed'
        })

        this.$store.dispatch('updateSubmission',
          {
            formId: this.formId,
            id: this.submissionId,
            statusId: this.statuses[statusIndex].id
          }
        )
      },
      sectionClicked: function (item) {
        this.$store.dispatch('selectSection', item)
      },
      changeView (view) {
        this.$emit('change-view', view)
      },
      getChildSection (rtSection) {
        let repeat = true
        let ptSection = rtSection

        while (repeat) {
          let children = this.$store.getters.loadedChildren(this.formId, ptSection.id)
          if (children.length > 0) {
            if (children[0].answers) {
              repeat = false
            } else {
              ptSection = children[0]
            }
          } else {
            repeat = false
          }
        }

        return ptSection
      }
    }
  }
</script>

<style>
  .expansion-panel .card__text {
    padding-right: 0 !important;
  }
</style>
