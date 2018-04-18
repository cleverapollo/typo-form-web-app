<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12 style="position: relative">
        <v-btn
          absolute
          bottom
          right
          dark
          fab
          router
          @click=onCreateTeam()
          class="primary"
        >
          <v-icon>add</v-icon>
        </v-btn>
        <v-btn
          color="info"
          @click=onBack>
          Back
        </v-btn>
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
    props: ['applicationName'],
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
        return this.$store.getters.loadedTeams(this.applicationName)
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadTeam (id) {
        this.$router.push('/' + this.applicationName + '/teams/show/' + id)
      },
      onCreateTeam () {
        this.$router.push('/' + this.applicationName + '/teams/new')
      },
      onBack () {
        this.$router.push('/' + this.applicationName)
      }
    },
    created: function () {
      this.$store.dispatch('loadTeams', this.applicationName)
    }
  }
</script>
