<template>
  <div>
    <v-layout row>
      <v-flex xs4>
        <v-text-field
          value='Month, day, year'
          append-icon="event"
          disabled
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout v-if='hasValidation' row wrap>
      <v-flex xs12 mt-2 mb-2>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs12 class="body-2">Validation</v-flex>
      <v-flex xs4>
        <v-select
          label='Validation type'
          :items='validationTypes'
          v-model='activeValidationType'
        ></v-select>
      </v-flex>
      <v-flex v-if='"Date between" === activeValidationType || "Date before" === activeValidationType' xs3 offset-xs1>
        <v-dialog
          ref="dialog"
          v-model="minModal"
          :return-value.sync="minDate"
          persistent
          lazy
          full-width
          width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="minDate"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="minDate" scrollable :readonly="disabled">
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="minModal = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.dialog.save(minDate)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
      <v-flex xs3 offset-xs1 v-if='"Future date" !== activeValidationType && "Date before" !== activeValidationType'>
        <v-dialog
          ref="dialog"
          v-model="maxModal"
          :return-value.sync="maxDate"
          persistent
          lazy
          full-width
          width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="maxDate"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="maxDate" scrollable :readonly="disabled">
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="maxModal = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.dialog.save(maxDate)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import * as _ from 'lodash'

  export default {
    name: 'date-component',
    props: ['answers', 'sectionId', 'formId', 'hasValidation', 'questionId', 'disabled'],
    data () {
      return {
        validationTypes: [
          'Date after', 'Date before', 'Date between', 'Future date'
        ],
        minDate: null,
        minModal: false,
        maxDate: null,
        maxModal: false,
        eventsAdapter: {
          'validation-create': this.checkCreateValidation.bind(this),
          'validation-remove': this.checkRemoveValidation.bind(this)
        }
      }
    },
    methods: {
      checkCreateValidation (questionId) {
        if (questionId === this.questionId) {
          this.createValidation()
        }
      },
      checkRemoveValidation (questionId) {
        if (questionId === this.questionId) {
          this.removeValidation()
        }
      },
      createValidation () {
        this.$emit('create-validation', this.activeValidationType, this.minDate, this.maxDate)
      },
      updateValidation (validationType, minInput, maxInput) {
        const vType = validationType || this.activeValidationType
        const min = minInput || 0
        const max = maxInput || 0
        this.$emit('update-validation', vType, min, max)
      },
      removeValidation () {
        this.$emit('remove-validation')
      },
      updateActiveValidationType (value) {
        this.updateValidation(value, this.minInput, this.maxInput)
      }
    },
    computed: {
      activeValidationType: {
        get: function () {
          const validations = this.$store.getters.loadedQuestionValidation(this.formId, this.questionId)
          const validationTypes = this.$store.getters.validationTypes
          let validationType = null
          if (validations && validations.length && validations.length === 1 && validationTypes && validationTypes.length > 0) {
            const index = _.findIndex(validationTypes, type => {
              return validations[0].validation_type_id === type.id
            })
            if (index > -1) {
              validationType = validationTypes[index].type
            } else {
              validationType = ''
            }
          }
          return validationType || this.validationTypes[0]
        },
        set: function (value) {
          this.updateActiveValidationType(value)
        }
      },
      validations () {
        return this.$store.getters.loadedQuestionValidation(this.formId, this.questionId)
      }
    },
    mounted () {
      if (this.answers.length) {
        this.$emit('delete-answers')
      }

      if (this.validations && this.validations.length && this.validations.length === 1) {
        const validationData = this.validations[0].validation_data.split(',')
        this.minDate = (validationData[0] !== '0') ? validationData[0] : null
        this.maxDate = (validationData[1] !== '0') ? validationData[1] : null
      }

      this.$root.$on('validation-create', this.eventsAdapter['validation-create'])
      this.$root.$on('validation-remove', this.eventsAdapter['validation-remove'])
    },
    beforeDestroy () {
      this.$root.$off('validation-create', this.eventsAdapter['validation-create'])
      this.$root.$off('validation-remove', this.eventsAdapter['validation-remove'])
    },
    watch: {
      minDate (value) {
        this.updateValidation('', value, this.maxInput)
      },
      maxDate (value) {
        this.updateValidation('', this.minInput, value)
      }
    }
  }
</script>
