<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12>
        <v-btn router @click=onCreateUser() class="primary">New User</v-btn>
        <v-data-table
          :headers="headers"
          :items="users"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td @click=onLoadUser(props.item.id)>{{ props.item.name }}</td>
            <td @click=onLoadUser(props.item.id)>{{ props.item.description }}</td>
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
      users () {
        return this.$store.getters.loadedUsers
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadUser (id) {
        this.$router.push('/applications/' + this.application_id + '/users/show/' + id)
      },
      onCreateUser () {
        this.$router.push('/applications/' + this.application_id + '/users/new')
      }
    },
    created: function () {
      this.$store.dispatch('loadUsers', this.application_id)
    }
  }
</script>
