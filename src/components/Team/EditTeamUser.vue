<template>
  <v-dialog persistent v-model="editTeamUser" max-width="600px">
    <v-btn icon slot="activator" class="mx-0"><v-icon color="teal">edit</v-icon></v-btn>
    <v-card>

      <!-- //Title -->
      <v-card-title>
        <div class="title mb-2 mt-2">Edit User</div>
      </v-card-title>

      <!-- //Content -->
      <v-card-text>
        <v-layout row>
          <v-flex xs12>
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
      }
    }
  }
</script>
