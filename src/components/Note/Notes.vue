<template>
  <v-layout row wrap>

    <v-flex d-flex xs12>
      <h1 class='headline primary--text py-3'>Notes</h1>
    </v-flex>

    <v-flex d-flex xs12>
      <p>Select an existing note below or <a href='#' @click.stop='dialog = true'>create a new note</a>.</p>
    </v-flex>

    <v-flex d-flex xs12>
      <v-card>
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
        <v-data-table
          :headers="headers"
          :items="notes"
          :search="search"
          :loading="loadingNotes"
          :pagination.sync="pagination"
          :rows-per-page-items="[25, 50, 100, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }]"
        >
          <template v-slot:items="props">
            <td>{{ props.item.type }}</td>
            <td>{{ props.item.description }}</td>
            <td>{{ props.item.recordable_type }}</td>
            <td>{{ props.item.recordable }}</td>
            <td>{{ props.item.updated_at | $_formatDate }}</td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn icon class='mx-0' @click='editItem(props.item)' slot="activator">
                  <v-icon color='teal'>edit</v-icon>
                </v-btn>
                <span>Edit</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn icon class='mx-0' @click='deleteItem(props.item)' slot="activator">
                  <v-icon color='pink'>delete</v-icon>
                </v-btn>
                <span>Delete</span>
              </v-tooltip>
            </td>
          </template>
          <v-alert v-slot:no-results :value="true" color="error" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
        </v-data-table>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <div class="title mb-2 mt-2">{{ dialogTitle }}</div>
        </v-card-title>
        <v-card-text>

          <v-layout row wrap>

            <v-flex xs12>
              <v-autocomplete
                :items="noteTypes"
                item-value="id"
                item-text="type"
                v-model="note.note_type_id"
                label="Note type"
              ></v-autocomplete>
            </v-flex>

            <v-flex xs12>
              <v-autocomplete
                :items="recordableTypes"
                v-model="note.recordable_type"
                label="Record type"
              ></v-autocomplete>
            </v-flex>

            <v-flex xs12>
              <v-autocomplete
                v-model="note.recordable_id"
                :items="records(note.recordable_type)"
                label="Record"
                item-text="name"
                item-value="id"
              ></v-autocomplete>
            </v-flex>

            <v-flex xs12>
              <v-text-field
                v-model="note.description"
                label="Description"
              ></v-text-field>
            </v-flex>

            <v-flex xs12>
              <v-textarea
                v-model="note.note"
                label="Note"
                auto-grow
              ></v-textarea>
            </v-flex>

          </v-layout>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-layout row py-2>
            <v-flex xs12 class="text-xs-right">
              <v-btn 
                flat 
                @click.stop="close"
              >Cancel
              </v-btn>
              <v-btn
                flat
                class="primary"
                @click.stop="save"
              >Save
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-tooltip top>
      <v-btn slot='activator' fixed dark bottom right fab router class='red' @click.stop='dialog = true'>
        <v-icon>add</v-icon>
      </v-btn>
      <span>Create Note</span>
    </v-tooltip>

  </v-layout>
</template>
<script>
  import sortBy from 'lodash/sortBy'
  import ApplicationMixin from '../../mixins/ApplicationMixin'
  export default {
    mixins: [ApplicationMixin],
    data: () => ({
      dialog: false,
      search: '',
      pagination: {
        sortBy: 'updated_at',
        descending: true
      },
      headers: [
        { text: 'Type', value: 'type' },
        { text: 'Description', value: 'description' },
        { text: 'Record Type', value: 'recordable_type' },
        { text: 'Record', value: 'recordable' },
        { text: 'Updated', value: 'updated_at' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      recordableTypes: [
        'User',
        'Organisation'
      ],
      noteTypes: [
        { id: 1, type: 'Phone' },
        { id: 2, type: 'Email' },
        { id: 3, type: 'Other' }
      ],
      editedIndex: -1,
      note: {
        note_type_id: '',
        description: '',
        note: '',
        recordable_type: '',
        recordable_id: ''
      },
      noteTemplate: {
        note_type_id: '',
        description: '',
        note: '',
        recordable_type: '',
        recordable_id: ''
      },
      errorMessage: '',
      loadingNotes: false
    }),
    computed: {
      notes () {
        let notes = this.$store.getters.loadedNotes(this.$_slug)
        notes.forEach((record) => {
          const list = this.records(record.recordable_type)
          const element = list.find(value => value.id === record.recordable_id)
          const recordType = record.note_type_id ? this.noteTypes.find(noteType => { return noteType.id === record.note_type_id }) : null
          record.type = recordType ? recordType.type : ''
          record.recordable = element ? element.name : ''
        })
        return notes
      },
      dialogTitle () {
        return this.editedIndex === -1 ? 'Create Note' : 'Edit Note'
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    methods: {
      editItem (item) {
        this.editedIndex = this.notes.indexOf(item)
        this.note = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.$store.dispatch('deleteNote', {
          id: item.id,
          slug: this.$_slug
        })
      },
      close () {
        this.dialog = false
        this.errorMessage = ''
        setTimeout(() => {
          this.note = Object.assign({}, this.noteTemplate)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        if (this.editedIndex > -1) {
          const updateObj = {
            id: this.note.id,
            slug: this.$_slug,
            note_type_id: this.note.event,
            description: this.note.description,
            note: this.note.note,
            recordable_type: this.note.recordable_type,
            recordable_id: this.note.recordable_id
          }
          this.$store.dispatch('updateNote', updateObj)
        } else {
          this.$store.dispatch('createNote', {
            slug: this.$_slug,
            note_type_id: this.note.note_type_id,
            description: this.note.description,
            note: this.note.note,
            recordable_type: this.note.recordable_type,
            recordable_id: this.note.recordable_id
          })
        }
        this.close()
      },
      records (type) {
        let records = []
        if (type === 'User') {
          records = this.$store.getters.loadedUsers(this.$_slug)
          records.forEach((record) => {
            record.name = record.first_name + ' ' + record.last_name + ' (' + record.email + ')'
          })
        }
        if (type === 'Organisation') {
          records = sortBy(this.$store.getters.loadedOrganisations(this.$_slug), organisation => { return organisation.name })
        }
        return sortBy(records, record => { return record.name })
      }
    },
    created () {
      this.loadingNotes = true
      Promise.all([
        this.$store.dispatch('loadUsers', this.$_slug),
        this.$store.dispatch('loadOrganisations', this.$_slug)
      ])
        .then(() => {
          this.$store.dispatch('loadNotes', this.$_slug)
          this.loadingNotes = false
        })
    }
  }
</script>