<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12>
        <v-btn router @click=onCreateForm() class="primary">New Form</v-btn>
        <v-data-table
          :headers="headers"
          :items="forms"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td @click=onLoadForm(props.item.id)>{{ props.item.name }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    
  </v-container>
</template>

<script>
  export default {
    props: ['application_id'],
    data () {
      return {
        headers: [
          { text: 'Name', value: 'name', sortable: false, align: 'left' }
        ]
      }
    },
    computed: {
      forms () {
        return this.$store.getters.loadedForms
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadForm (id) {
        this.$router.push('/applications/' + this.application_id + '/forms/show/' + id)
      },
      onCreateForm () {
        this.$router.push('/applications/' + this.application_id + '/forms/new')
      }
    },
    created: function () {
      this.$store.dispatch('loadForms', this.application_id)
    }
  }
</script>
