<template>
  <v-container fluid grid-list-lg class="dashboard-container">

    <!-- // Welcome -->
    <WelcomeCard></WelcomeCard>

    <!-- // Stats -->
    <v-layout row wrap justify-space-between>
      <v-flex
        v-for="item in items"
        :key="item.name"
        sm12 md3>
        <v-card :color="item.color">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex>
                <v-icon size="65" >{{ item.icon }}</v-icon>
              </v-flex>
              <v-flex text-xs-right class="white--text">
                <div class="display-2" color="white">
                  <countTo :startVal="countToStart" :endVal="getFormCount(item.form)" :duration="countToDuration"></countTo>
                </div>
                <div class="body-1">{{ item.label }}</div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- // Form Tabs and Tables -->
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-tabs
            grow
            dark
            slider-color="white"
            color="primary"
            >

            <!-- // Tab Links -->
            <v-tab 
              v-for="item in items"
              :key="item.form"
              :href="getTabLink(item.label)"
            >
            {{ item.label }}
            </v-tab>

            <!-- // Tab Items -->
            <v-tab-item
              v-for="item in items"
              :key="item.form"
              :value="item.label.toLowerCase()"
            >

              <v-card-title>
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <v-btn
                      outline
                    >
                      <download-excel
                        :data="getFormTableData(item.form)"
                        :name="getFormExportFileName(item.form)"
                        :fields="getFormTableFields(item.form)"
                        type="csv"
                      >
                        Export
                      </download-excel>
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field
                      v-model="item.search"
                      append-icon="search"
                      label="Search"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-title>

              <v-data-table
                :headers="getFormTableHeader(item.form)"
                :items="getFormTableData(item.form)"
                :search="item.search"
                :rows-per-page-items="[25, 50, 100, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }]"
              >
                <template slot="items" slot-scope="props">
                  <tr>
                    <template v-for="(val, key) in props.item">
                      <td @click='loadForm(props.item.id)' v-bind:key="'filter'+key">{{val}}</td>
                    </template>
                  </tr>
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                  Your search for "{{ item.search }}" found no results.
                </v-alert>
              </v-data-table>

            </v-tab-item>

          </v-tabs>
        </v-card>

      </v-flex>
    </v-layout>

    <!-- // Action Buttons -->
    <v-layout justify-space-between row wrap v-if="this.$_isApplicationAdminUser()">
      <!-- // Export Application Data -->
      <v-flex xs12 md6>
        <v-btn
          color="primary"
          outline
          block
          large
          @click.native="getApplicationDataExport()"
          :disabled="loadingExport"
          :loading="loadingExport">
          Export Application Data
          <v-icon right dark>save_alt</v-icon>
        </v-btn>
      </v-flex>

      <!-- // Import Form Data -->
      <v-flex xs12 md6>
        <FormUploadButton :slug="slug" />
      </v-flex>

    </v-layout>
    
  </v-container>
</template>

<script>
  import * as _ from 'lodash'
  import WelcomeCard from './Components/WelcomeCard'
  import FormUploadButton from './Components/FormUploadButton'
  import countTo from 'vue-count-to'
  import moment from 'moment'
  import ApplicationMixin from '../../mixins/ApplicationMixin.js'

  export default {
    mixins: [ApplicationMixin],
    components: {
      WelcomeCard,
      FormUploadButton,
      countTo
    },
    data () {
      return {
        countToStart: 0,
        countToDuration: 3000,
        loadingExport: false,
        timer: '',
        items: [
          { form: 'Site', label: 'Sites', icon: 'place', color: 'blue', search: '' },
          { form: 'Service', label: 'Services', icon: 'ev_station', color: 'orange', search: '' },
          { form: 'Vehicle', label: 'Vehicles', icon: 'directions_car', color: 'green', search: '' },
          { form: 'Useage', label: 'Useage', icon: 'trending_up', color: 'red', search: '' }
        ]
      }
    },
    computed: {
      slug () {
        return window.location.hostname.split('.')[0]
      },
      formTemplates () {
        return this.$store.getters.loadedFormTemplates(this.slug)
      },
      forms () {
        return this.$store.getters.loadedAllForms(this.slug)
      }
    },
    methods: {
      getFormTableFields (name) {
        const fields = { 'Form': 'id' }
        const formTemplate = _.find(this.formTemplates, formTemplate => { return formTemplate.name === name })
        const sections = formTemplate ? _.orderBy(this.$store.getters.loadedSections(formTemplate.id), 'order') : null
        _.forEach(sections, section => {
          const questions = _.orderBy(section.questions, 'order')
          _.forEach(questions, question => {
            fields[question.question] = 'key-' + question.id
          })
        })
        return fields
      },
      getFormTableHeader (name) {
        const headers = [{ text: 'Form', value: 'id' }]
        const formTemplate = _.find(this.formTemplates, formTemplate => { return formTemplate.name === name })
        const sections = formTemplate ? _.orderBy(this.$store.getters.loadedSections(formTemplate.id), 'order') : null
        _.forEach(sections, section => {
          const questions = _.orderBy(section.questions, 'order')
          _.forEach(questions, question => {
            headers.push({ text: question.question, value: 'key-' + question.id })
          })
        })
        return headers
      },
      getFormTableData (name) {
        const data = []
        const formTemplate = _.find(this.formTemplates, formTemplate => { return formTemplate.name === name })
        const sections = formTemplate ? _.orderBy(this.$store.getters.loadedSections(formTemplate.id), 'order') : null
        const forms = formTemplate ? _.filter(this.forms, form => { return form.form_template.name === name }) : null
        _.forEach(forms, form => {
          const row = { 'id': form.id }
          _.forEach(sections, section => {
            const questions = _.orderBy(section.questions, 'order')
            _.forEach(questions, question => {
              const responses = _.filter(form.responses, response => { return response.question_id === question.id })
              const values = []
              _.forEach(responses, response => {
                const answer = _.find(question.answers, answer => { return response.answer_id === answer.id })
                let value = answer ? answer.answer : response.response
                values.push(value)
              })
              row['key-' + question.id] = values.join()
            })
          })
          data.push(row)
        })
        return data
      },
      getTabLink (name) {
        return '#' + name.toLowerCase()
      },
      getFormCount (name) {
        const forms = _.filter(this.forms, form => { return form.form_template.name === name })
        return forms ? forms.length : 0
      },
      getFormExportFileName (name) {
        return name.toLowerCase() + '-' + moment().format('YYYY-MM-DD [at] LTS') + '.csv'
      },
      getApplicationDataExport () {
        this.loadingExport = true
        window.axios.get(process.env.API_URL + 'application/' + this.slug + '/export')
        .then(response => {
          if (response.data.file.url) {
            let a = document.createElement('a')
            a.download = response.data.file.name
            a.href = process.env.API_ORIGIN_URL + response.data.file.url
            a.click()
          }
        }).then(() => {
          this.loadingExport = false
        })
      },
      getDashboardData () {
        this.$store.dispatch('loadAllForms', this.slug)
      },
      loadForm (id) {
        this.$router.push('/forms/' + id)
      }
    },
    created () {
      this.getDashboardData()
      this.timer = setInterval(this.getDashboardData, 30000)
      this.$store.dispatch('loadFormTemplates', this.slug)
      this.$store.dispatch('loadAllSections', this.slug)
    },
    beforeDestroy () {
      window.clearInterval(this.timer)
    }
  }
</script>

<style scoped>
  .dashboard-container {
    padding: 0px;
  }
  .stat-component:not(:last-child) {
    border-right: thin #8080803d solid;
  }
</style>