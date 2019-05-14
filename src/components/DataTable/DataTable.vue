<template>
  <v-card class="data-table">
    <v-card-title class="header-control" v-if="!anySelected">
      <div class="subheading font-weight-medium mx-2">
        <span>{{title}}</span>
        <span class="grey--text">{{ subtitle }}</span>
      </div>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn class="my-0" flat icon @click.stop="searching = !searching" slot="activator">
          <v-icon>search</v-icon>
        </v-btn>
        <span>Search {{ lowerCaseTitle }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn class="my-0" flat icon @click.stop="download" slot="activator">
          <v-icon>save_alt</v-icon>
        </v-btn>
        <span>Download {{ lowerCaseTitle }}</span>
      </v-tooltip>
      <!--
      <v-tooltip bottom>
        <v-btn class="my-0" flat icon @click.stop="" slot="activator">
          <v-icon>refresh</v-icon>
        </v-btn>
        <span>Refresh {{ lowerCaseTitle }}</span>
      </v-tooltip>
      -->
    </v-card-title>
    <v-card-title v-else class="header-control selected">
      <div class="subheading font-weight-medium mx-2">
        <span class="grey--text text--darken-2">{{ selectedSubtitle }}</span>
      </div>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn class="my-0" flat icon @click.stop="" slot="activator">
          <v-icon>delete</v-icon>
        </v-btn>
        <span>Delete {{ lowerCaseTitle }}</span>
      </v-tooltip>
    </v-card-title>
    <v-divider></v-divider>
    <template v-if="searching">
      <v-card-title>
        <v-layout>
          <v-flex xs12>
            <v-text-field
              class="pa-0 my-0 mx-2"
              v-model="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-divider></v-divider>
    </template>
    <v-data-table
      v-model="selected"
      :headers="visibleHeaders"
      :items="items"
      :loading="loading"
      :rows-per-page-items="[25, 50, 100, { text: 'All', value: -1 }]"
      :search="search"
      :select-all="hasSelectableItems"
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td v-if="hasSelectableItems">
          <v-checkbox
            v-model="props.selected"
            primary
            hide-details
          ></v-checkbox>
        </td>
        <td v-for="header in visibleHeaders" v-bind:key="header.id">
          {{ props.item[header.value] }}
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
/**
 *    TODO
 *    - Add create FAB and event
 *    - Add row click event
 *    - Add checkbox events
 *        - Delete
 *    - Add filter bar
 *    - Add refresh data command
 *    - Change 'showing' title to show 3 of 9 when search or filter
 */
import papa from 'papaparse'
import { saveAs } from 'file-saver'
import CoreMixin from '../../mixins/CoreMixin'
export default {
  props: {
    title: {
      type: String,
      default: 'Items'
    },
    headers: {
      type: Array,
      default: () => [
        { text: 'ID', value: 'id' },
        { text: 'First Name', value: 'first_name', visible: false },
        { text: 'Last Name', value: 'last_name' }
      ]
    },
    items: {
      type: Array,
      default: () => [
        { id: '1', first_name: 'Adam', last_name: 'Ant' },
        { id: '2', first_name: 'Bertie', last_name: 'Beatle' },
        { id: '3', first_name: 'Cathy', last_name: 'Carter' }
      ]
    }
  },
  mixins: [CoreMixin],
  data () {
    return {
      loading: false,
      selected: [],
      search: '',
      searching: false
    }
  },
  computed: {
    subtitle () {
      return '| Showing all ' + this.lowerCaseTitle
    },
    lowerCaseTitle () {
      return this.title.toLowerCase()
    },
    numberSelected () {
      return this.selected.length
    },
    anySelected () {
      return this.numberSelected > 0
    },
    selectedSubtitle () {
      return this.numberSelected + ' ' + this.lowerCaseTitle + ' selected'
    },
    visibleHeaders () {
      return this.headers.filter(header => header.visible !== false)
    },
    hasSelectableItems () {
      return false
    }
  },
  methods: {
    getFileName () {
      return this.title + ' ' + this.$_getDateTime() + '.csv'
    },
    getData () {
      let data = []
      this.items.forEach(item => {
        let row = {}
        this.visibleHeaders.forEach(header => {
          row[header.text] = item[header.value] || ''
        })
        data.push(row)
      })
      return data
    },
    download () {
      const data = this.getData()
      const csv = papa.unparse(data)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      saveAs(blob, this.getFileName())
    }
  }
}
</script>

<style>
  .data-table .v-table thead tr {
    background-color: #f5f5f5;
  }
  .data-table .v-table tbody tr[active],
  .data-table .v-table tbody tr:hover,
  .data-table .header-control.selected {
    background: #e8f0fe !important;
  }
</style>
