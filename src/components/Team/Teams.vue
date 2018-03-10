<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12>
        <v-btn router @click=onCreateTeam() class="primary">New Team</v-btn>
        <v-data-table
          :headers="headers"
          :items="teams"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td @click=onLoadTeam(props.item.id)>{{ props.item.name }}</td>
            <td @click=onLoadTeam(props.item.id)>{{ props.item.description }}</td>
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
          { text: 'Name', value: 'name', sortable: false, align: 'left' },
          { text: 'Description', value: 'description', sortable: false, align: 'left' }
        ]
      }
    },
    computed: {
      teams () {
        return this.$store.getters.loadedTeams
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadTeam (id) {
        this.$router.push('/applications/' + this.application_id + '/teams/show/' + id)
      },
      onCreateTeam () {
        this.$router.push('/applications/' + this.application_id + '/teams/new')
      }
    },
    created: function () {
      this.$store.dispatch('loadTeams', this.application_id)
    }
  }
</script>
