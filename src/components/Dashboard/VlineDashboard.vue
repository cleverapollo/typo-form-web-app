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
                :headers="getFormTableHeader(item.form)"
                :items="getFormTableData(item.form)"
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
                  @click="uploadFile" 
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
      formTemplates () {
        return this.$store.getters.loadedFormTemplates(this.slug)
      },
      forms () {
        return this.$store.getters.loadedAllForms(this.slug)
      },
      items () {
        return [
          { form: 'Site', label: 'Sites', icon: 'place', color: 'blue' },
          { form: 'Service', label: 'Services', icon: 'ev_station', color: 'orange' },
          { form: 'Vehicle', label: 'Vehicles', icon: 'directions_car', color: 'green' },
          { form: 'Useage', label: 'Useages', icon: 'trending_up', color: 'red' }
        ]
      }
    },
    methods: {
      getFormTableHeader (formTemplateName) {
        const headers = []
        const formTemplate = _.find(this.formTemplates, formTemplate => { return formTemplate.name === formTemplateName })
        const sections = formTemplate ? _.orderBy(this.$store.getters.loadedSections(formTemplate.id), 'order') : null
        _.forEach(sections, section => {
          _.forEach(section.questions, question => {
            headers.push({ text: question.question, value: question.id })
          })
        })
        return headers
      },
      getFormTableData (formTemplateName) {
        return []
      },
      getTabLink (name) {
        return '#' + name.toLowerCase()
      },
      getFormCount (name) {
        const forms = _.filter(this.forms, form => { return form.form_template.name === name })
        return forms ? forms.length : 0
      },
      uploadFile () {
        this.$store.dispatch('uploadFormData', {
          slug: this.slug,
          file: this.file
        })
        .catch(error => {
          console.log(error)
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