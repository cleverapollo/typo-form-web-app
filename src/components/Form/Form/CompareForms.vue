<template>

  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class='headline primary--text py-3'>Compare Forms</h1>
          <v-spacer></v-spacer>
        </v-flex>

        <v-flex d-flex xs12>
          <p>Select a form template to compare data from multiple forms.</p>
        </v-flex>

        <!-- // Form Template -->
        <v-layout row wrap>
          <v-flex xs12>
            <v-autocomplete
              :items="formTemplateOptions"
              item-text="text"
              item-value="value"
              v-model="formTemplateId"
              label="Form Template"
              single-line
            >
            </v-autocomplete>
          </v-flex>
        </v-layout>

        <v-flex d-flex xs12>
          <v-card class="full-width">

            <!-- //Search -->
            <v-card-title>
              <v-layout row wrap>
                <v-flex xs12 md6>

                  <v-btn
                    outline
                  >
                    <download-excel
                      :data="data"
                      :name="getFileName() + '.csv'"
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

            <!-- //Forms -->
            <v-data-table
              :headers='headers'
              :items='data'
              :search='search'
              :rows-per-page-items="[25, 50, 100, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }]"
              :loading="loading"
            >
              <template slot='items' slot-scope='props'>
                <tr>
                  <template v-for='(item, key) in props.item'>
                    <td @click="openForm(props.item.id)" v-bind:key="'filter'+key">{{item}}</td>
                  </template>
                </tr>
              </template>
              <v-alert slot='no-results' :value='true' color='error' icon='warning'>
                Your search for '{{ search }}' found no results.
              </v-alert>
            </v-data-table>

          </v-card>
        </v-flex>

      </v-layout>
    </v-flex>

  </v-layout>

</template>

<script>
import * as _ from 'lodash'
import moment from 'moment'
export default {

  data () {
    return {
      search: '',
      loading: false,
      formTemplateId: null
    }
  },
  computed: {
    slug () {
      return window.location.hostname.split('.')[0]
    },
    sections () {
      return _.orderBy(this.$store.getters.loadedSections(this.formTemplateId), 'order')
    },
    headers () {
      return this.questions
    },
    data () {
      return this.responses
    },
    questions () {
      const data = [
        { text: 'Form', value: 'id' },
        { text: 'Organisation', value: 'organisation' },
        { text: 'Contact', value: 'contact' }
      ]
      const questions = this.getFormTemplateQuestions(this.formTemplateId)
      _.forEach(questions, question => {
        data.push({ text: question.question, value: question.id })
      })
      return data
    },
    answers () {
      const answers = []
      const questions = this.getFormTemplateQuestions(this.formTemplateId)
      _.forEach(questions.answers, answer => {
        answers.push(answer)
      })
      return answers
    },
    responses () {
      const data = []
      const forms = this.getFormTemplateForms(this.formTemplateId)
      const questions = this.getFormTemplateQuestions(this.formTemplateId)
      _.forEach(forms, form => {
        const user = form.user.first_name + ' ' + form.user.last_name
        const row = { 'ID': form.id, 'Organisation': form.organisation, 'User': user }
        _.forEach(questions, question => {
          const values = []
          const responses = _.filter(form.responses, response => { return response.question_id === question.id })
          _.forEach(responses, response => {
            const answer = _.find(this.answers, answer => { return response.answer_id === answer.id })
            const value = answer ? answer.answer : response.response
            values.push(value)
          })
          const cell = values.join()
          row[question.question] = cell
        })
        data.push(row)
      })
      return data
    },
    formTemplates () {
      return _.orderBy(this.$store.getters.loadedFormTemplates(this.slug), 'name')
    },
    forms () {
      return _.orderBy(this.$store.getters.loadedAllForms(this.slug), 'id')
    },
    formTemplateOptions () {
      const options = []
      _.forEach(this.formTemplates, formTemplate => {
        options.push({ text: formTemplate.name, value: formTemplate.id })
      })
      return options
    }
  },
  methods: {
    getFormTemplateQuestions (formTemplateId) {
      const questions = []
      _.forEach(this.sections, section => {
        _.forEach(section.questions, question => {
          questions.push(question)
        })
      })
      return questions
    },
    getFormTemplateForms (formTemplateId) {
      return _.filter(this.forms, form => { return form.form_template.id === formTemplateId })
    },
    openForm (id) {
      this.$router.push('/forms/' + id)
    },
    getFileName () {
      const formTemplate = _.find(this.formTemplates, formTemplate => { return formTemplate.id === this.formTemplateId })
      const fileName = (formTemplate ? formTemplate.name : '') + ' Compare ' + moment().format('YYYY-MM-DD [at] LTS')
      return fileName
    }
  },
  created: function () {
    this.$store.dispatch('loadAllForms', this.slug)
    this.$store.dispatch('loadFormTemplates', this.slug)
    this.$store.dispatch('loadAllSections', this.slug)
  }
}
</script>

<style scoped>
.full-width {
  width:100%;
}
</style>
