<template>
  <v-container>

    <!-- // Error Message -->
    <v-layout row v-if="error">
      <v-flex xs12 md6 offset-md3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>

    <!-- //Login Form -->
    <v-layout row>
      <v-flex xs12 md6 offset-md3>
        <v-card>

          <!-- // Application Image -->
          <v-card-text class="application-image-slot pb-1" v-if="applicationImage">
            <v-container pb-1>
              <v-layout row wrap>
                <v-flex xs12 text-xs-center>
                  <img class="application-image" v-bind:src="applicationImage" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-text class="pt-1">
            <v-container pt-1>
              <form @submit.prevent="onSignin">
                <v-layout row>
                  <v-flex xs12>
                    <div class="headline">Log in</div>
                  </v-flex>
                </v-layout>
                <v-divider class="my-2"></v-divider>

                <!-- //OAuth -->
                <oauth></oauth>

                <!-- //Email -->
                <v-divider class="my-2"></v-divider>
                <v-layout row class="mt-4">
                  <v-flex xs12 text-xs-center>
                    <div class="caption">or login with email</div>
                  </v-flex>
                </v-layout>
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
                      type="password">
                    </v-text-field>
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
                      Log In
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                       </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-divider class="my-2"></v-divider>

                <v-layout row wrap>
                  <v-flex xs12 sm6 text-xs-center text-sm-left class="mt-2">
                    <span>Don't have an account?</span>
                    <router-link :to="{ path: 'register', query: $route.query}">Register</router-link>
                  </v-flex>
                  <v-flex xs12 sm6 text-xs-center text-sm-right class="mt-2">
                    <router-link to="/password/reset" tag="a">Forgot your password?</router-link>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>

          <!-- // Support Text -->
          <v-card-text class="support-slot" v-if="supportText">
            <v-container>
              <v-layout row wrap text-xs-center>
                <v-flex xs12><span v-html="supportText" /></v-flex>
              </v-layout>
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
        submitted: false,
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
      },
      supportText () {
        return 'For support, please contact <a href="mailto:support@informed365.com" target="_blank">Informed 365 Help Desk</a>.'
      },
      applicationImage () {
        return '/static/logo.png'
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
          this.$store.dispatch('loadAnswerSorts')
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
          .then(response => {})
          .catch(() => {
            this.submitted = false
          })
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

<style>
.support-slot {
  background-color:#f2f2f2;
}
img.application-image {
  max-width:50%;
}
</style>
