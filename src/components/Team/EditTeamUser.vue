<template>
  <v-dialog persistent v-model="editTeamUser" max-width="600px">
    <v-btn icon slot="activator" class="mx-0"><v-icon color="teal">edit</v-icon></v-btn>
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
                :items="invitationRoles"
                item-text="name"
                item-value="id"
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
    props: ['user', 'slug', 'teamId'],
    data () {
      return {
        id: this.user.id,
        editTeamUser: false,
        editedEmail: this.user.email,
        editedRole: this.user.team_role_id
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedRole !== this.user.team_role_id) {
          this.$store.dispatch('updateTeamUser',
            {
              slug: this.slug,
              teamId: this.teamId,
              id: this.id,
              email: this.editedEmail,
              teamRoleId: this.editedRole
            })
        }
        this.editTeamUser = false
      },
      onCancel () {
        this.editedEmail = this.user.email
        this.editedRole = this.user.team_role_id
        this.editTeamUser = false
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      invitationRoles () {
        return this.roles.filter((role) => {
          return role.name !== 'Super Admin'
        })
      },
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>
