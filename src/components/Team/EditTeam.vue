<template>
  <v-dialog width="600px" persistent v-model="editTeam">
    <div slot="activator">Edit Team</div>
    <v-card>

      <!-- //Title -->
      <v-card-title>
        <div class="title mb-2 mt-2">Edit Team</div>
      </v-card-title>

      <!-- //Content -->
      <v-card-text>
        <v-layout row>
          <v-flex xs12>
            <v-text-field
              name="name"
              label="Name"
              id="name"
              v-model="editedName"
              required></v-text-field>
            <v-text-field
              name="description"
              label="Description"
              id="description"
              v-model="editedDescription">
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>

      <!-- //Actions -->
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click="onCancel">Cancel</v-btn>
            <v-btn flat class="primary" @click="onSaveChanges">Save</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['team', 'slug'],
    data () {
      return {
        id: this.team.id,
        editTeam: false,
        editedName: this.team.name,
        editedDescription: this.team.description
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedName.trim() === '') {
          return
        }
        this.editTeam = false
        this.$store.dispatch('updateTeam',
          {
            slug: this.slug,
            id: this.id,
            name: this.editedName,
            description: this.editedDescription
          })
      },
      onCancel () {
        this.editedName = this.team.name
        this.editedDescription = this.team.description
        this.editTeam = false
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
