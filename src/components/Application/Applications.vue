<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12>
        <v-btn router to="/applications/new" class="primary" flat v-if=userIsSuper>New Application</v-btn>
        <v-data-table
          :headers="headers"
          :items="applications"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td @click=onLoadApplication(props.item.id)>{{ props.item.name }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        headers: [
          { text: 'Name', value: 'name', sortable: false, align: 'left' }
        ]
      }
    },
    computed: {
      applications () {
        return this.$store.getters.loadedApplications
      },
      loading () {
        return this.$store.getters.loading
      },
      userIsSuper () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined && this.$store.getters.user.role === 'SuperAdmin'
      }
    },
    methods: {
      onLoadApplication (id) {
        this.$router.push('/applications/show/' + id)
      }
    },
    created: function () {
      this.$store.dispatch('loadApplications')
    }
  }
</script>
