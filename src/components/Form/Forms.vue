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
          @click=onCreateForm()
          v-if="!userIsNotAdmin()"
          class="primary"
        >
          <v-icon>add</v-icon>
        </v-btn>
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
          {text: 'Name', value: 'name', sortable: false, align: 'left'}
        ]
      }
    },
    computed: {
      forms () {
        return this.$store.getters.loadedForms(parseInt(this.application_id))
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
      },
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.application_id))
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsNotAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return true
        }

        return this.application.role !== 'Admin' && this.application.role !== 'Super Admin'
      }
    },
    created: function () {
      this.$store.dispatch('loadForms', this.application_id)
    }
  }
</script>
