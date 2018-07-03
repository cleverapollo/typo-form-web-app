import * as _ from 'lodash'
export default {
  computed: {
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
    progress (formId, submissionId) {
      const sections = this.$store.getters.loadedSections(formId)
      let questionCount = 0
      let responseCount = 0
      sections.forEach(function (section) {
        let sectionCount = 1
        if (section.repeatable) {
          sectionCount = section.repeatable
        }
        let questions = section.questions.filter(question => question.mandatory && !this.isTrigger(question))
        questionCount += questions.length * sectionCount
        questions.forEach(function (question) {
          let responses = this.$store.getters.loadedResponses(formId, submissionId).filter(response => response.question_id === question.id)
          let responseLength = 1
          if (section.repeatable) {
            responseLength = responses.length
          }
          responseCount += responses.length ? responseLength : 0
        }, this)
      }, this)

      return questionCount !== 0 ? responseCount * 100 / questionCount : 0
    },
    isSectionTrigger (item) {
      if (!item || !item.questions.length) {
        return false
      }
      let section = this.$store.getters.loadedSection(this.formId, item.parent_section_id)
      if (this.isSectionTrigger(section)) {
        return true
      }
      if (this.isTrigger(item)) {
        return true
      }
      let questions = item.questions
      const $this = this
      let hideSectionTrigger = true
      _.forEach(questions, function (question) {
        if (!$this.isTrigger(question)) {
          hideSectionTrigger = false
        }
      })
      return hideSectionTrigger
    },
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
      if (!question) {
        return false
      }
      let type = (question.questions ? 'Section' : 'Question')
      let questionTriggers = this.$store.getters.loadedQuestionTrigger(this.formId, question.id)
      questionTriggers = questionTriggers.filter((trigger) => {
        if (type === 'Section') {
          return trigger.type === 'Section'
        } else {
          return trigger.type !== 'Section'
        }
      })
      questionTriggers = _.sortBy(questionTriggers, element => {
        return element.order
      })
      if (!questionTriggers.length) {
        return false
      }

      let tempF = true
      let index = 0

      while (index < questionTriggers.length) {
        const questionTrigger = questionTriggers[index]
        const parentQuestion = this.$store.getters.loadedAllQuestion(this.formId, parseInt(questionTrigger.parent_question_id))
        if (this.isTrigger(parentQuestion)) {
          return true
        }
        tempF = tempF && this.compareCondition(questionTrigger)
        if (questionTrigger.operator === 1) {
          if (tempF) {
            return false
          }
          tempF = true
        }
        index++
      }
      return !tempF
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
          if (questionTrigger.id === 12) {
            console.log(answerF, questionValue, value)
          }
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
