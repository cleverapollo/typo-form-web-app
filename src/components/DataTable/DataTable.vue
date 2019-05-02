<template>
  <v-card>
    <v-card-title>
      <template>
        <div class="subheading font-weight-medium mx-2">
          <span>{{title}}</span>
          <span class="grey--text">{{subtitle}}</span>
        </div>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn class="my-0" flat icon @click.stop="" slot="activator">
            <v-icon>save_alt</v-icon>
          </v-btn>
          <span>Download {{ toLowerCase(title) }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn class="my-0" flat icon @click.stop="" slot="activator">
            <v-icon>refresh</v-icon>
          </v-btn>
          <span>Refresh {{ toLowerCase(title) }}</span>
        </v-tooltip>
      </template>
    </v-card-title>
    <v-divider></v-divider>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      :loading="loading"
      :rows-per-page-items="[25, 50, 100, { text: 'All', value: -1 }]"
      select-all
      item-key="id"
      class="data-table elevation-1"
    >
      <template v-slot:items="props">
        <td>
          <v-checkbox
            v-model="props.selected"
            primary
            hide-details
          ></v-checkbox>
        </td>
        <td v-for="header in headers">
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
 *    - Add data export command
 */
export default {
  props: {
    title: {
      type: String,
      default: 'Data'
    },
    headers: {
      type: Array,
      default: () => [
        { text: 'ID', value: 'id' },
        { text: 'First Name', value: 'first_name' },
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
  data () {
    return {
      loading: false,
      selected: []
    }
  },
  computed: {
    subtitle () {
      return '| Showing all ' + this.title.toLowerCase()
    }
  },
  methods: {
    toggleSelected () {},
    toLowerCase (text) {
      return text.toLowerCase()
    }
  }
}
</script>

<style>
  .data-table .v-table thead tr {
    background-color: #f5f5f5;
  }
</style>
