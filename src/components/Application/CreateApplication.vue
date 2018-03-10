<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-container>
              <h1 class="mb-4">Create Application</h1>
              <form @submit.prevent="onCreateApplication">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="name"
                      label="Name"
                      id="name"
                      v-model="name"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-container pa-0>
                      <v-layout wrap text-xs-center>
                        <h3>Invite Members</h3>
                        <v-spacer></v-spacer>
                        <v-btn dark color="primary"
                          @click="onAddMember">
                          <v-icon dark>add</v-icon>
                          Add Email
                        </v-btn>
                      </v-layout>
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
                              :items="['User', 'Admin']"
                              v-model="item.role"
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
                <v-layout row>
                  <v-flex xs12 text-xs-right>
                    <v-btn
                      class="primary"
                      :disabled="!formIsValid"
                      type="submit">Create Application</v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        name: '',
        invitations: [
          {
            email: '',
            role: 'User'
          },
          {
            email: '',
            role: 'User'
          },
          {
            email: '',
            role: 'User'
          }
        ]
      }
    },
    computed: {
      formIsValid () {
        return this.name !== ''
      },
      userIsSuper () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined && this.$store.getters.user.role === 'Super'
      }
    },
    methods: {
      onCreateApplication () {
        if (!this.formIsValid) {
          return
        }
        const applicationData = {
          name: this.name,
          invitations: this.invitations.filter(function (item) {
            return item.email.trim() !== ''
          })
        }
        this.$store.dispatch('createApplication', applicationData)
        this.$router.push('/applications')
      },
      onAddMember () {
        this.invitations.push({
          email: '',
          role: 'User'
        })
      }
    },
    created: function () {
      if (!this.userIsSuper) {
        this.$router.push('/applications')
      }
    }
  }
</script>
