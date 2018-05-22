<template>
  <v-container>
    <v-layout row v-if="error">
      <v-flex sm12 md8 offset-md2 xl4 offset-xl4>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex sm12 md8 offset-md2 xl4 offset-xl4>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignin">
                <oauth></oauth>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="email"
                      label="Email"
                      id="email"
                      v-model="email"
                      type="email"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="password"
                      label="Password"
                      id="password"
                      v-model="password"
                      type="password"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn
                      block
                      class="info"
                      type="submit"
                      :disabled="loading"
                      :loading="loading">
                      Sign in
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                       </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12 text-xs-center class="mt-4">
                    <router-link to="/password/reset" tag="a">Forgot your password?</router-link>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12 text-xs-center class="mt-4">
                    <span>Don't have an account?</span>
                    <router-link to="/signup" tag="a">Sign up</router-link>
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
  import Oauth from './Oauth'
  export default {
    data () {
      return {
        email: '',
        password: ''
      }
    },
    components: {
      Oauth
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
      }
    },
    watch: {
      user (value) {
        this.onValidate(value)
      }
    },
    methods: {
      onValidate (value) {
        if (value !== null && value !== undefined) {
          this.$store.dispatch('loadQuestionTypes')
          this.$store.dispatch('loadValidationTypes')
          this.$store.dispatch('loadPeriods')
          this.$store.dispatch('loadStatuses')
          this.$store.dispatch('loadRoles')
          this.$store.dispatch('loadComparators')
          this.$store.dispatch('loadTriggerTypes')
          this.$store.dispatch('loadApplications')
          if (this.$route.query.redirect) {
            this.$router.push(this.$route.query.redirect)
          } else {
            this.$router.push('/')
          }
        }
      },
      onSignin () {
        this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      }
    },
    created: function () {
      this.onDismissed()
      this.onValidate(this.user)
    }
  }
</script>
