<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>

        <!-- //Title -->
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Form Templates</h1>
        </v-flex>
        <v-flex d-flex xs12>
          <p>Select an existing form template below or <a href="#" @click.stop="createFormTemplate = true">create a new form template</a>.</p>
        </v-flex>

        <!-- //Form template List -->
        <v-flex d-flex xs12>
          <v-card>

            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="formTemplates"
              :search="search"
              hide-actions
            >
              <template slot="items" slot-scope="props">
                <td @click='onLoadFormTemplate(props.item.id)' >{{ props.item.name }}</td>
                <td @click='onLoadFormTemplate(props.item.id)' >{{ props.item.forms_length }}</td>
                <td @click='onLoadFormTemplate(props.item.id)' >{{ props.item.status }}</td>
                <td @click='onLoadFormTemplate(props.item.id)' >{{ props.item.created_at.date | moment }}</td>
                <td>
                  <v-btn icon class='mx-0' @click='showDuplicateFormTemplate(props.item)'>
                    <v-icon color='teal'>content_copy</v-icon>
                  </v-btn>
                  <v-btn icon class='mx-0' @click='showDeleteFormTemplate(props.item.id)'>
                    <v-icon color='pink'>delete</v-icon>
                  </v-btn>
                </td>
              </template>
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
              </v-alert>
            </v-data-table>
          </v-card>
        </v-flex>

      </v-layout>
    </v-flex>

    <!-- //Create Form Template -->
    <v-tooltip top>
      <v-btn slot="activator" fixed dark bottom right fab router class="error" @click.stop="createFormTemplate = true" v-if="userIsApplicationAdmin">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Create Form Template</span>
    </v-tooltip>

    <!-- //Create Form Template -->
    <CreateFormTemplate :slug="slug" :visible="createFormTemplate" v-if="userIsApplicationAdmin" @close="createFormTemplate = false"></CreateFormTemplate>

    <!-- //Delete Form Template -->
    <DeleteConfirmDialog @delete-action="onDeleteFormTemplate" :visible="deleteFormTemplate" @close="deleteFormTemplate = false"></DeleteConfirmDialog>

    <!-- //Delete Form Template -->
    <DuplicateConfirmDialog @action="onDuplicateFormTemplate" :visible="duplicateFormTemplate" @close="duplicateFormTemplate = false" :defaultName="defaultName"></DuplicateConfirmDialog>
  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  import moment from 'moment'
  import CreateFormTemplate from './CreateFormTemplate'
  import UserMixin from '../Layout/UserMixin'

  export default {
    data () {
      return {
        slug: window.location.hostname.split('.')[0],
        search: '',
        selectedId: 0,
        headers: [
          {text: 'Form Template', value: 'name'},
          {text: 'Forms', value: 'forms_length'},
          {text: 'Status', value: 'status'},
          {text: 'Created', value: 'created_at.date'},
          {text: 'Actions', value: 'Actions'}
        ],
        defaultName: '',
        createFormTemplate: false,
        deleteFormTemplate: false,
        duplicateFormTemplate: false
      }
    },
    mixins: [UserMixin],
    components: {
      CreateFormTemplate
    },
    computed: {
      statuses () {
        return this.$store.getters.statuses
      },
      application () {
        return this.$store.getters.loadedApplication(this.slug)
      },
      formTemplates () {
        let formTemplates = _.sortBy(this.$store.getters.loadedFormTemplates(this.slug), element => {
          return element.name.toLowerCase()
        })
        formTemplates.forEach((formTemplate) => {
          const status = this.statuses.find((status) => {
            return status.id === formTemplate.status_id
          })
          formTemplate.status = ((status.status === 'Open') ? 'Draft' : 'Published')
        })
        return formTemplates
      }
    },
    methods: {
      onLoadFormTemplate (id) {
        this.$router.push('/form-templates/' + id)
      },
      showDuplicateFormTemplate (item) {
        this.selectedId = item.id
        this.defaultName = item.name
        this.duplicateFormTemplate = true
      },
      showDeleteFormTemplate (id) {
        this.selectedId = id
        this.deleteFormTemplate = true
      },
      onDeleteFormTemplate () {
        this.$store.dispatch('deleteFormTemplate', {
          slug: this.slug,
          id: this.selectedId
        })
      },
      onDuplicateFormTemplate (name) {
        this.$store.dispatch('duplicateFormTemplate', {
          slug: this.slug,
          id: this.selectedId,
          name: name
        })
          .then(response => {
            // Redirect to the formTemplate Templates
            if (response.data.form_template.id) {
              this.$router.push('/form-templates/' + response.data.form_template.id)
            }
          })
      }
    },
    created: function () {
      this.$store.dispatch('loadFormTemplates', this.slug)
    },
    filters: {
      moment: function (date) {
        return moment(date).format('YYYY-MM-DD h:MM A')
      }
    }
  }
</script>
