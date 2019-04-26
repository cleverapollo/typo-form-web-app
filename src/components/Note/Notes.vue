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
            <td @click='editItem(props.item)'>{{ props.item.type }}</td>
            <td @click='editItem(props.item)'>{{ props.item.description }}</td>
            <td @click='editItem(props.item)'>{{ props.item.recordable_type }}</td>
            <td @click='editItem(props.item)'>{{ props.item.recordable }}</td>
            <td @click='editItem(props.item)'>{{ props.item.task }}</td>
            <td @click='editItem(props.item)'>{{ props.item.task_due_at | $_formatDate }}</td>
            <td @click='editItem(props.item)'>{{ props.item.created_at | $_formatDateTime }}</td>
            <td @click='editItem(props.item)'>{{ props.item.updated_at | $_formatDateTime }}</td>
            <td class="justify-center layout px-0">
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

    <v-dialog v-model="dialog" fullscreen hide-overlay lazy>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.stop="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>
        </v-toolbar>

        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-container fluid>
            <div class="subheading my-2">Note Details</div>
            <p>Set the details of the note.</p>
            <v-layout row wrap class="mb-4">

              <v-flex xs12>
                <v-layout>
                  <v-flex xs12 md6 pr-4>
                    <v-autocomplete
                      :items="recordableTypes"
                      v-model="note.recordable_type"
                      label="Record type"
                      :rules="rules.record_type"
                    ></v-autocomplete>
                  </v-flex>

                  <v-flex xs12 md6>
                    <v-autocomplete
                      v-model="note.recordable_id"
                      :items="records(note.recordable_type)"
                      label="Record"
                      item-text="name"
                      item-value="id"
                      :rules="rules.record"
                    ></v-autocomplete>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex xs12>
                <v-layout>
                  <v-flex xs12 md6 pr-4>
                    <v-autocomplete
                      :items="noteTypes"
                      item-value="id"
                      item-text="type"
                      v-model="note.note_type_id"
                      label="Note type"
                      :rules="rules.note_type"
                    ></v-autocomplete>
                  </v-flex>

                  <v-flex xs12 md6>
                    <v-text-field
                      v-model="note.description"
                      label="Description"
                      :rules="rules.description"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex xs12>
                <v-textarea
                  v-model="note.note"
                  label="Note"
                  rows=2
                  auto-grow
                ></v-textarea>
              </v-flex>

            </v-layout>
          </v-container>

          <v-divider class="py-2"></v-divider>

          <v-container fluid>
            <div class="subheading my-2">Followup Task</div>
            <p>Set the details of any followup tasks for the note.</p>

            <v-layout row wrap class="mb-4">
              <v-flex xs12>
                <v-textarea
                  v-model="note.task"
                  label="Task"
                  rows=2
                  auto-grow
                ></v-textarea>
              </v-flex>

              <v-flex xs12>
                <v-dialog
                  ref="dateDialog"
                  v-model="dateDialog"
                  :return-value.sync="note.task_due_at"
                  persistent
                  lazy
                  full-width
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="note.task_due_at"
                      label="Task Due"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="note.task_due_at" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="dateDialog = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.dateDialog.save(note.task_due_at)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-flex>
            </v-layout>

          </v-container>

          <!-- // Actions -->
          <v-divider></v-divider>
          <v-container fluid>
            <v-layout row py-2>
              <v-flex xs12 class="text-xs-right">
                <v-btn flat @click.stop="close">Cancel</v-btn>
                <v-btn flat class="primary" @click.stop="validate">Save</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
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
      valid: true,
      dialog: false,
      dateDialog: false,
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
        { text: 'Task', value: 'task' },
        { text: 'Due', value: 'task_due_at' },
        { text: 'Created', value: 'created_at' },
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
        { id: 4, type: 'Meeting' },
        { id: 3, type: 'Other' }
      ],
      editedIndex: -1,
      note: {
        note_type_id: '',
        description: '',
        note: '',
        recordable_type: '',
        recordable_id: '',
        task: null,
        task_due_at: null
      },
      noteTemplate: {
        note_type_id: '',
        description: '',
        note: '',
        recordable_type: '',
        recordable_id: '',
        task: null,
        task_due_at: null
      },
      errorMessage: '',
      loadingNotes: false,
      rules: {
        record_type: [
          v => !!v || 'Record type is required'
        ],
        record: [
          v => !!v || 'Record is required'
        ],
        note_type: [
          v => !!v || 'Note type is required'
        ],
        description: [
          v => !!v || 'Description is required'
        ]
      }
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
            recordable_id: this.note.recordable_id,
            task: this.note.task,
            task_due_at: this.note.task_due_at
          }
          this.$store.dispatch('updateNote', updateObj)
        } else {
          this.$store.dispatch('createNote', {
            slug: this.$_slug,
            note_type_id: this.note.note_type_id,
            description: this.note.description,
            note: this.note.note,
            recordable_type: this.note.recordable_type,
            recordable_id: this.note.recordable_id,
            task: this.note.task,
            task_due_at: this.note.task_due_at
          })
        }
        this.close()
      },
      records (type) {
        let records = []
        let users = this.$store.getters.loadedUsers(this.$_slug)
        let organisations = this.$store.getters.loadedOrganisations(this.$_slug)

        if (type === 'User') {
          users.forEach((record) => {
            record.name = record.first_name + ' ' + record.last_name + ' (' + record.email + ')'
            records.push(record)
          })
        }
        if (type === 'Organisation') {
          organisations.forEach((record) => {
            records.push(record)
          })
        }

        return sortBy(records, record => { return record.name })
      },
      validate () {
        if (this.$refs.form.validate()) {
          this.save()
        }
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