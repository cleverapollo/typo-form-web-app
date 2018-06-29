import * as _ from 'lodash'

export default {
  props: {
    'formId': {
      type: Number,
      required: true
    },
    'questionId': {
      type: Number,
      default: -1
    }
  },
  methods: {
    validate (value) {
      if (this.activeValidationType) {
        if (this.activeValidationType === 'Number') {
          if (!this._isNumeric(value)) {
            return 'Only numerical values are allowed here.'
          } else if (parseInt(value) < this.minValue) {
            return `At least ${this.minValue} value is required here.`
          } else if (parseInt(value) > this.maxValue && this.maxValue !== 0) {
            return `${this.maxValue} value is allowed here at most.`
          }
          return true
        } else if (this.activeValidationType === 'Letters') {
          if (value.length < this.minValue) {
            return `At least ${this.minValue} letters are required here.`
          } else if (value.length > this.maxValue && this.maxValue !== 0) {
            return `${this.maxValue} letters are allowed here at most.`
          }
          return true
        } else if (this.activeValidationType === 'Words') {
          console.log(value, value.split(' ').length, this.minValue, this.maxValue)
          if (value.split(' ').length < this.minValue) {
            return `At least ${this.minValue} words are required here.`
          } else if (value.split(' ').length > this.maxValue && this.maxValue !== 0) {
            return `${this.maxValue} letters words allowed here at most.`
          }
          return true
        } else if (this.activeValidationType === 'Email') {
          if (this._validateEmail(value)) {
            return true
          }
          return 'Please input valid email address'
        } else if (this.activeValidationType === 'Checkbox') {
          if (this.responses.length < this.minValue) {
            return `Please check at least ${this.minValue} answers.`
          } else if (this.responses.length > this.maxValue && this.maxValue !== 0) {
            return `${this.maxValue} answers are allowed here at most.`
          }
          return true
        } else {
          console.log('unsupported validation type', this.activeValidationType)
          return false
        }
      }
      return true
    },
    _isNumeric (n) {
      return /^\d+$/.test(n)
    },
    _validateEmail (email) {
      return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
    }
  },
  computed: {
    activeValidationType: {
      get: function () {
        const validations = this.$store.getters.loadedQuestionValidation(this.formId, this.questionId)
        const validationTypes = this.$store.getters.validationTypes
        let validationType = null
        if (validations && validations.length && validations.length === 1 && validationTypes && validationTypes.length > 0) {
          const index = _.findIndex(validationTypes, type => { return validations[0].validation_type_id === type.id })
          if (index > -1) {
            validationType = validationTypes[index].type
          } else {
            validationType = ''
          }
        }
        return validationType
      },
      set: function (value) {
        this.updateActiveValidationType(value)
      }
    },
    minValue () {
      const validations = this.$store.getters.loadedQuestionValidation(this.formId, this.questionId)
      let minVal
      if (validations && validations.length && validations.length === 1) {
        const validationData = validations[0].validation_data
        minVal = parseInt(validationData.split(',')[0]) || 0
      } else {
        minVal = 0
      }
      return minVal
    },
    maxValue () {
      const validations = this.$store.getters.loadedQuestionValidation(this.formId, this.questionId)
      let maxVal
      if (validations && validations.length && validations.length === 1) {
        const validationData = validations[0].validation_data
        maxVal = parseInt(validationData.split(',')[1]) || 0
      } else {
        maxVal = 0
      }
      return maxVal
    }
  }
}
