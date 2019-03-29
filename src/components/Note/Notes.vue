<template>
    <div>
        <v-toolbar flat color="white">
            <v-toolbar-title>Notes</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-text-field v-model="editedItem.event" label="Event"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field v-model="editedItem.note" label="Note"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-select
                                            v-model="editedItem.recordable_type"
                                            :items="types"
                                            label="Type"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12>
                                    <v-select
                                            v-model="editedItem.recordable_id"
                                            :items="records(editedItem.recordable_type)"
                                            label="Record"
                                            item-text="name"
                                            item-value="id"
                                    ></v-select>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <span v-if="errorMessage" class="red--text">{{ errorMessage }}</span>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                        <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>
        <v-card>
            <v-card-title>
                Nutrition
                <v-spacer></v-spacer>
                <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                        :loading="loadingNotes"
                ></v-text-field>
            </v-card-title>
            <v-data-table
                    :headers="headers"
                    :items="notes"
                    class="elevation-1"
                    :search="search"
            >
                <template v-slot:items="props">
                    <td>{{ props.item.event }}</td>
                    <td>{{ props.item.note }}</td>
                    <td>{{ props.item.recordable_type }}</td>
                    <td>{{ props.item.recordable }}</td>
                    <td class="justify-center layout px-0">
                        <v-icon
                                small
                                class="mr-2"
                                @click="editItem(props.item)"
                        >
                            edit
                        </v-icon>
                        <v-icon
                                small
                                @click="deleteItem(props.item)"
                        >
                            delete
                        </v-icon>
                    </td>
                </template>
                <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </v-data-table>
        </v-card>
    </div>
</template>
<script>
  export default {
    data: () => ({
      slug: window.location.hostname.split('.')[0],
      dialog: false,
      search: '',
      headers: [
        { text: 'Event', value: 'event' },
        { text: 'Note', value: 'note' },
        { text: 'Type', value: 'recordable_type' },
        { text: 'Record', value: 'recordable' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      types: [
        'Form',
        'Organisation',
        'User'
      ],
      editedIndex: -1,
      editedItem: {
        event: '',
        note: '',
        recordable_type: '',
        recordable_id: ''
      },
      defaultItem: {
        event: '',
        note: '',
        recordable_type: '',
        recordable_id: ''
      },
      errorMessage: '',
      loadingNotes: false
    }),
    computed: {
      notes () {
        let notes = this.$store.getters.loadedNotes(this.slug)
        notes.forEach((record) => {
          const list = this.records(record.recordable_type)
          const element = list.find(value => value.id === record.recordable_id)
          record.recordable = element ? element.name : ''
        })
        return notes
      },
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.$store.dispatch('deleteNote', {
          id: item.id,
          slug: this.slug
        })
      },
      close () {
        this.dialog = false
        this.errorMessage = ''
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        if (!this.editedItem.event || !this.editedItem.note) {
          this.errorMessage = 'Event and Note are required.'
          return
        }
        if (this.editedIndex > -1) {
          const updateObj = {
            id: this.editedItem.id,
            slug: this.slug,
            event: this.editedItem.event,
            note: this.editedItem.note,
            recordable_type: this.editedItem.recordable_type,
            recordable_id: this.editedItem.recordable_id
          }
          this.$store.dispatch('updateNote', updateObj)
        } else {
          this.$store.dispatch('createNote', {
            slug: this.slug,
            event: this.editedItem.event,
            note: this.editedItem.note,
            recordable_type: this.editedItem.recordable_type,
            recordable_id: this.editedItem.recordable_id
          })
        }
        this.close()
      },
      records (type) {
        let records = []
        if (type === 'Form') {
          records = this.$store.getters.loadedAllForms(this.slug)
          records.forEach((record) => {
            record.name = record.form_template.name
          })
        }
        if (type === 'Organisation') {
          records = this.$store.getters.loadedOrganisations(this.slug)
        }
        if (type === 'User') {
          records = this.$store.getters.loadedUsers(this.slug)
          records.forEach((record) => {
            record.name = record.first_name + ' ' + record.last_name
          })
        }
        return records
      }
    },
    created () {
      this.loadingNotes = true
      Promise.all([
        this.$store.dispatch('loadOrganisations', this.slug),
        this.$store.dispatch('loadFormTemplates', this.slug),
        this.$store.dispatch('loadAllForms', this.slug),
        this.$store.dispatch('loadUsers', this.slug)
      ])
        .then(() => {
          this.$store.dispatch('loadNotes', this.slug)
          this.loadingNotes = false
        })
    }
  }
</script>