<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Forms</h1>
        </v-flex>
        <v-flex d-flex xs12>
          <p>Select an existing form below or <a href="#" @click.stop="createForm = true">create a new form</a>.</p>
        </v-flex>
        <v-flex d-flex xs12>
          <v-card>

            <!-- //Search -->
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>

            <!-- //Forms -->
            <v-data-table
              :headers="headers"
              :items="forms"
              :search="search"
              hide-actions
            >
              <template slot="items" slot-scope="props">
                <tr>
                  <td @click="onForm(props.item.id)">{{ props.item.formTemplate.name }}</td>
                  <td @click="onForm(props.item.id)">{{ props.item.owner }}</td>
                  <td @click="onForm(props.item.id)">{{ props.item.user.email }}</td>
                  <td @click="onForm(props.item.id)">{{ props.item.created_at.date | moment }}</td>
                  <td @click="onForm(props.item.id)">{{ props.item.updated_at.date | moment }}</td>
                  <td @click="onForm(props.item.id)">{{ props.item.progress }}%</td>
                  <td @click="onForm(props.item.id)">{{ props.item.status }}</td>
                  <td class="justify-center layout px-0">
                    <v-btn icon class="mx-0" @click="duplicateForm(props.item.id, props.item.formTemplate.id)">
                      <v-icon color="teal">content_copy</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="showDeleteForm(props.item.id, props.item.formTemplate.id)">
                      <v-icon color="pink">delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
              </v-alert>
            </v-data-table>

          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <!-- //Action Button -->
    <v-tooltip top>
      <v-btn slot="activator" fixed dark bottom right fab router class="red" @click.stop="createForm = true">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Create Form</span>
    </v-tooltip>

    <!-- //Create Form -->
    <CreateForm :visible="createForm" :slug="slug" @close="createForm = false" key="CreateForm"></CreateForm>

    <!-- //Delete Form -->
    <DeleteConfirmDialog @delete-action="onDeleteForm" :visible="deleteForm" @close="deleteForm = false"></DeleteConfirmDialog>

    <!-- //Duplicate formTemplate -->
    <DuplicateForm :visible="duplicated" :content="duplicatedContent" @close="duplicated = false"></DuplicateForm>
  </v-layout>
</template>

<script>
  import CreateForm from './CreateForm'
  import DuplicateForm from './DuplicateForm'
  import moment from 'moment'

  export default {
    name: 'Forms',
    components: {
      CreateForm,
      DuplicateForm
    },
    data () {
      return {
        createForm: false,
        search: '',
        headers: [
          { text: 'FormTemplate', value: 'formTemplate.name', sortable: true, align: 'left' },
          { text: 'Owner', value: 'owner', sortable: true, align: 'left' },
          { text: 'Email', value: 'user.email' },
          { text: 'Created', value: 'created_at.date', sortable: true, align: 'left' },
          { text: 'Modified', value: 'updated_at.date', sortable: true, align: 'left' },
          { text: 'Progress', value: 'progress', sortable: true, align: 'left' },
          { text: 'Status', value: 'status', sortable: true, align: 'left' },
          { text: 'Action', value: 'action', sortable: true, align: 'left' }
        ],
        slug: window.location.hostname.split('.')[0],
        selectedId: 0,
        selectedFormTemplateId: 0,
        deleteForm: false,
        duplicated: false,
        duplicatedContent: false
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      forms () {
        let forms = this.$store.getters.loadedAllForms(this.slug)
        forms.forEach((form) => {
          form.owner = form.organisation ? form.organisation.name : form.user.first_name + ' ' + form.user.last_name
          form.status = this.status(form.status_id)
        })
        return forms
      },
      statuses () {
        return this.$store.getters.statuses
      }
    },
    methods: {
      showDeleteForm (id, formTemplateId) {
        this.selectedId = id
        this.selectedFormTemplateId = formTemplateId
        this.deleteForm = true
      },
      onDeleteForm () {
        this.$store.dispatch('deleteForm',
          {
            formTemplateId: this.selectedFormTemplateId,
            id: this.selectedId
          }
        )
      },
      duplicateForm (id, formTemplateId) {
        this.$store.dispatch('duplicateForm', {
          formTemplateId: formTemplateId,
          id: id
        })
          .then((response) => {
            this.duplicated = true
            this.duplicatedContent = response.data.form.id
          })
      },
      onForm (id) {
        this.$router.push('/forms/' + id)
      },
      status (id) {
        return this.statuses.find(e => { return e.id === id }).status
      }
    },
    created: function () {
      if (this.user) {
        this.$store.dispatch('loadUsers', this.slug)
        this.$store.dispatch('loadOrganisations', this.slug)
        this.$store.dispatch('loadFormTemplates', this.slug)
        this.$store.dispatch('loadAllForms', this.slug)
        this.$store.dispatch('loadAllOrganisationUsers', this.slug)
      }
    },
    filters: {
      moment: function (date) {
        return moment(date).format('YYYY-MM-DD h:MM A')
      }
    }
  }
</script>
