<!--
<template>
  <v-dialog width="500px" persistent v-model="inviteApplication">
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
                      v-model="item.application_role_id"
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
    props: ['slug'],
    data () {
      return {
        inviteApplication: false,
        invitations: [
          {
            email: '',
            application_role_id: ''
          },
          {
            email: '',
            application_role_id: ''
          },
          {
            email: '',
            application_role_id: ''
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
        this.inviteApplication = false
        this.$store.dispatch('inviteApplication', {invitations: invitations, slug: this.slug})
      },
      onCancel () {
        this.invitations = [
          {
            email: '',
            application_role_id: ''
          },
          {
            email: '',
            application_role_id: ''
          },
          {
            email: '',
            application_role_id: ''
          }
        ]
        this.inviteApplication = false
      },
      onAddMember () {
        this.invitations.push({
          email: '',
          application_role_id: ''
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
-->

<template>
  <v-dialog v-model="show" persistent max-width="600px">
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
                v-model="item.application_role_id"
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
              <v-btn color="primary" @click.stop="invite">Invite</v-btn>
            </v-flex>
          </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        invitations: [{ email: '', application_role_id: '' }]
      }
    },
    computed: {
      show: {
        get () {
          return this.visible
        },
        set (value) {
          if (!value) {
            this.$emit('close')
          }
        }
      },
      roles () {
        return this.$store.getters.roles
      },
      invitationRoles () {
        return this.roles.filter((role) => {
          return role.name !== 'Super Admin'
        })
      }
    },
    methods: {
      close () {
        this.invitations = [{ email: '', application_role_id: '' }]
        this.show = false
      },
      addUser () {
        this.invitations.push({ email: '', application_role_id: '' })
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
        this.show = false
        this.$store.dispatch('inviteApplication', {invitations: invitations, slug: this.slug})
      }
    },
    props: ['visible', 'slug']
  }
</script>
