import * as _ from 'lodash'
import TriggerMixin from './TriggerMixin.js'
export default {
  mixins: [TriggerMixin],
  computed: {
    sections () {
      return this.$store.getters.loadedSections(this.formTemplateId)
    }
  },
  methods: {
    getSection (sectionId) {
      return _.find(this.sections, {id: sectionId})
    },
    getSectionName (section) {
      let name = section.name
      do {
        section = this.getSection(section.parent_section_id)
        name = section ? section.name + ' > ' + name : name
      } while (section)

      return name
    },
    answer (item, order) {
      const questionType = this.getQuestionType(item.question_type_id)
      const responses = this.form.responses.filter((response) => {
        return response.question_id === item.id && response.order === order
      })
      let response = ''
      switch (questionType) {
        case 'Short answer':
        case 'Paragraph':
        case 'Date':
        case 'Time':
        case 'Linear scale':
        case 'Number':
        case 'Decimal':
        case 'Email':
        case 'Percent':
        case 'Phone number':
        case 'URL':
          if (responses.length) {
            response = responses[0].response
          }
          break
        case 'File upload':
          if (responses.length) {
            response = '<a href="' + responses[0].response + '" target="_blank">Download File</a>'
          }
          break
        case 'Multiple choice':
        case 'Checkboxes':
        case 'Dropdown':
        case 'Country':
          const result = responses.map((response) => {
            const answer = item.answers.find((answer) => {
              return answer.id === response.answer_id
            })
            return answer.answer
          })
          response = result.join(', ')
          break
        case 'Multiple choice grid':
        case 'Checkbox grid':
        case 'Address':
        case 'ABN Lookup':
          const result1 = responses.map((response) => {
            const answer = item.answers.find((answer) => {
              return answer.id === response.answer_id
            })
            const res = item.answers.find((answer) => {
              return answer.id === parseInt(response.response)
            })
            return '(' + answer.answer + ', ' + res.answer + ')'
          })
          response = result1.join(', ')
          break
        case 'Content Block':
          response = item.description
          break
      }
      return response
    }
  }
}
