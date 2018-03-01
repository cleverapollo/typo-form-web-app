<template>
  <v-dialog width="350px" persistent v-model="editTeam">
    <v-btn class="primary" slot="activator">Edit</v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Team</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="title"
                label="Title"
                id="title"
                v-model="editedTitle"
                required></v-text-field>
              <v-text-field
                name="description"
                label="Description"
                id="description"
                multi-line
                v-model="editedDescription"
                required></v-text-field>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn
                flat
                class="secondary"
                @click="editTeam = false"
              >
                Close
              </v-btn>
              <v-btn 
                flat 
                class="primary" 
                @click="onSaveChanges"
                :disabled="loading"
                :loading="loading"
              >
                Save
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['team'],
    data () {
      return {
        id: this.team.id,
        editTeam: false,
        editedTitle: this.team.title,
        editedDescription: this.team.description
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedTitle.trim() === '' || this.editedDescription.trim() === '') {
          return
        }
        this.editTeam = false
        this.$store.dispatch('updateTeam', {
          id: this.id,
          title: this.editedTitle,
          description: this.editedDescription
        })
      }
    },
    computed: {
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>
