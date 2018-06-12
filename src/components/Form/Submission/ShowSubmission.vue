<template>
  <v-layout row wrap v-if='submission'>
    <v-flex sm12 md10 offset-md1 xl8 offset-xl2>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">{{ submission.form.name }}</div>
        </v-flex>

        <!-- //Submission Layout -->
        <v-flex xs12>
          <v-card>

            <!-- //Header -->
            <v-card-title class="info white--text">
              <v-layout row wrap>
                <v-flex d-flex xs12>
                  <div class="title pt-3">{{ submissionOwner }}</div>

                  <!-- //Menu -->
                  <v-menu offset-y bottom left class="text-xs-right">
                    <v-btn icon slot="activator">
                      <v-icon class="white--text">more_vert</v-icon>
                    </v-btn>

                    <v-list>
                      <v-list-tile @click="">
                        <v-list-tile-title>
                          <EditSubmission :slug="slug" :submission="submission" :formId="formId"></EditSubmission>
                        </v-list-tile-title>
                      </v-list-tile>

                      <v-list-tile @click=onDeleteSubmission>
                        <v-list-tile-title>Delete Submission</v-list-tile-title>
                      </v-list-tile>

                      <v-list-tile @click=onSendSubmission v-if="sendAble">
                        <v-list-tile-title>Send Submission</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-flex>

              </v-layout>
            </v-card-title>
            
            <!-- // Submission Information -->
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <div class="body">Last Saved: {{ lastSaved }}</div>
                </v-flex>
                <v-flex xs12 sm6>
                  <div class="body text-sm-right" v-if='periodStart || periodEnd'>Period: {{ submissionPeriod }}</div>
                </v-flex>

                <!-- //Progress -->
                <v-flex xs12>
                  <v-progress-linear
                    :value="progress"
                    color="success"
                    height="10"
                  >
                    {{ progress.toFixed(0) }}
                  </v-progress-linear>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider></v-divider>

            <!-- //Form Content -->
            <v-card-text>
              <v-layout row wrap>

                <v-flex d-flex xs12>
                  <form-view
                    :slug="slug"
                    :formId="formId"
                    :submissionId="id"
                  ></form-view>
                </v-flex>

              </v-layout>
            </v-card-text>

            <!-- //Footer -->
            <v-divider></v-divider>
            <v-card-actions>

              <formNavigation
                :slug="slug"
                :formId="formId"
                :submissionId="id"
              ></formNavigation>

            </v-card-actions>

          </v-card>
        </v-flex>

      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  import moment from 'moment'
  import FormView from '../FormView'
  import EditSubmission from './EditSubmission'
  import FormNavigation from '../FormNavigation'

  export default {
    props: ['slug', 'id'],
    components: {
      FormView,
      EditSubmission,
      FormNavigation
    },
    computed: {
      submission () {
        return this.$store.getters.loadedApplicationSubmission(this.slug, parseInt(this.id))
      },
      allResponses () {
        return this.$store.getters.loadedResponses(this.formId, parseInt(this.id))
      },
      formId () {
        if (!this.submission) {
          return null
        }
        return this.submission.form.id
      },
      triggerTypes () {
        return this.$store.getters.triggerTypes
      },
      questionTypes () {
        return this.$store.getters.questionTypes
      },
      comparators () {
        return this.$store.getters.comparators
      },
      statuses () {
        return this.$store.getters.statuses
      },
      periodStart () {
        return this.submission.period_start ? this.submission.period_start.substring(0, 10) : ''
      },
      periodEnd () {
        return this.submission.period_end ? this.submission.period_end.substring(0, 10) : ''
      },
      sendAble () {
        if (new Date(this.periodStart).getTime() - new Date().getTime() > 0 || new Date(this.periodEnd).getTime() - new Date().getTime() < 0) {
          return false
        }

        if (this.statuses) {
          const statusIndex = _.findIndex(this.statuses, status => {
            return status.id === this.submission.status_id
          })
          if (statusIndex > -1 && this.statuses[statusIndex].status !== 'Open') {
            return false
          }
        }

        return (this.progress === 100)
      },
      submissionOwner () {
        if (this.submission.team == null) {
          return this.submission.user.first_name + ' ' + this.submission.user.last_name
        } else {
          return this.submission.team.name
        }
      },
      progress () {
        const sections = this.$store.getters.loadedSections(this.formId)
        let questionCount = 0
        let responseCount = 0
        sections.forEach(function (section) {
          let questions = this.$store.getters.loadedQuestions(this.formId, section.id).filter(question => question.mandatory && this.isTrigger(question))
          questionCount += questions.length
          questions.forEach(function (question) {
            if (this.isTrigger(question)) {
              let responses = this.$store.getters.loadedResponses(this.formId, parseInt(this.id)).filter(response => response.question_id === question.id)
              responseCount += responses.length ? 1 : 0
            }
          }, this)
        }, this)

        return questionCount !== 0 ? responseCount * 100 / questionCount : 0
      },
      submissionPeriod () {
        if (this.periodStart && this.periodEnd) {
          return moment(this.periodStart).format('MMM Do YYYY') + ' - ' + moment(this.periodEnd).format('MMM Do YYYY')
        } else if (this.periodStart || this.periodEnd) {
          return this.periodStart ? moment(this.periodStart).format('MMM Do YYYY') : moment(this.periodEnd).format('MMM Do YYYY')
        } else {
          return null
        }
      },
      lastSaved () {
        return moment(this.submission.updated_at.date).format('MMM Do YYYY h:mm A')
      }
    },
    methods: {
      onDeleteSubmission: function () {
        this.$store.dispatch('deleteSubmission',
          {
            formId: this.formId,
            id: this.id
          }
        )
          .then(() => {
            this.$router.push('/' + this.slug + '/submissions')
          })
      },
      onSendSubmission: function () {
        const statusIndex = _.findIndex(this.statuses, status => {
          return status.status === 'Closed'
        })

        this.$store.dispatch('updateSubmission',
          {
            formId: this.formId,
            id: this.id,
            statusId: this.statuses[statusIndex].id
          }
        )
      },
      triggerType (questionTypeId, comparatorId) {
        return this.triggerTypes.filter((triggerType) => {
          return triggerType.question_type_id === questionTypeId && triggerType.comparator_id === comparatorId
        })[0]
      },
      getQuestionType (questionTypeId) {
        const questionType = this.questionTypes.find((questionType) => {
          return questionType.id === questionTypeId
        })
        return questionType ? questionType.type : 'undefined'
      },
      getComparator (comparatorId) {
        const comparator = this.comparators.find((comparator) => {
          return comparator.id === comparatorId
        })
        return comparator ? comparator.comparator : 'undefined'
      },
      isTrigger (question) {
        let questionTriggers = this.$store.getters.loadedQuestionTrigger(this.formId, question.id)
        const $this = this
        let triggerF = false
        let tempF = true

        _.forEach(questionTriggers, function (questionTrigger) {
          if (questionTrigger.operator === 1) {
            triggerF |= tempF && $this.compareCondition(questionTrigger)
            tempF = true
          } else {
            tempF &= $this.compareCondition(questionTrigger)
          }
        })

        return triggerF || tempF
      },
      compareCondition (questionTrigger) {
        let question = this.$store.getters.loadedAllQuestion(this.formId, parseInt(questionTrigger.parent_question_id))
        let parentResponses = this.parentResponses(questionTrigger.parent_question_id)
        let triggerType = this.triggerType(question.question_type_id, questionTrigger.comparator_id)

        let questionTypeID = question.question_type_id
        let comparatorID = questionTrigger.comparator_id
        let answerF = triggerType.answer
        let valueF = triggerType.value
        let answer = questionTrigger.parent_answer_id
        let value = questionTrigger.value

        let questionAnswer = ''
        let questionValue = ''
        if (parentResponses.length > 0) {
          if (this.getQuestionType(questionTypeID) === 'Checkboxes') {
            let filteredResponses = parentResponses.filter(function (parentResponse) {
              return parentResponse.answer_id === answer
            })
            if (filteredResponses.length > 0) {
              questionAnswer = answer.toString()
            }
          } else if (this.getQuestionType(questionTypeID) === 'Checkbox grid') {
            let filteredResponses = parentResponses.filter(function (parentResponse) {
              return parentResponse.answer_id === answer && parentResponse.response === value
            })
            if (filteredResponses.length > 0) {
              questionAnswer = answer.toString()
              questionValue = value
            }
          } else {
            if (parentResponses[0].answer_id) {
              console.log(parentResponses[0])
              questionAnswer = parentResponses[0].answer_id.toString()
            }
            questionValue = parentResponses[0].response
          }
        }

        answer = answer ? answer.toString() : null
        const comparator = this.getComparator(comparatorID)
        switch (comparator) {
          case 'equals':
            if (!answerF) {
              if (questionValue === value) {
                return true
              }
            } else {
              if (!valueF) {
                return questionAnswer === answer
              } else {
                return questionAnswer === answer && questionValue === value
              }
            }
            break
          case 'less than':
            if (!answerF) {
              if (questionValue < value) {
                return true
              }
            } else {
              if (questionAnswer < answer) {
                return true
              }
            }
            break
          case 'greater than':
            if (!answerF) {
              if (questionValue > value) {
                return true
              }
            } else {
              if (questionAnswer > answer) {
                return true
              }
            }
            break
          case 'less than or equal to':
            if (!answerF) {
              if (questionValue <= value) {
                return true
              }
            } else {
              if (questionAnswer <= answer) {
                return true
              }
            }
            break
          case 'greater than or equal to':
            if (!answerF) {
              if (questionValue >= value) {
                return true
              }
            } else {
              if (questionAnswer >= answer) {
                return true
              }
            }
            break
          case 'contain':
            if (this.getQuestionType(questionTypeID) === 'Checkboxes') {
              return questionAnswer === answer
            } else if (this.getQuestionType(questionTypeID) === 'Checkbox grid') {
              return questionAnswer === answer && questionValue === value
            } else {
              if (!answerF) {
                return _.includes(questionValue, value)
              } else {
                if (!valueF) {
                  return _.includes(questionAnswer, answer)
                } else {
                  return _.includes(questionAnswer, answer) && _.includes(questionValue, value)
                }
              }
            }
          case 'starts with':
            if (!answerF) {
              return _.startsWith(questionValue, value)
            } else {
              return _.startsWith(questionAnswer, answer)
            }
          case 'ends with':
            if (!answerF) {
              return _.endsWith(questionValue, value)
            } else {
              return _.endsWith(questionAnswer, answer)
            }
          case 'is null':
            if (parentResponses.length > 0) {
              return false
            } else {
              return true
            }
          case 'is not null':
            if (parentResponses.length > 0) {
              return true
            } else {
              return false
            }
          default:
            break
        }

        return false
      },
      parentResponses (questionId) {
        return this.allResponses.filter((response) => {
          return response.question_id === questionId
        })
      }
    },
    created () {
      this.$store.dispatch('loadUsers', this.slug)
      this.$store.dispatch('loadTeams', this.slug)
      this.$store.dispatch('loadForms', this.slug)
      this.$store.dispatch('loadAllSubmissions', this.slug)
        .then(() => {
          this.$store.dispatch('loadSections', this.formId)
          this.$store.dispatch('loadValidations', this.formId)
          this.$store.dispatch('loadTriggers', this.formId)
        })
      this.$store.dispatch('selectSection', null)
    }
  }
</script>
