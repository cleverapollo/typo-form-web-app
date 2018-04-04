<template>
  <draggable v-model='answers' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px'>
    <v-layout row v-for='(answer, index) in answers' :key='"Option " + index' :class='"item" + index'>
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
    <v-layout v-if='hasValidation'>
      <v-flex xs4>
        <v-text-field
          name='min-answer-count'
          label='Minimum answer count'
          v-model='minAnswerCount'
          mask='###'
        ></v-text-field>
      </v-flex>
      <v-flex xs3 offset-xs1>
        <v-text-field
          name='max-answer-count'
          label='Maximum answer count'
          v-model='maxAnswerCount'
          mask='###'
        ></v-text-field>
      </v-flex>
    </v-layout>
  </draggable>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    name: 'checkboxes',
    props: {
      'answers': {
        default: function () {
          return []
        }
      },
      'hasValidation': {
        type: Boolean,
        default: false
      }
    },
    components: {
      draggable
    },
    data () {
      return {
        minAnswerCount: 0,
        maxAnswerCount: 0
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
    },
    computed: {
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
    }
  }
</script>