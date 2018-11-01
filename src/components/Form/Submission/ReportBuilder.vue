<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Report Builder</h1>
        </v-flex>
        <v-flex d-flex xs12>
          <p>Add filters below to start building your custom report.</p>
        </v-flex>
        <v-flex d-flex xs12>
          <v-card>

            <v-card-title>
                <div class="title">Filters</div>
              <v-container>

                <template v-for="(filter, index) in filters">

                  <ReportComponent
                    :filter="filter"
                    @delete-filter="deleteFilter"
                    :key="'filter' + index"
                  />

                </template>

                <!-- // Action Buttons -->
                <v-layout row justify-center>
                  <v-flex xs2 px-3>
                    <v-btn block color="primary" @click.stop="addFilter">Add Filter</v-btn>
                  </v-flex>
                  <v-flex xs2 px-3>
                    <v-btn block color="success" @click.stop="applyFilters">Apply Filters</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>

            </v-card-title>
            <v-divider></v-divider>

            <v-card-title>
              <div class="title">Results</div>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>

            <!-- // Data -->
            <v-data-table
              :headers="headers"
              :items="data"
              :search="search"
            >
              <template slot="items" slot-scope="props">
                <!--
                <tr @click="onSubmission(props.item.id)">
                  <td>{{ props.item.form.name }}</td>
                  <td>{{ props.item.owner }}</td>
                  <td>{{ props.item.created_at.date | moment }}</td>
                  <td>{{ props.item.updated_at.date | moment }}</td>
                  <td>{{ props.item.status }}</td>
                </tr>
                -->
              </template>
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your filters returned no results. Try changing your filters.
              </v-alert>
              <v-alert slot="no-data" :value="true" color="error" icon="warning">
                Your filters returned no results. Try changing your filters.
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
import ReportComponent from './ReportComponent'
export default {
  name: 'ReportBuilder',
  data () {
    return {
      search: '',
      headers: [],
      data: [],
      filters: [],
      filterTemplate: { source: '', query: '', value: '', answer: '' },
      slug: window.location.hostname.split('.')[0]
    }
  },
  components: {
    ReportComponent
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
    jsonCopy (src) {
      return JSON.parse(JSON.stringify(src))
    },
    deleteFilter (index) {
      this.filters.splice(index, 1)
    },
    addFilter () {
      const newFilter = this.jsonCopy(this.filterTemplate)
      this.filters.push(newFilter)
    },
    applyFilters () {
      // Clear data and headers
      this.data.splice(0, this.data.length)
      this.headers.splice(0, this.headers.length)
      // Add new headers
      _.forEach(this.filters, (filter, key) => {
        this.headers.push({ text: filter.source, value: filter.source })
      })
    }
  },
  created: function () {
    this.addFilter()
    if (this.user) {
      this.$store.dispatch('loadForms', this.slug)
        .then((response) => {
          const forms = response.data.forms
          _.forEach(forms, (form) => {
            this.$store.dispatch('loadSections', form.id)
          })
        })
      this.$store.dispatch('loadAllSubmissions', this.slug)
    }
  }
}
</script>