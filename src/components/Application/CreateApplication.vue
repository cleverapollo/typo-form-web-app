<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-container>
              <h1 class="mb-4">Create Application</h1>
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
                    name="css"
                    label="CSS"
                    id="css"
                    v-model="css"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4>
                  <upload-icon
                    :icon='null'
                    @update-icon="updateIcon">
                  </upload-icon>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-container pa-0>
                    <v-layout wrap text-xs-center>
                      <v-spacer></v-spacer>
                      <v-btn dark color="primary"
                             @click="onAddMember">
                        <v-icon dark>add</v-icon>
                        Add
                      </v-btn>
                    </v-layout>
                    <template v-for='(item, index) in invitations'>
                      <v-layout row wrap>
                        <v-flex xs12 sm4>
                          <v-text-field
                            label="Email"
                            type="email"
                            v-model="item.email"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm4 offset-sm1>
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
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn color="info" @click=onCancel>Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              class="primary"
              :disabled="!formIsValid"
              @click="onCreateApplication">
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import uploadIcon from './IconUpload'

  export default {
    components: {
      uploadIcon
    },
    data () {
      return {
        name: '',
        css: '',
        icon: '',
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
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      invitationRoles () {
        return this.roles.filter((role) => {
          return role.name !== 'Super Admin'
        })
      },
      formIsValid () {
        return this.name !== ''
      },
      userIsSuper () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined && this.getRole(this.$store.getters.user.role_id) === 'Super Admin'
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onCreateApplication () {
        if (!this.formIsValid) {
          return
        }
        const applicationData = {
          name: this.name,
          css: this.css,
          icon: this.icon,
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
          application_role_id: ''
        })
      },
      updateIcon (icon) {
        console.log(icon)
        this.icon = icon
      },
      onCancel () {
        this.$router.push('/applications')
      }
    },
    created: function () {
      if (!this.userIsSuper) {
        this.$router.push('/applications')
      }
    }
  }
</script>

<style scope="">
  .dz-preview.dz-processing{
    z-index: 1;
  }
</style>