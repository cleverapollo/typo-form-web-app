<template>
  <v-container fluid grid-list-lg class="dashboard-container">

    <!-- // Welcome -->
    <Welcome></Welcome>

    <!-- // Stats -->
    <v-layout row wrap justify-space-between>
      <v-flex
        v-for="stat in stats"
        :key="stat.name"
        sm12 md4>
        <v-card :color="stat.color">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex>
                <v-icon size="65" >{{ stat.icon }}</v-icon>
              </v-flex>
              <v-flex text-xs-right class="white--text">
                <div class="display-2" color="white">
                  <countTo :startVal="countToStart" :endVal="stat.count" :duration="countToDuration"></countTo>
                </div>
                <div class="body-1">{{ stat.name }}</div>
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

            <v-tab href="#sites">Sites</v-tab>
            <v-tab href="#services">Services</v-tab>
            <v-tab href="#useages">Useages</v-tab>

            <!-- // Sites -->
            <v-tab-item
              value="sites"
            >
              <v-card-title>
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <!--
                    <v-btn
                      outline
                    >
                      <download-excel
                        :data="sites"
                        :name="'vline-sites.csv'"
                        type="csv"
                        :fields="sitesHeaders"
                      >
                        Export
                      </download-excel>
                    </v-btn>
                    -->
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field
                      v-model="sitesSearch"
                      append-icon="search"
                      label="Search"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-title>

              <v-data-table
                :headers="sitesHeaders"
                :items="sites"
                :search="sitesSearch"
                :rows-per-page-items="[25, 50, 100, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }]"
              >
                <template slot="items" slot-scope="props">
                  <tr>
                    <template v-for="(item, key) in props.item">
                      <td v-bind:key="'filter'+key">{{item}}</td>
                    </template>
                  </tr>
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                  Your search for "{{ sitesSearch }}" found no results.
                </v-alert>
              </v-data-table>

            </v-tab-item>

            <!-- // Services -->
            <v-tab-item
              value="services"
            >

            </v-tab-item>

            <!-- // Useages -->
            <v-tab-item
              value="useages"
            >

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
                  accept=".csv"
                  @change="changeFile"
                  :disabled="loading"
                  />
              </v-flex>
            </v-layout>

            <v-layout row v-if="file && !uploadingFormData">
              <v-flex text-xs-center xs12 py-2>
                <v-btn 
                  class="primary"
                  @click="uploadFiles" 
                  :disabled="loading">
                    Start Upload
                </v-btn>
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
                <v-btn color="primary" @click="uploadFormDataDialog = false" >Close</v-btn>
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
  export default {
    data () {
      return {
        countToStart: 0,
        countToDuration: 3000,
        loadingExport: false,
        uploadFormDataDialog: false,
        uploadingFormData: false,
        timer: '',
        sitesSearch: '',
        formTemplates: [
          {
            id: 32,
            name: 'Site',
            where: {
              questions: [
                {
                  key: 'key',
                  value: 'site_name',
                  column: 'site_name',
                  join: 'AND'
                }
              ]
            }
          },
          {
            id: 50,
            name: 'Service',
            where: {
              questions: [
                {
                  key: 'key',
                  value: 'service_accountnumber',
                  column: 'service_accountnumber',
                  join: 'OR'
                },
                {
                  key: 'key',
                  value: 'service_nmi',
                  column: 'service_nmi',
                  join: 'OR'
                }
              ]
            }
          }
        ],
        loading: false,
        file: null
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
      numberOfSites () {
        return this.$store.getters.loadedForms(this.getFormTemplateId('Site')).length
      },
      numberOfServices () {
        return this.$store.getters.loadedForms(this.getFormTemplateId('Service')).length
      },
      numberOfUsers () {
        return this.$store.getters.loadedUsers(this.slug).length
      },
      stats () {
        return [
          { name: 'Sites', count: this.numberOfSites, icon: 'place', color: 'blue' },
          { name: 'Services', count: this.numberOfServices, icon: 'ev_station', color: 'orange' },
          { name: 'Useages', count: this.numberOfUsers, icon: 'trending_up', color: 'green' }
        ]
      },
      sites () {
        const sites = []
        const form_template_id = 32
        const forms = this.$store.getters.loadedForms(form_template_id)
        _.forEach(forms, form => {
          const row = []
          _.forEach(this.sitesHeaders, header => {
            const response = form.responses.find(response => response.question_id === header.value)
            row.push(response ? response.response : '')
          })
          sites.push(row)
        })
        const filteredSites = _.filter(sites, site => { return site[0] !== null })
        return filteredSites
      },
      sitesHeaders () {
        const siteFields = []
        const form_template_name = 'Site'
        const questions = _.orderBy(this.$store.getters.loadedApplicationQuestions(this.slug), 'order')
        _.forEach(questions, question => {
          if(question.form_template_name === form_template_name) {
            siteFields.push({ text: question.question, value: question.id })
          }
        })
        return siteFields
      }
    },
    methods: {
      getFormTemplateId (name) {
        const formTemplate = _.find(this.formTemplates, { name: name })
        return formTemplate ? formTemplate.id : null
      },
      uploadFiles () {
        if (!this.file) return

        this.uploadingFormData = true
        this.uploadFile(0)
      },
      uploadFile (index) {
        let formTemplate = this.formTemplates[index]
        this.$store.dispatch('uploadFormData', {
          slug: this.slug,
          id: formTemplate.id,
          file: this.file,
          where: JSON.stringify(formTemplate.where),
          method: 'key'
        })
        .then(response => {
          this.formTemplates[index + 1] ? this.uploadFile(index + 1) : this.postFormDataUpload()
        })
        .catch(error => {
          console.log(error)
        })
      },
      postFormDataUpload () {
        this.uploadingFormData = false
        this.$store.dispatch('loadAllForms', this.slug)
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
      }
    },
    created () {
      this.getDashboardData()
      this.timer = setInterval(this.getDashboardData, 10000)
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
