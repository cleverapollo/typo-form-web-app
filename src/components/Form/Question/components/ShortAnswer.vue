<template>
  <div>
    <v-layout row>
      <v-flex xs6>
        <v-text-field
          name='short-answer'
          value='Short answer text'
          disabled
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout v-if='hasValidation' row>
      <v-flex xs4>
        <v-select
          label='Validation type'
          :items='validationTypes'
          v-model='activeValidationType'
        ></v-select>
      </v-flex>
      <v-flex v-if='"Text" === activeValidationType' xs3 offset-xs1>
        <v-text-field
          name='min-char-count'
          label='Minimum character count'
          v-model='minInput'
          mask='###'
          @change='() => {this.minCharCount = this.minInput}'
        ></v-text-field>
      </v-flex>
      <v-flex v-if='"Text" === activeValidationType' xs3 offset-xs1>
        <v-text-field
          name='max-char-count'
          label='Maximum character count'
          v-model='maxInput'
          mask='###'
          @change='() => {this.maxCharCount = this.maxInput}'
        ></v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import * as _ from 'lodash'

  export default {
    name: 'short-answer',
    props: {
      'answers': {
        default: function () {
          return []
        }
      },
      'hasValidation': {
        type: Boolean,
        default: true
      },
      'questionId': {
        type: Number,
        default: -1
      }
    },
    data () {
      return {
        validationTypes: [
          'Number', 'Text', 'Email'
        ],
        minInput: 0,
        maxInput: 0,
        eventsAdapter: {
          'validation-create': this.checkCreateValidation.bind(this),
          'validation-remove': this.checkRemoveValidation.bind(this)
        }
      }
    },
    methods: {
      createValidation () {
        this.$emit('create-validation', this.activeValidationType, this.minCharCount, this.maxCharCount)
      },
      updateValidation (type, min, max) {
        this.$emit('update-validation', type, min, max)
      },
      removeValidation () {
        this.$emit('remove-validation')
      },
      checkCreateValidation (questionId) {
        if (questionId === this.questionId) {
          this.createValidation()
        }
      },
      checkRemoveValidation (questionId) {
        if (questionId === this.questionId) {
          this.removeValidation()
        }
      }
    },
    computed: {
      activeValidationType: {
        get: function () {
          console.log('computed - activeValidationType')
          const validations = this.$store.getters.loadedQuestionValidation(this.form_id, this.question.id)
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
          return validationType || this.validationTypes[0]
        },
        set: function (value) {
          this.updateValidation(value, this.minCharCount, this.maxCharCount)
        }
      },
      validationType () {
        console.log('computed - validationType call')
        const validations = this.$store.getters.loadedQuestionValidation(this.form_id, this.question.id)
        const validationTypes = this.$store.getters.validationTypes
        if (validations && validations.length && validations.length === 1 && validationTypes && validationTypes.length > 0) {
          const index = _.findIndex(validationTypes, type => { return validations[0].validation_type_id === type.id })
          if (index > -1) {
            return validationTypes[index].type
          } else {
            return ''
          }
        }
      },
      minCharCount: {
        get: function () {
          console.log('computed - minCharCount')
          const validations = this.$store.getters.loadedQuestionValidation(this.form_id, this.question.id)
          this.validations = validations
          if (validations && validations.length && validations.length === 1) {
            const validationData = validations[0].validation_data
            this.minInput = validationData.split(',')[0] || 0
          }
          console.log('computed - minCharCount', this.minInput)
          return this.minInput
        },
        set: function (value) {
          console.log('this.minInput:set', value)
          this.updateValidation(this.activeValidationType, value, this.maxCharCount)
        }
      },
      maxCharCount: {
        get: function () {
          console.log('computed - maxCharCount')
          const validations = this.$store.getters.loadedQuestionValidation(this.form_id, this.question.id)
          this.validations = validations
          if (validations && validations.length && validations.length === 1) {
            const validationData = validations[0].validation_data
            this.maxInput = validationData.split(',')[1] || 0
          }
          console.log('computed - minCharCount', this.maxInput)
          return this.maxInput
        },
        set: function (value) {
          this.updateValidation(this.activeValidationType, this.minCharCount, value)
        }
      }
    },
    mounted () {
      if (this.answers.length) {
        this.$emit('delete-answers')
      }
      window.Vue.$on('validation-create', this.eventsAdapter['validation-create'])
      window.Vue.$on('validation-remove', this.eventsAdapter['validation-remove'])
    },
    beforeDestroy () {
      window.Vue.$off('validation-create', this.eventsAdapter['validation-create'])
      window.Vue.$off('validation-remove', this.eventsAdapter['validation-remove'])
    }
  }
</script>
