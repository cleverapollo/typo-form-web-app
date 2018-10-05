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

              <v-layout row>
                <v-flex xs12>
                  <div class="headline">Create an account</div>
                </v-flex>
              </v-layout>
              <v-divider class="my-2"></v-divider>

              <!-- //OAuth -->
              <oauth></oauth>

              <!-- //Email -->
              <v-divider class="my-2"></v-divider>
              <v-layout row class="mt-4">
                <v-flex xs12 text-xs-center>
                  <div class="caption">or register with email</div>
                </v-flex>
              </v-layout>
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
                <PasswordComplexity />
                
                <v-layout row>
                  <v-flex xs12 class="my-2">
                    <vue-recaptcha
                      ref="recaptcha"
                      @verify="onCaptchaVerified"
                      @expired="onCaptchaExpired"
                      :sitekey="data_sitekey">
                    </vue-recaptcha>
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
                      Register
                       <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                       </span>
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
        </v-card>
      </v-flex>
    </v-layout>

    <!-- // Terms of Use -->
    <Terms :visible="terms" @close="terms = false"></Terms>
  </v-container>
</template>

<script>
  import PasswordComplexity from './PasswordComplexity'
  import Oauth from './Oauth'
  import PasswordMixin from './PasswordMixin.js'
  import VueRecaptcha from 'vue-recaptcha'
  export default {
    mixins: [PasswordMixin],
    data () {
      return {
        submitted: false,
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        recaptchaToken: '',
        data_sitekey: process.env.GOOGLE_DATA_SITEKEY,
        terms: false
      }
    },
    components: {
      PasswordComplexity,
      Oauth,
      VueRecaptcha
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      error () {
        if (this.submitted && this.recaptchaToken === '') {
          return
        }
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
        if (this.recaptchaToken === '') {
          this.submitted = true
          // return
        }
        this.$store.dispatch('signUserUp', {
          first_name: this.firstname,
          last_name: this.lastname,
          email: this.email,
          password: this.password,
          recaptchaToken: this.recaptchaToken
        })
          .then(response => {
          })
          .catch(() => {
            this.$refs.recaptcha.reset()
            this.submitted = false
            this.recaptchaToken = ''
          })
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      },
      onCaptchaVerified (recaptchaToken) {
        this.recaptchaToken = recaptchaToken
      },
      onCaptchaExpired () {
        this.recaptchaToken = ''
      }
    },
    created: function () {
      this.onDismissed()
      this.onValidate(this.user)
    }
  }
</script>
