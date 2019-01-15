<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-autocomplete
        v-bind:items="formTemplates"
        v-model="editFormTemplateId"
        item-text="name"
        item-value="id"
        @change="updateFormTemplate($event)"
      ></v-autocomplete>
    </v-flex>
    <v-flex xs12>
      <v-autocomplete
        v-bind:items="questions"
        v-model="editQuestionId"
        item-text="question"
        item-value="id"
        @change="updateQuestion($event)"
      ></v-autocomplete>
    </v-flex>
  </v-layout>
</template>

<script>
  import validationMixin from '../QuestionValiationMixin'
  export default {
    name: 'Lookup',
    props: ['questionId', 'sectionId', 'formTemplateId', 'answers'],
    mixins: [
      validationMixin
    ],
    data () {
      return {
        validationTypes: [
          'Dropdown'
        ],
        editFormTemplateId: null,
        editQuestionId: null,
        slug: window.location.hostname.split('.')[0]
      }
    },
    computed: {
      statuses () {
        return this.$store.getters.statuses
      },
      formTemplates () {
        let formTemplates = this.$store.getters.loadedFormTemplates(this.slug).filter(formTemplate => formTemplate.id !== parseInt(this.formTemplateId))
        if (!this.userIsApplicationAdmin) {
          formTemplates = formTemplates.filter(formTemplate => {
            const status = this.statuses.find((status) => {
              return status.id === formTemplate.status_id
            })
            return status.status === 'Closed'
          })
        }
        return formTemplates
      },
      questions () {
        if (!this.editFormTemplateId) {
          return []
        }
        return this.$store.getters.loadedAllQuestions(this.editFormTemplateId)
      }
    },
    methods: {
      updateFormTemplate (value) {
        if (typeof (value) === 'object') {
          return
        }
        this.editQuestionId = null
        this.$store.dispatch('loadSections', this.editFormTemplateId)
        this.updateAnswer()
      },
      updateQuestion (value) {
        if (typeof (value) === 'object') {
          return
        }
        this.updateAnswer()
      },
      updateAnswer () {
        const answer = JSON.stringify({
          formTemplateId: this.editFormTemplateId,
          questionId: this.editQuestionId
        })
        const index = this.answers[0].id
        this.$emit('update-answer', [index, answer])
      }
    },
    mounted () {
      if (!this.answers.length) {
        const answer = JSON.stringify({
          formTemplateId: null,
          questionId: null
        })
        this.$emit('create-answer', [answer, true])
      } else {
        const value = JSON.parse(this.answers[0].answer)
        this.editFormTemplateId = value.formTemplateId
        this.editQuestionId = value.questionId
      }
      this.$store.dispatch('loadFormTemplates', this.slug)
      if (this.editFormTemplateId) {
        this.$store.dispatch('loadSections', this.editFormTemplateId)
      }
      this.$root.$on('validation-create', this.eventsAdapter['validation-create'])
      this.$root.$on('validation-remove', this.eventsAdapter['validation-remove'])
    },
    beforeDestroy () {
      this.$root.$off('validation-create', this.eventsAdapter['validation-create'])
      this.$root.$off('validation-remove', this.eventsAdapter['validation-remove'])
    }
  }
</script>
