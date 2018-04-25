<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12 style="position: relative">
        <v-btn
          fixed
          bottom
          right
          dark
          fab
          router
          to="/applications/new"
          class="primary"
          v-if=userIsSuper
        >
          <v-icon>add</v-icon>
        </v-btn>
        <v-data-table
          :headers="headers"
          :items="applications"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td @click=onLoadApplication(props.item.name)>{{ props.item.name }}</td>
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
      roles () {
        return this.$store.getters.roles
      },
      applications () {
        return this.$store.getters.loadedApplications
      },
      loading () {
        return this.$store.getters.loading
      },
      userIsSuper () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined && this.getRole(this.$store.getters.user.role_id) === 'Super Admin'
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onLoadApplication (name) {
        this.$router.push('/' + name)
      }
    },
    created: function () {
      this.$store.dispatch('loadApplications')
    }
  }
</script>
