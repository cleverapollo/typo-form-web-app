<template>
  <draggable v-model='list' class='dragArea' :options='{draggable:".answer"}' style='min-height: 100px' @end='checkEnd'>
    <v-layout row v-for='(answer, index) in list' :key='"Option " + index' class='answer' :class='"answer" + answer.id'>
      <v-flex xs10 style='min-width: 120px'>
        <v-text-field
          :disabled='!answer.parameter'
          prepend-icon='check_box_outline_blank'
          :value='answer.answer'
          autofocus
          @change='updateAnswer(answer.id, $event)'
        ></v-text-field>
      </v-flex>
      <v-flex style='width: 30px' v-show='computedLength > 1'>
        <v-btn flat icon @click='deleteAnswer(index)' class='mt-3'>
          <v-icon>close</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row d-inline-flex>
      <v-flex style='width: 125px'>
        <v-text-field
          prepend-icon='check_box_outline_blank'
          value='Add option'
          @click='createAnswer'
        ></v-text-field>
      </v-flex>
      <v-flex v-show='!computedHasOther' class='ml-3 mt-4'>
        <div>or</div>
      </v-flex>
      <v-flex v-show='!computedHasOther' class='mt-2'>
        <v-btn flat color="primary" @click='setHasOther' class='mx-0'>add "other"</v-btn>
      </v-flex>
    </v-layout>
    <v-layout v-if='hasValidation' row>
      <v-flex xs4>
        <v-text-field
          name='min-answer-count'
          label='Minimum answer count'
          v-model='minInput'
          :value='minValue'
          mask='###'
          @change='updateMinCount'
          :rules='[validateMinInput]'
        ></v-text-field>
      </v-flex>
      <v-flex xs4 offset-xs1>
        <v-text-field
          name='max-answer-count'
          label='Maximum answer count'
          v-model='maxInput'
          :value='maxValue'
          mask='###'
          @change='updateMaxCount'
          :rules='[validateMaxInput]'
        ></v-text-field>
      </v-flex>
    </v-layout>
  </draggable>
</template>

<script>
  import draggable from 'vuedraggable'
  import validationMixin from '../QuestionValiationMixin'

  export default {
    name: 'checkboxes',
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
    components: {
      draggable
    },
    data () {
      return {
        validationTypes: [
          'Checkbox'
        ]
      }
    },
    methods: {
      createAnswer () {
        let str = `Option ${this.answers.length + 1}`
        if (this.computedHasOther) {
          str = `Option ${this.answers.length}`
        }
        this.$emit('create-answer', [str, true])
      },
      deleteAnswer (index) {
        this.$emit('delete-answer', this.answers[index].id)
      },
      setHasOther () {
        this.$emit('create-answer', ['Other...', false])
      },
      updateAnswer (index, value) {
        this.$emit('update-answer', [index, value])
      },
      checkEnd: function (evt) {
        if (evt.newIndex === evt.oldIndex) {
          return
        }
        let newIndex = evt.newIndex

        if (evt.newIndex > evt.oldIndex) {
          newIndex = newIndex + 1
        }

        let order = 1
        if (this.answers.length === newIndex) {
          order = this.answers[newIndex - 1].order + 1
        } else {
          order = this.answers[newIndex].order
        }

        const elementId = parseInt(evt.item.className.substr(24))
        this.$emit('move-answer', [elementId, order])
      },
      validateMinInput (value) {
        if (parseInt(value) > parseInt(this.maxInput)) {
          return 'Minimum count is set bigger than maximum count.'
        } else if (parseInt(value) > this.answers.length) {
          return 'Minimum count is set bigger than maximum answers count.'
        } else {
          this.minInput = value
          return true
        }
      },
      validateMaxInput (value) {
        if (parseInt(value) < parseInt(this.minInput)) {
          return 'Maximum count is set smaller than minimum count.'
        } else if (parseInt(value) > this.answers.length) {
          return 'Maximum count is set bigger than maximum answers count.'
        } else {
          this.maxInput = value
          return true
        }
      },
      updateMinCount (value) {
        if (parseInt(value) < parseInt(this.maxInput) && parseInt(value) <= this.answers.length) {
          this.updateValidation('', value, this.maxInput)
        }
      },
      updateMaxCount (value) {
        if (parseInt(value) > parseInt(this.minInput) && parseInt(value) <= this.answers.length) {
          this.updateValidation('', this.minInput, value)
        }
      }
    },
    mounted () {
      if (this.answers.length === 0) {
        this.$emit('create-answer', ['Option 1', true])
      } else if (this.answers.length === 2 && this.answers[0].answer.substr(0, 11) === 'LinearScale' && this.answers[1].answer.substr(0, 11) === 'LinearScale') {
        this.$emit('delete-answers')
      } else {
        const lastAnswer = this.answers[this.answers.length - 1]
        if (!lastAnswer.parameter && lastAnswer.answer !== 'Other...') {
          this.$emit('change-answer')
        }
      }
      window.Vue.$on('validation-create', this.eventsAdapter['validation-create'])
      window.Vue.$on('validation-remove', this.eventsAdapter['validation-remove'])
    },
    computed: {
      list: {
        get () {
          return this.answers
        },
        set (value) {
          // TODO: Drggable components
        }
      },
      computedHasOther () {
        if (!this.answers.length) {
          return false
        }
        return !this.answers[this.answers.length - 1].parameter
      },
      computedLength () {
        if (this.answers.length && !this.answers[this.answers.length - 1].parameter) {
          return this.answers.length - 1
        }
        return this.answers.length
      }
    },
    beforeDestroy () {
      window.Vue.$off('validation-create', this.eventsAdapter['validation-create'])
      window.Vue.$off('validation-remove', this.eventsAdapter['validation-remove'])
    }
  }
</script>
