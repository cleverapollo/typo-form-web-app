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

                <v-layout row justify-center v-for="(filter, index) in filters" :key="index">
                  <v-flex xs1 px-3>

                  </v-flex>

                  <!-- // Source -->
                  <v-flex xs3 px-3>
                    <v-autocomplete
                      :items="sources"
                      label="Source"
                      v-model="filter.source"
                      item-text="question"
                      item-value="question"
                      single-line
                    >
                      <template
                        slot="selection"
                        slot-scope="data"
                      >
                        {{ data.item.question }}
                      </template>
                      <template
                        slot="item"
                        slot-scope="data"
                      >
                        <v-list-tile-content>
                          <v-list-tile-title>{{data.item.question}}</v-list-tile-title>
                          <v-list-tile-sub-title>{{data.item.group}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </template>
                    </v-autocomplete>
                  </v-flex>

                  <!-- // Query -->
                  <v-flex xs3 px-3>
                    <v-autocomplete
                      label="Query"
                    >
                    </v-autocomplete>
                  </v-flex>

                  <!-- // Value -->
                  <v-flex xs3 px-3>
                    <v-autocomplete
                      label="Value"
                    >
                    </v-autocomplete>
                  </v-flex>

                  <!-- // Actions -->
                  <v-flex xs2 px-3 mt-2>
                    <v-btn outline color="error" @click.stop="deleteFilter(index)">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>

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
  computed: {
    user () {
      return this.$store.getters.user
    },
    sources () {
      let sources = [
        {'group': 'Submission Detail', 'question': 'Form'},
        {'group': 'Submission Detail', 'question': 'Owner'},
        {'group': 'Submission Detail', 'question': 'Owner Email'},
        {'group': 'Submission Detail', 'question': 'Team'},
        {'group': 'Submission Detail', 'question': 'Progress'},
        {'group': 'Submission Detail', 'question': 'Period Start'},
        {'group': 'Submission Detail', 'question': 'Period End'},
        {'group': 'Submission Detail', 'question': 'Status'},
        {'group': 'Submission Detail', 'question': 'Created'},
        {'group': 'Submission Detail', 'question': 'Modified'}
      ]
      const questions = this.$store.getters.loadedApplicationQuestions(this.slug)
      _.forEach(questions, (question) => {
        sources.push({'group': question.form_name + ' > ' + question.section_name, 'question': question.question, 'id': question.id})
      }, this)
      return sources
    },
    comparators () {
      return this.$store.getters.comparators
    }
  },
  methods: {
    deleteFilter (index) {
      this.filters.splice(index, 1)
    },
    addFilter (index) {
      this.filters.push(this.filterTemplate)
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
    this.filters.push(this.filterTemplate)
    if (this.user) {
      this.$store.dispatch('loadForms', this.slug)
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