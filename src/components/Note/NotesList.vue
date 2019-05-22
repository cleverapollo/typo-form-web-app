<template>
  <v-layout row wrap>

    <v-flex d-flex xs12>
      <h1 class='headline primary--text py-3'>Notes</h1>
    </v-flex>

    <v-flex d-flex xs12>
      <p>Select an existing note below or <a href='#' @click.stop='dialog = true'>create a new note</a>.</p>
    </v-flex>

    <v-flex d-flex xs12>
      <DataTable
        title="Notes"
        item-key="id"
        v-bind:headers="headers"
        v-bind:items="items"
        v-bind:loading="loading"
        v-bind:pagination="pagination"
        @refresh="refreshItems"
        @delete="deleteItems"
        @click="selectItem"
        @create="createItem"
      ></DataTable>
    </v-flex>

    <NotesEdit :id="selectedNoteId" :show="showNotesEdit"></NotesEdit>

  </v-layout>
</template>
<script>
  // import { sortBy, find } from 'lodash'
  import DataTable from '../DataTable/DataTable'
  import NotesEdit from './NotesEdit'
  export default {
    name: 'NotesList',
    components: {
      DataTable,
      NotesEdit
    },
    data () {
      return {
        loading: false,
        selectedNoteId: null,
        showNotesEdit: false,
        headers: [
          { text: 'Note ID', value: 'id', visible: false },
          { text: 'Type', value: 'type' },
          { text: 'Description', value: 'description' },
          { text: 'Record Type', value: 'recordable_type' },
          { text: 'Record', value: 'record' },
          { text: 'Owner', value: 'owner' },
          { text: 'Task', value: 'task' },
          { text: 'Completed', value: 'completed_text' },
          { text: 'Due', value: 'task_due_at' },
          { text: 'Updated', value: 'updated_at' }
        ],
        pagination: {
          sortBy: 'updated_at',
          descending: true
        }
      }
    },
    computed: {
      notes () {
        return this.$store.getters.notes(this.$_slug)
      },
      items () {
        let items = []
        this.notes.forEach(note => {
          let item = { ...note }
          item.type = this.$store.getters.noteTypeByNoteTypeId(item.note_type_id).type
          item.owner = item.user ? item.user.first_name + ' ' + item.user.last_name : ''
          item.record = item.recordable_type === 'User' ? this.getUserFullName(item.recordable_id) : this.getOrganisationName(item.recordable_id)
          item.task_due_at = item.task_due_at ? this.$_getDateTime(item.task_due_at) : ''
          item.updated_at = this.$_getDateTime(item.update_at)
          items.push(item)
        })
        return items
      }
    },
    methods: {
      refreshItems () {
        this.loadData()
      },
      deleteItems (items) {
        items.forEach(item => {
          this.$store.dispatch('deleteNote', { id: item, slug: this.$_slug })
        })
        this.loadData()
      },
      selectItem (item) {
        this.selectedNoteId = item
        this.showNotesEdit = true
      },
      createItem () {
        this.selectedNoteId = null
        this.showNotesEdit = true
      },
      getUserFullName (userId) {
        const user = this.$store.getters.userByUserId(this.$_slug, userId)
        return user ? user.first_name + ' ' + user.last_name : ''
      },
      getOrganisationName (organisationId) {
        const organisation = this.$store.getters.organisationByOrganistionId(this.$_slug, organisationId)
        return organisation ? organisation.name : ''
      },
      loadData () {
        this.loading = true
        Promise.all([
          this.$store.dispatch('loadUsers', this.$_slug),
          this.$store.dispatch('loadOrganisations', this.$_slug),
          this.$store.dispatch('getNotes', this.$_slug)
        ])
        .then(() => {
          this.loading = false
        })
      }
    },
    created () {
      this.loadData()
    }
  }
</script>