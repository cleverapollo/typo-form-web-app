<template>
  <v-dialog width="500px" persistent v-model="inviteTeam">
    <v-btn class="primary" slot="activator">Invite</v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>
              <h2>Invite members</h2>
              <v-spacer></v-spacer>
              <v-btn dark color="primary"
                @click="onAddMember">
                <v-icon dark>add</v-icon>
                Add
              </v-btn>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row>
          <v-flex xs12>
            <v-container pa-0>
              <template v-for='(item, index) in invitations'>
                <v-layout wrap>
                  <v-flex xs12 sm4 d-flex>
                    <v-text-field
                      label="Email"
                      type="email"
                      v-model="item.email"
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
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm1 offset-sm1 text-xs-center>
                    <v-btn fab dark small color="error"
                      @click="invitations.splice(index, 1)">
                      <v-icon dark>remove</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </template>
            </v-container>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-spacer></v-spacer>
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
                @click="onInvite"
                :disabled="loading"
                :loading="loading"
              >
                Invite
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
    props: ['applicationName', 'teamId'],
    data () {
      return {
        inviteTeam: false,
        invitations: [
          {
            email: '',
            team_role_id: ''
          },
          {
            email: '',
            team_role_id: ''
          },
          {
            email: '',
            team_role_id: ''
          }
        ]
      }
    },
    methods: {
      onInvite () {
        const invitations = this.invitations.filter(function (item) {
          return item.email.trim() !== ''
        })
        if (!invitations.length) {
          return
        }
        this.inviteTeam = false
        this.$store.dispatch('inviteTeam', {invitations: invitations, id: this.teamId, applicationName: this.applicationName})
      },
      onCancel () {
        this.invitations = [
          {
            email: '',
            team_role_id: ''
          },
          {
            email: '',
            team_role_id: ''
          },
          {
            email: '',
            team_role_id: ''
          }
        ]
        this.inviteTeam = false
      },
      onAddMember () {
        this.invitations.push({
          email: '',
          team_role_id: ''
        })
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
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>
