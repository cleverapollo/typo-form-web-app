<template>
  <v-flex :class='"xs" + (question.width ? question.width : 12)' question-group>
    
    <v-layout row wrap question-head>
      <v-flex xs12>
        <div class="body-2">{{ editedName }}</div>
      </v-flex>
      <v-flex xs12>
        <div class="body-1 grey--text text--darken-1" v-if='editedDescription'>
          {{ editedDescription }}
        </div>
      </v-flex>
    </v-layout>

    <component
      :is="questionComponent"
      :answers="answers"
      :responses="responses"
      :question-id="question.id"
      :question="editedName"
      form-id="formId"
      :submission-id="submissionId"
      @create-response="createResponse"
      @update-response="updateResponse"
      @delete-response="deleteResponse"
    ></component>
  </v-flex>
</template>

<script>
  import draggable from 'vuedraggable'
  import * as _ from 'lodash'
  import shortAnswer from './components/ShortAnswer'
  import paragraph from './components/Paragraph'
  import multipleChoice from './components/MultipleChoice'
  import checkboxes from './components/Checkboxes'
  import dropdown from './components/Dropdown'
  import fileupload from './components/FileUpload'
  import linearScale from './components/LinearScale'
  import multipleChoiceGrid from './components/MultipleChoiceGrid'
  import checkboxGrid from './components/CheckboxGrid'
  import dateComponent from './components/Date'
  import timeComponent from './components/Time'
  import ContentBlock from './components/ContentBlock'

  export default {
    props: ['question', 'formId', 'submissionId', 'index', 'sectionId'],
    components: {
      draggable
    },
    data () {
      return {
        editedName: this.question.question,
        editedDescription: this.question.description,
        questionTypeId: this.question.question_type_id,
        mandatory: !!this.question.mandatory, // got number type
        questionsComponentsMap: {
          'Short answer': shortAnswer,
          'Paragraph': paragraph,
          'Multiple choice': multipleChoice,
          'Checkboxes': checkboxes,
          'Dropdown': dropdown,
          'File upload': fileupload,
          'Linear scale': linearScale,
          'Multiple choice grid': multipleChoiceGrid,
          'Checkbox grid': checkboxGrid,
          'Date': dateComponent,
          'Time': timeComponent,
          'Content Block': ContentBlock
        },
        hasValidation: false
      }
    },
    computed: {
      answers () {
        return _.sortBy(this.question.answers, element => {
          return 1000000 * (1 - element.parameter) + element.order
        })
      },
      responses () {
        if (!this.submissionId) {
          return []
        }
        let submission = this.$store.getters.loadedSubmission(this.formId, parseInt(this.submissionId))
        return submission.responses.filter((response) => {
          return response.question_id === this.question.id
        })
      },
      allResponses () {
        return this.$store.getters.loadedResponses(this.formId, parseInt(this.submissionId))
      },
      questionTypes () {
        return this.$store.getters.questionTypes
      },
      comparators () {
        return this.$store.getters.comparators
      },
      questionTypeString: {
        get: function () {
          const index = _.findIndex(this.questionTypes, type => {
            return type.id === this.questionTypeId
          })
          if (this.questionTypes[index]) {
            return this.questionTypes[index].type
          } else {
            return 'Short answer'
          }
        },
        set: function (str) {
          this.setQuestionType(str)
        }
      },
      questionComponent: {
        get: function () {
          return this.questionsComponentsMap[this.questionTypeString]
        }
      },
      questionTriggers () {
        return this.$store.getters.loadedQuestionTrigger(this.formId, parseInt(this.question.id))
      },
      triggerTypes () {
        return this.$store.getters.triggerTypes
      },
      isTrigger () {
        const $this = this
        let triggerF = false
        let tempF = true

        _.forEach(this.questionTriggers, function (questionTrigger) {
          if (questionTrigger.operator === 1) {
            triggerF |= tempF && $this.compareCondition(questionTrigger)
            tempF = true
          } else {
            tempF &= $this.compareCondition(questionTrigger)
          }
        })

        return triggerF || tempF
      }
    },
    methods: {
      setQuestionType (str) {
        this.questionTypeId = _.findIndex(this.questionTypes, type => {
          return type.type === str
        }) + 1
      },
      createResponse (args) {
        if (!this.submissionId) {
          return
        }
        const answerId = args[0]
        const response = args[1]
        this.$store.dispatch('createResponse', {
          submissionId: parseInt(this.submissionId),
          questionId: this.question.id,
          formId: this.formId,
          answerId: answerId,
          response: response
        }).then((response) => {
          this.updateSubmission()
        })
      },
      updateResponse (args) {
        const answerId = args[0]
        const response = args[1]
        const id = args[2]
        this.$store.dispatch('updateResponse', {
          submissionId: parseInt(this.submissionId),
          questionId: this.question.id,
          formId: this.formId,
          answerId: answerId,
          response: response,
          id: id
        }).then((response) => {
          this.updateSubmission()
        })
      },
      deleteResponse (id) {
        this.$store.dispatch('deleteResponse', {
          submissionId: parseInt(this.submissionId),
          questionId: this.question.id,
          formId: this.formId,
          id: id
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
      parentResponses (questionId) {
        return this.allResponses.filter((response) => {
          return response.question_id === questionId
        })
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
      }
    }
  }
</script>

<style scoped>
  .error {
    color: red;
  }
  .question-group .question-head {
    padding-bottom:5px;
  }
  .question-group >>> .input-group.input-group--text-field {
    padding-top:0px;
  }
  .question-group {
    margin-bottom:30px;
  }
  .question-group >>> .input-group__details {
    min-height:auto;
  }
</style>