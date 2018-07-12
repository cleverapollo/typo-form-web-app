<template>
  <div>
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
      <v-flex v-if='"Checkbox" !== activeValidationType' xs3 offset-xs1>
        <v-text-field
          name='min-char-count'
          label='Minimum count'
          v-model='minInput'
          :value='minValue'
          type='number'
          @change='updateMinCount'
          :rules='[validateMinInput]'
        ></v-text-field>
      </v-flex>
      <v-flex v-if='"Checkbox" !== activeValidationType' xs3 offset-xs1>
        <v-text-field
          name='max-char-count'
          label='Maximum count'
          v-model='maxInput'
          :value='maxValue'
          type='number'
          @change='updateMaxCount'
          :rules='[validateMaxInput]'
        ></v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import validationMixin from '../QuestionValiationMixin'

  export default {
    name: 'short-answer',
    mixins: [
      validationMixin
    ],
    props: {
      'answers': {
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        validationTypes: [
          'Number', 'Words', 'Letters', 'Email'
        ]
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
