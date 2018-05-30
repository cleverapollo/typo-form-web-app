<template>
  <v-container>
    <v-layout row wrap>
      <v-flex :class='"xs" + (question.width ? question.width : 12)'>
        <h2>
          {{ editedName }}
        </h2>

        <p v-if='editedDescription'>
          {{ editedDescription }}
        </p>

        <component
          :is="questionComponent"
          :answers="answers"
          :responses="responses"
          :question-id="question.id"
          form-id="formId"
          :submission-id="submissionId"
          @create-response="createResponse"
          @update-response="updateResponse"
          @delete-response="deleteResponse"
        ></component>
      </v-flex>
    </v-layout>
  </v-container>
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
          submissionId: this.submissionId,
          questionId: this.question.id,
          formId: this.formId,
          answerId: answerId,
          response: response
        })
      },
      updateResponse (args) {
        const answerId = args[0]
        const response = args[1]
        const id = args[2]
        this.$store.dispatch('updateResponse', {
          submissionId: this.submissionId,
          questionId: this.question.id,
          formId: this.formId,
          answerId: answerId,
          response: response,
          id: id
        })
      },
      deleteResponse (id) {
        this.$store.dispatch('deleteResponse', {
          submissionId: this.submissionId,
          questionId: this.question.id,
          formId: this.formId,
          id: id
        })
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
      compareCondition (questionTrigger) {
        let question = this.$store.getters.loadedQuestion(this.formId, parseInt(this.sectionId), parseInt(questionTrigger.parent_question_id))
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
          if (questionTypeID === 4) {
            let filteredResponses = parentResponses.filter(function (parentResponse) {
              return parentResponse.answer_id === answer
            })
            if (filteredResponses.length > 0) {
              questionAnswer = answer.toString()
            }
          } else if (questionTypeID === 9) {
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
        switch (comparatorID) {
          case 1:
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
          case 2:
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
          case 3:
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
          case 4:
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
          case 5:
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
          case 6:
            if (questionTypeID === 4) {
              return questionAnswer === answer
            } else if (questionTypeID === 9) {
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
          case 7:
            if (!answerF) {
              return _.startsWith(questionValue, value)
            } else {
              return _.startsWith(questionAnswer, answer)
            }
          case 8:
            if (!answerF) {
              return _.endsWith(questionValue, value)
            } else {
              return _.endsWith(questionAnswer, answer)
            }
          case 9:
            if (parentResponses.length > 0) {
              return false
            } else {
              return true
            }
          case 10:
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
</style>
