<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-layout row v-for='(answer, index) in answers' :key='"Option " + index' :class='"item" + index'>
        <v-checkbox 
          color="info"
          :disabled="disabled"
          :label="answer.answer"
          v-model='checkAnswers'
          :value="answer.id"
          @change="onSave(answer.id)"
          hide-details
          v-if="answer.parameter"
         >
        </v-checkbox>
        <template v-else>
          <v-checkbox
            color="info"
            :disabled="disabled"
            v-model="enabled"
            hide-details
            class="shrink mr-1"
          >
          </v-checkbox>
          <v-text-field
            :disabled="!enabled"
            v-model="responseValue"
            @change="onUpdate(answer.id)"
          >
          </v-text-field>
        </template>
      </v-layout>
    </v-flex>
    <v-flex xs12 class='error' v-show='validate() !== true'>
      {{ validate() }}
    </v-flex>
  </v-layout>
</template>

<script>
  import validationMixin from '../ResponseValidationMixin'

  export default {
    name: 'checkboxes',
    mixins: [validationMixin],
    props: ['question', 'answers', 'responses', 'submissionId', 'disabled'],
    data () {
      return {
        checkAnswers: [],
        responseValue: 'Other...'
      }
    },
    mounted () {
      this.checkAnswers = this.responses.map((response) => {
        return response.answer_id
      })

      if (this.enabled && this.enabled.response) {
        this.responseValue = this.enabled.response
      }
    },
    watch: {
      submissionId (value) {
        this.checkAnswers = this.responses.map((response) => {
          return response.answer_id
        })
      }
    },
    computed: {
      other () {
        return this.answers.find((answer) => !answer.parameter)
      },
      enabled: {
        get () {
          return this.responses.find((response) => response.answer_id === this.other.id)
        },
        set (value) {
          this.onSave(this.other.id)
        }
      }
    },
    methods: {
      checkAble (answerId) {
        const index = this.responses.findIndex((response) => {
          return response.answer_id === answerId
        })
        return index !== -1
      },
      responseIdFromAnswer (answerId) {
        const response = this.responses.find((response) => {
          return response.answer_id === answerId
        })
        return response.id
      },
      onSave (answerId) {
        if (!this.checkAble(answerId)) {
          this.$emit('create-response', [answerId, null])
        } else {
          this.$emit('delete-response', this.responseIdFromAnswer(answerId))
          if (answerId === this.other.id) {
            this.responseValue = 'Other...'
          }
        }
      },
      onUpdate (answerId) {
        if (this.checkAble(answerId)) {
          const response = this.responses.find((response) => response.answer_id === answerId)
          this.$emit('update-response', [answerId, this.responseValue, response.id])
        }
      }
    }
  }
</script>
