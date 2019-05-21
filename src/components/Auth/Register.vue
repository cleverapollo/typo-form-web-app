<template>
  <v-container>
    <v-layout row align-center justify-center v-if="error">
      <v-flex sm12 lg6 xl4>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row align-center justify-center>
      <v-flex sm12 lg6 xl4>
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
            <v-container>
              <v-layout row>
                <v-flex xs12>
                  <div class="headline">Create an account</div>
                </v-flex>
              </v-layout>
              <v-divider class="my-2"></v-divider>

              <form @submit.prevent="onSignup">
                <v-layout row>
                  <v-flex xs12>
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
                  <v-flex xs12>
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
                      :rules="[validation]"
                      ></v-text-field>
                  </v-flex>
                </v-layout>
                 <v-layout row style="display:none !important;">
                  <v-flex xs12>
                    <v-text-field
                      name="otherNameInformed365"
                      id="otherNameInformed365"
                      v-model="otherName"
                      type="text"
                      autocomplete="false"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <PasswordComplexity />

                <v-layout row>
                  <v-flex xs12>
                    <v-btn
                      block
                      class="info"
                      type="submit"
                      :disabled="loading"
                      :loading="loading">
                      Register
                    </v-btn>
                  </v-flex>
                </v-layout>
                
                <v-divider class="my-2"></v-divider>

                <v-layout row>
                  <v-flex xs12 text-xs-center class="mt-2">
                    <span>By creating an account you agree to the </span>
                    <a href="#" @click.stop="terms = true">Terms of Use</a>.
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12 text-xs-center class="mt-2">
                    <span>Already have an account?</span>
                    <router-link :to="{ path: 'login', query: $route.query}">Log In</router-link>
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

    <!-- // Terms of Use -->
    <Terms :visible="terms" @close="terms = false"></Terms>
  </v-container>
</template>

<script>
  import PasswordComplexity from './PasswordComplexity'
  import PasswordMixin from './PasswordMixin.js'
  import * as encodedSearch from '../../util/encodedSearch'
  export default {
    mixins: [PasswordMixin],
    data () {
      const details = encodedSearch.extractRegistrationDetails()
      return {
        submitted: false,
        firstname: details.firstname,
        lastname: details.lastname,
        email: details.email,
        password: '',
        terms: false,
        otherName: '', // Honey Pot
        created_at: null
      }
    },
    components: {
      PasswordComplexity
    },
    computed: {
      slug () {
        return window.location.hostname.split('.')[0]
      },
      user () {
        return this.$store.getters.user
      },
      error () {
        const now = Date.now()
        if (this.submitted && (this.otherName !== '' || now - this.created_at < 1000)) {
          return {
            message: 'There has been an error in registering your account.'
          }
        }
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      },

      supportText () {
        if (this.application && this.application.support_text) {
          return this.application.support_text
        }
        return 'For support, please contact <a href="mailto:support@informed365.com" target="_blank">Informed 365 Help Desk</a>.'
      },
      application () {
        return this.$store.getters.loadedApplication(this.slug)
      },
      applicationImage () {
        try {
          return JSON.parse(this.application.logo).url
        } catch (error) {
          return '/static/logo.png'
        }
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
          this.$store.dispatch('loadTypes')
          this.$store.dispatch('loadCountries')
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
      onSignup () {
        const now = Date.now()
        if (this.otherName !== '' || now - this.created_at < 1000) {
          this.submitted = true
          return
        }
        this.$store.dispatch('signUserUp', {
          first_name: this.firstname,
          last_name: this.lastname,
          email: this.email,
          password: this.password
        })
          .then(response => {
          })
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
      this.otherName = ''
      this.created_at = Date.now()
    }
  }
</script>

<style>
.support-slot {
  background-color:#f2f2f2;
}
img.application-image {
  max-width:250px;
  max-height:75px;
}
</style>
