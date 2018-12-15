<template>
    <div v-html="$sanitize(answer(question, order))"></div>
</template>


<script>
  import SectionReportMixin from '../SectionReportMixin.js'

  export default {
    name: 'SectionReportComponent',
    props: ['formTemplateId', 'formId', 'question', 'order'],
    mixins: [SectionReportMixin],
    computed: {
      form () {
        if (!this.formId) {
          return null
        }
        return this.$store.getters.loadedForm(parseInt(this.formTemplateId), parseInt(this.formId))
      }
    },
    mounted () {
      if (this.getQuestionType(this.question.question_type_id) !== 'Lookup') {
        return
      }
      if (!this.question.answers.length) {
        return
      }
      const value = JSON.parse(this.question.answers[0].answer)
      const editFormTemplateId = value.formTemplateId
      if (editFormTemplateId) {
        this.$store.dispatch('loadSections', editFormTemplateId)
        this.$store.dispatch('loadedForms', editFormTemplateId)
      }
    }
  }
</script>