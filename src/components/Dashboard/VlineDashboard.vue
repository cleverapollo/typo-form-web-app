<template>
  <v-container fluid grid-list-lg class="dashboard-container">

    <!-- // Welcome -->
    <Welcome></Welcome>

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
    <v-layout justify-space-between row wrap>
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
        <v-btn
          color="primary"
          outline
          block
          large
          @click.native="uploadFormDataDialog = true"
        >
          Upload Data
          <v-icon right dark>cloud_upload</v-icon>
        </v-btn>
      </v-flex>

    </v-layout>

    <!-- // Upload Dialog -->
    <v-layout>
      <v-dialog v-model="uploadFormDataDialog" persistent max-width="600">
        <v-card>
          <!-- //Title -->
          <v-card-title>
            <div class="title mb-2 mt-2">Upload Form Data</div>
          </v-card-title>

          <v-card-text>
           <v-layout row>
              <v-flex xs12>
                <input 
                  id="upload" 
                  type="file"
                  ref="fileupload"
                  accept=".xlsx"
                  @change="changeFile"
                  :disabled="loading"
                  />
              </v-flex>
            </v-layout>

            <v-layout row v-if="uploadingFormData">
              <v-flex text-xs-center xs12>
                <v-progress-linear
                  indeterminate
                >
                </v-progress-linear>
              </v-flex>
            </v-layout>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions>
            <v-layout row py-2>
              <v-flex xs12 class="text-xs-right">
                <v-btn flat color="secondary" :disabled="!cancelFormUploadEnabled" @click="cancelFormUpload()" >Cancel</v-btn>
                <v-btn color="primary" :disabled="!uploadFormDataEnabled" @click="uploadFile" >Upload</v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    
  </v-container>
</template>

<script>
  import * as _ from 'lodash'
  import Welcome from './Components/Welcome'
  import countTo from 'vue-count-to'
  import moment from 'moment'
  export default {
    data () {
      return {
        countToStart: 0,
        countToDuration: 3000,
        loadingExport: false,
        uploadFormDataDialog: false,
        uploadingFormData: false,
        timer: '',
        loading: false,
        file: null,
        items: [
          { form: 'Site', label: 'Sites', icon: 'place', color: 'blue', search: '' },
          { form: 'Service', label: 'Services', icon: 'ev_station', color: 'orange', search: '' },
          { form: 'Vehicle', label: 'Vehicles', icon: 'directions_car', color: 'green', search: '' },
          { form: 'Useage', label: 'Useage', icon: 'trending_up', color: 'red', search: '' }
        ]
      }
    },
    components: {
      Welcome,
      countTo
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
      },
      uploadFormDataEnabled () {
        return this.file && !this.uploadingFormData
      },
      cancelFormUploadEnabled () {
        return !this.uploadingFormData
      }
    },
    methods: {
      cancelFormUpload () {
        this.uploadFormDataDialog = false
        this.uploadingFormData = false
        this.file = null
        const input = this.$refs.fileupload
        input.type = 'text'
        input.type = 'file'
      },
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
      uploadFile () {
        this.uploadingFormData = true
        this.$store.dispatch('uploadApplicationFormData', {
          slug: this.slug,
          file: this.file
        })
        .catch(error => {
          console.log(error)
        })
        .then(() => {
          this.cancelFormUpload()
        })
      },
      changeFile (e) {
        const files = e.target.files || e.dataTransfer.files
        this.file = files.length ? files[0] : false
      },
      getApplicationDataExport () {
        this.loadingExport = true
        window.axios.get(process.env.API_URL + 'application/' + this.slug + '/export')
        .then(response => {
          if (response.data.file.url) {
            let a = document.createElement('a')
            a.download = response.data.file.name
            a.href = response.data.file.url
            a.click()
          }
        }).catch(error => {
          console.log(error)
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
      this.$store.dispatch('loadUsers', this.slug)
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