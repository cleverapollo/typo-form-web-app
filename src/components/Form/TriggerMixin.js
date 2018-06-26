import * as _ from 'lodash'
export default {
  computed: {
    progress () {
      const sections = this.$store.getters.loadedSections(this.formId)
      let questionCount = 0
      let responseCount = 0
      sections.forEach(function (section) {
        let questions = this.$store.getters.loadedQuestions(this.formId, section.id).filter(question => question.mandatory && this.isTrigger(question))
        questionCount += questions.length
        questions.forEach(function (question) {
          if (this.isTrigger(question)) {
            let responses = this.$store.getters.loadedResponses(this.formId, parseInt(this.submissionId)).filter(response => response.question_id === question.id)
            responseCount += responses.length ? 1 : 0
          }
        }, this)
      }, this)

      return questionCount !== 0 ? responseCount * 100 / questionCount : 0
    },
    allResponses () {
      return this.$store.getters.loadedResponses(this.formId, parseInt(this.submissionId))
    },
    questionTypes () {
      return this.$store.getters.questionTypes
    },
    triggerTypes () {
      return this.$store.getters.triggerTypes
    },
    comparators () {
      return this.$store.getters.comparators
    }
  },
  methods: {
    getComparator (comparatorId) {
      const comparator = this.comparators.find((comparator) => {
        return comparator.id === comparatorId
      })
      return comparator ? comparator.comparator : 'undefined'
    },
    getQuestionType (questionTypeId) {
      const questionType = this.questionTypes.find((questionType) => {
        return questionType.id === questionTypeId
      })
      return questionType ? questionType.type : 'undefined'
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
      if (!triggerType) {
        return true
      }

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
    },
    triggerType (questionTypeId, comparatorId) {
      return this.triggerTypes.filter((triggerType) => {
        return triggerType.question_type_id === questionTypeId && triggerType.comparator_id === comparatorId
      })[0]
    }
  }
}
