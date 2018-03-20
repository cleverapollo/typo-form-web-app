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
        <v-card v-if="form">
          <v-card-title>
            <h1 class="primary--text">{{ form.name }}</h1>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-layout wrap>
                <v-flex xs12>
                  <sections :sections='sections'></sections>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions v-if="userIsAdmin">
            <v-spacer></v-spacer>
            <app-edit-form :form="form" :application_id="application_id"></app-edit-form>
            <v-btn class="error" @click=onDeleteForm>Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import sections from '../Section/Sections.vue'
  export default {
    props: ['application_id', 'id'],
    components: {
      sections
    },
    data () {
      return {
        sections: [
          {
            id: 1,
            name: 'Section1',
            description: 'Section 1 Description',
            order: 1,
            questions: [
              {
                id: 1,
                name: 'Question 1',
                order: 1
              },
              {
                id: 2,
                name: 'Question 2',
                order: 2
              }
            ]
          },
          {
            id: 2,
            name: 'Section2',
            description: 'Section 2 Description',
            order: 2,
            questions: [
              {
                id: 3,
                name: 'Question 3',
                order: 3
              },
              {
                id: 4,
                name: 'Question 4',
                order: 4
              }
            ]
          }
        ]
      }
    },
    computed: {
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.application_id))
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.application.pivot.role === 'Admin' || this.application.pivot.role === 'SuperAdmin'
      },
      form () {
        // return this.$store.getters.loadedForm(parseInt(this.id))
        let loadedForm = this.$store.getters.loadedForm(parseInt(this.id))
        if (loadedForm) {
          // loadedForm.pivot.role = 'Admin'
        }
        return loadedForm
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onDeleteForm () {
        this.$store.dispatch('deleteForm', {
          applicationid: this.application_id,
          id: this.form.id
        })
        this.$router.push('/applications/' + this.application_id + '/forms')
      }
    },
    created: function () {
      this.$store.dispatch('loadApplications')
      this.$store.dispatch('loadForms', this.application_id)
    }
  }
</script>
