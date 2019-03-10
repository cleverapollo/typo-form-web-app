<template>
  <v-container fluid grid-list-lg class="dashboard-container">

    <!-- // Welcome -->
    <Welcome></Welcome>

    <!-- // Counter -->
    <v-layout row justify-space-around>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-layout row wrap>
              <v-flex
                v-for="stat in stats"
                xs12 md4 text-md-center
                :key="stat.name"
                class="stat-component">
                  <div class="display-2">
                    <countTo :startVal="countToStart" :endVal="stat.count" :duration="countToDuration"></countTo>
                  </div>
                  <span>{{ stat.name }}</span>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- // Upload Data -->
    <v-layout row>
      <v-flex xs4>
        <v-card>
          <v-card-title>
            <span class="title">Upload Data</span>
          </v-card-title>
          <v-card-text>

            <v-layout row>
              <v-flex xs12>
                <input 
                  id="upload" 
                  type="file" 
                  accept=".csv, .xls, .xlsx"
                  @change="changeFile"
                  :disabled="loading"
                  />
              </v-flex>
            </v-layout>

            <v-layout row v-if="file && !loading">
              <v-flex text-xs-center xs12 py-2>
                <v-btn 
                  class="primary"
                  @click="uploadFile" 
                  :disabled="loading">
                    Start Upload
                </v-btn>
              </v-flex>
            </v-layout>

            <v-layout row v-if="loading">
              <v-flex text-xs-center xs12>
                <v-progress-linear
                  indeterminate
                >
                </v-progress-linear>
              </v-flex>
            </v-layout>

          </v-card-text>
        </v-card>
      </v-flex>
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
        formTemplates: [
          {
            id: 17,
            name: 'Site',
            where: {
              questions: [
                {
                  key: 'question',
                  value: 'Name',
                  column: 'site_name'
                }
              ]
            }
          },
          {
            id: 15,
            name: 'Service'
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
          { name: 'Sites', count: this.numberOfSites },
          { name: 'Services', count: this.numberOfServices },
          { name: 'Users', count: this.numberOfUsers }
        ]
      }
    },
    methods: {
      getFormTemplateId (name) {
        const formTemplate = _.find(this.formTemplates, { name: name })
        return formTemplate ? formTemplate.id : null
      },
      uploadFile () {
        if (!this.file) return

        this.loading = true
        _.forEach(this.formTemplates, formTemplate => {
          this.$store.dispatch('uploadFormData', {
            slug: this.slug,
            id: formTemplate.id,
            file: this.file,
            where: JSON.stringify(formTemplate.where),
            method: 'key'
          })
          .then(response => {
            this.$store.dispatch('loadAllForms', this.slug)
          })
          .catch(error => {
            console.log(error)
          })
        })
        this.loading = false
      },
      changeFile (e) {
        const files = e.target.files || e.dataTransfer.files
        this.file = files.length ? files[0] : false
      }
    },
    created () {
      this.$store.dispatch('loadAllForms', this.slug)
      this.$store.dispatch('loadUsers', this.slug)
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
