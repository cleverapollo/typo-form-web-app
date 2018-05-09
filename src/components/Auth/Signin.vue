<template>
  <v-container>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignin">
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
                  <v-flex xs12 text-xs-center class="pt-4">
                    <router-link to="/reset-password" tag="a" class="green--text">Forgot your password?</router-link>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
            <v-container class="oauth-container">
              <div class="oauth-login py-4">
                <v-btn block color="normal" @click="authenticate('google')" normal>Use Google Account</v-btn>
                <v-btn block color="normal" @click="authenticate('facebook')" normal>Use FaceBook Account</v-btn>
                <v-btn block color="normal" @click="authenticate('live')" normal>Use Live Account</v-btn>
                <v-btn block color="normal" @click="authenticate('github')" normal>Use Github Account</v-btn>
              </div>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 text-xs-center class="mt-4">
        <span class="grey--text">Don't have an account?</span>
        <router-link to="/signup" tag="a" class="green--text">Sign up</router-link>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Vue from 'vue'
  import VueAxios from 'vue-axios'
  import VueAuthenticate from 'vue-authenticate'
  import axios from 'axios'

  Vue.use(VueAxios, axios)
  Vue.use(VueAuthenticate, {
    baseUrl: 'http://localhost:8000', // Your API domain

    providers: {
      google: {
        clientId: '5570114347-1q8r9fkardh7oko0a2d7qqee95a8ve6i.apps.googleusercontent.com/',
        redirectUrl: 'http://localhost:8080/auth/callback' // Your client app URL
      },
      facebook: {
        clientId: 'cfb878be79c0a7b7616a',
        redirectUrl: 'http://localhost:8080/auth/callback' // Your client app URL
      },
      live: {
        clientId: '79ff1315-2451-4f3b-ab27-0611a3126568',
        redirectUrl: 'http://localhost:8080/auth/callback'// Your client app URL
      },
      github: {
        url: '/socialite/github/callback',
        clientId: 'cfb878be79c0a7b7616a',
        redirectUri: 'http://localhost:8080/socialite/github/callback'
//        redirectUri: 'http://localhost:8080/socialite/github/callback' // Your client app URL
      }
    },
    bindRequestInterceptor: function () {
      this.$http.interceptors.request.use((config) => {
        if (this.isAuthenticated()) {
          config.headers['Authorization'] = [
            this.options.tokenType, this.getToken()
          ].join(' ')
        } else {
          delete config.headers['Authorization']
        }
        return config
      })
    },

    bindResponseInterceptor: function () {
      this.$http.interceptors.response.use((response) => {
        this.setToken(response)
        return response
      })
    }
  })

  export default {
    data () {
      return {
        email: '',
        password: ''
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
      },
      authenticate: function (provider) {
        alert(window.location.origin)
        this.$auth.authenticate(provider).then(function () {
          alert(1)
        })
      }
    },
    created: function () {
      this.onDismissed()
      this.onValidate(this.user)
    }
  }
</script>

<style scoped>
  .oauth-container {
    position: relative;
  }

  .oauth-login {
    border-top: 2px dashed #efefef;
  }

  .oauth-login::after {
    display: block;
    content: "or";
    position: absolute;
    top: 7px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    padding: 0 10px;
    background-color: #fff;
    color: #b6b3b3;
  }
</style>
