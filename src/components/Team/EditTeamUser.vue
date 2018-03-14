<template>
  <v-dialog width="350px" persistent v-model="editTeamUser">
    <v-btn class="primary" slot="activator">Edit</v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>
              <h2>Edit User</h2>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="email"
                label="Email"
                id="email"
                v-model="editedEmail"
                type="email"
                disabled></v-text-field>
              <v-select
                :items="['User', 'Admin']"
                v-model="editedRole"
                label="Role"
                single-line
              ></v-select>
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
                @click="onCancel"
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
    props: ['user', 'application_id', 'team_id'],
    data () {
      return {
        id: this.user.id,
        editTeamUser: false,
        editedEmail: this.user.email,
        editedRole: this.user.team_pivot.role
      }
    },
    methods: {
      onSaveChanges () {
        this.editTeamUser = false
        if (this.editedRole.trim() !== this.user.team_pivot.role) {
          this.$store.dispatch('updateTeamUser',
            {
              applicationid: this.application_id,
              teamid: this.team_id,
              id: this.id,
              email: this.editedEmail,
              role: this.editedRole
            })
        }
      },
      onCancel () {
        this.editedEmail = this.user.email
        this.editedRole = this.user.team_pivot.role
        this.editTeamUser = false
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
