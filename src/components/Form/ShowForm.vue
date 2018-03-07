<template>
  <v-container>
    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          indeterminate
          class="primary--text"
          :width="7"
          :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h1 class="primary--text">{{ form.name }}</h1>
            <template v-if="userIsCreator">
              <v-spacer></v-spacer>
              <app-edit-form :form="form" :application_id="application_id"></app-edit-form>
              <v-btn class="error" @click=onDeleteForm>Delete</v-btn>
            </template>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['application_id', 'id'],
    computed: {
      form () {
        return this.$store.getters.loadedForm(parseInt(this.application_id), parseInt(this.id))
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsCreator () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return true
        // return this.$store.getters.user.id === this.form.creatorId
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onDeleteForm () {
        this.$store.dispatch('deleteForm', {
          application_id: parseInt(this.application_id),
          id: this.form.id
        })
        this.$router.push('/applications/' + this.application_id + '/forms')
      }
    }
  }
</script>
