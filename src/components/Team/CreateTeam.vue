<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-container>
              <h1 class="mb-4">Create Team</h1>
              <form @submit.prevent="onCreateTeam">
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
                    <v-text-field
                      name="description"
                      label="Description"
                      id="description"
                      v-model="description"
                    ></v-text-field>
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
                          Add
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
                              v-model="item.team_role"
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
                  <v-flex xs12>
                    <v-btn
                      class="primary"
                      :disabled="!formIsValid"
                      type="submit">Create Team</v-btn>
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
    props: ['application_id'],
    data () {
      return {
        name: '',
        description: '',
        invitations: [
          {
            email: '',
            team_role: 'User'
          },
          {
            email: '',
            team_role: 'User'
          },
          {
            email: '',
            team_role: 'User'
          }
        ]
      }
    },
    computed: {
      formIsValid () {
        return this.name !== ''
      }
    },
    methods: {
      onCreateTeam () {
        if (!this.formIsValid) {
          return
        }
        const teamData = {
          applicationid: this.application_id,
          name: this.name,
          description: this.description,
          invitations: this.invitations.filter(function (item) {
            return item.email.trim() !== ''
          })
        }
        this.$store.dispatch('createTeam', teamData)
        this.$router.push('/applications/' + this.application_id + '/teams')
      },
      onAddMember () {
        this.invitations.push({
          email: '',
          team_role: 'User'
        })
      }
    }
  }
</script>
