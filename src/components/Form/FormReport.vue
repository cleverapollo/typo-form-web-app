<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-card>

        <v-card-title>
          <v-layout row wrap>
            <v-flex xs12 md6>
              <v-btn
                outline
              >
                <download-excel
                  :data="responses"
                  :name="fileName + '.csv'"
                  type="csv"
                >
                  Export
                </download-excel>
              
              </v-btn>
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-title>

        <v-data-table
          :headers="headers"
          :items="responses"
          :search="search"
          :rows-per-page-items="[{ text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }]"
        >
          <template v-slot:items="props">
            <tr>
              <td>{{ props.item.id }}</td>
              <td>{{ props.item.section }}</td>
              <td>{{ props.item.question }}</td>
              <td v-html="props.item.answer"></td>
            </tr>
          </template>
          <v-alert slot="no-results" :value="true" color="error" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
  
</template>

<script>
  import * as _ from 'lodash'
  import moment from 'moment'
  export default {
    name: 'form-report',
    props: ['formTemplateId', 'formId'],
    data () {
      return {
        opened: true,
        search: '',
        headers: [
          { text: 'ID', value: 'id' },
          { text: 'Section', value: 'section' },
          { text: 'Question', value: 'question' },
          { text: 'Answer', value: 'answer' }
        ]
      }
    },
    computed: {
      form () {
        return this.formId && this.formTemplateId ? this.$store.getters.loadedForm(parseInt(this.formTemplateId), parseInt(this.formId)) : null
      },
      sections () {
        return this.formId ? this.$store.getters.loadedSections(this.formTemplateId) : null
      },
      questionTypes () {
        return this.$store.getters.questionTypes
      },
      responses () {
        const responseList = []
        _.forEach(this.sections, section => {
          _.forEach(section.questions, question => {
            _.forEach(this.form.responses, response => {
              if (response.question_id === question.id) {
                responseList.push({
                  id: section.order + '.' + question.order,
                  section: this.getSectionName(section),
                  question: question.question,
                  answer: this.getResponse(question, response)
                })
              }
            })
          })
        })
        return responseList
      },
      fileName () {
        return 'Form Report ' + moment().format('YYYY-MM-DD [at] LTS')
      }
    },
    methods: {
      findAnswer (answers, id) {
        return answers.find(answer => answer.id === id)
      },
      findSection (id) {
        return this.sections.find(section => section.id === id)
      },
      getQuestionType (id) {
        return this.questionTypes.find(questionType => questionType.id === id)
      },
      getResponse (question, response) {
        const answer = this.findAnswer(question.answers, response.answer_id)
        const questionType = this.getQuestionType(question.question_type_id)
        let value = ''
        switch (questionType.type) {
          case 'File upload':
            let file = response && response.response ? this.getFile(response.response) : {}
            value = file && file.url ? '<a href="' + file.url + '" target="_blank" download>' + (file.name ? file.name : file.url) + (file.size ? ' (' + this.getFileSize(file.size) + ')' : '') + '</a>' : ''
            break
          default:
            value += answer && answer.answer ? answer.answer : ''
            value += response && response.response ? (value.length ? ': <br /><br />' + response.response : response.response) : ''
            break
        }
        return value
      },
      getFileSize (bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return 'n/a'
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
        if (i === 0) return `${bytes} ${sizes[i]})`
        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
      },
      getSectionName (section) {
        let name = ''
        let parentSection = this.findSection(section.parent_section_id)
        name = parentSection && parentSection.name ? (parentSection.name + ' > ' + section.name) : section.name
        return name
      },
      getFile (response) {
        let file = {}
        try {
          file = JSON.parse(response)[0]
        } catch (error) {
          if (response.length) {
            let filename = response.split('/')
            file.url = response
            file.path = file.url
            file.stored_name = filename[filename.length - 1]
            file.name = file.stored_name
          }
        }
        return file
      }
    }
  }
</script>
