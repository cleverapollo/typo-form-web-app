<template>
  <v-dialog v-model="inviteTeam" persistent max-width="600px">
    <v-btn slot="activator" fixed dark bottom right fab router class="error">
      <v-icon>add</v-icon>
    </v-btn>
    <v-card>
      <v-card-title>
        <div class="title mb-2 mt-2">Invite Users</div>
      </v-card-title>
      <v-card-text>

        <!-- //Invitation -->
        <template v-for="(item, index) in invitations">
          <v-layout wrap>
            <v-flex xs12 sm6 d-flex>
              <v-text-field
                label="Email"
                type="email"
                v-model="item.email"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 offset-sm1 d-flex>
              <v-select
                :items="invitationRoles"
                item-text="name"
                item-value="id"
                v-model="item.team_role_id"
                label="Role"
                single-line
                required
              ></v-select>
            </v-flex>
            <v-flex xs12 sm1 text-xs-center text-sm-right>
              <v-btn flat icon @click="removeUser" class="mt-3">
                <v-icon>close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </template>

        <!-- //Add Row -->
        <v-layout row>
          <v-flex xs12 class="text-xs-left">
            <v-btn flat @click.stop="addUser">Add another user</v-btn>
          </v-flex>
        </v-layout>

      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click.stop="close">Cancel</v-btn>
            <v-btn color="primary" @click.stop="invite" :disabled="loading" :loading="loading">
              Invite
              <span slot="loader" class="custom-loader">
                <v-icon light>cached</v-icon>
              </span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['slug', 'teamId'],
    data () {
      return {
        inviteTeam: false,
        invitations: [{ email: '', team_role_id: '' }]
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
    },
    methods: {
      close () {
        this.invitations = [{ email: '', team_role_id: '' }]
        this.inviteTeam = false
      },
      addUser () {
        this.invitations.push({ email: '', team_role_id: '' })
      },
      removeUser (index) {
        this.invitations.splice(index, 1)
      },
      invite () {
        const invitations = this.invitations.filter(function (item) {
          return item.email.trim() !== ''
        })
        if (!invitations.length) {
          return
        }
        this.inviteTeam = false
        this.$store.dispatch('inviteTeam', {invitations: invitations, id: this.teamId, slug: this.slug})
      }
    }
  }
</script>
