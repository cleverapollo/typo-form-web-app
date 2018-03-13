<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12 sm6 md4 d-flex>
        <v-card>
          <v-card-text>
            <v-container>
              <v-layout row>
                <v-flex text-xs-center>
                  <v-avatar
                    size="80px"
                    class="primary">
                    <v-icon
                      :color="'white'"
                      large>
                      account_circle
                    </v-icon>
                  </v-avatar>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex text-xs-center>
                  <v-btn flat small color="primary">Change picture</v-btn>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex text-xs-center class="overflow-flex">
                  <v-btn large block>Delete Picture</v-btn>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex text-xs-center class="overflow-flex">
                  <template v-if="userIsAuthenticated">
                    <app-edit-email></app-edit-email>
                  </template>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex text-xs-center class="overflow-flex">
                  <template v-if="userIsAuthenticated">
                    <app-edit-password></app-edit-password>
                  </template>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex text-xs-center class="overflow-flex">
                  <v-btn block large
                    color="error"
                    @click="onDestroyUser"
                  >
                    Deactive Account
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md8 d-flex>
        <v-card>
          <v-card-text>
            <v-container>
              <h1 class="mb-4">Edit account</h1>
              <form @submit.prevent="onUpdateUser">
                <v-layout row>
                  <v-flex class="overflow-flex">
                    <v-text-field
                      name="firstname"
                      label="Firstname"
                      id="firstname"
                      v-model="firstname"
                      type="text"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex class="overflow-flex">
                    <v-text-field
                      name="lastname"
                      label="Lastname"
                      id="lastname"
                      v-model="lastname"
                      type="text"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex class="overflow-flex">
                    <v-text-field
                      name="email"
                      label="Email"
                      id="email"
                      v-model="email"
                      type="email"
                      disabled></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex text-xs-right>
                    <v-btn type="submit" :disabled="loading" :loading="loading" class="primary">
                      Save
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
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
        firstname: '',
        lastname: '',
        email: '',
        editProfile: false
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      },
      userIsAuthenticated () {
        return this.user !== null && this.user !== undefined
      }
    },
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          this.firstname = value.first_name
          this.lastname = value.last_name
          this.email = value.email
        }
      }
    },
    methods: {
      onUpdateUser () {
        if (this.firstname.trim() === '' ||
          this.lastname.trim() === '' ||
          this.email.trim() === '') {
          return
        }
        this.editProfile = true
        this.$store.dispatch('updateAuth', {first_name: this.firstname, last_name: this.lastname})
      },
      onDestroyUser () {
        this.$store.dispatch('destroyUser')
        this.$router.push('/signin')
      }
    },
    created: function () {
      const user = this.user
      if (user !== null && user !== undefined) {
        this.firstname = user.first_name
        this.lastname = user.last_name
        this.email = user.email
      }
    }
  }
</script>

<style scoped>
.overflow-flex {
  min-width: 0;
}
</style>