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
              <form v-show="isEmail" @submit.prevent="onSignup">
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
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="confirmPassword"
                      label="Confirm Password"
                      id="confirmPassword"
                      v-model="confirmPassword"
                      type="password"
                      :rules="[comparePasswords]"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn
                      block
                      class="success"
                      type="submit"
                      :disabled="loading"
                      :loading="loading">
                      Sign up
                       <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                       </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row>
                  <v-flex xs12 text-xs-center class="mt-4">
                    <span>Already have an account?</span>
                    <router-link to="/signin" tag="a">Sign in</router-link>
                  </v-flex>
                </v-layout>
              </form>
              <v-btn v-show="!isEmail" block color="normal" @click="activeEmail" class="success">Signup with your email</v-btn>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3 text-xs-center class="mt-4">
                  <span class="grey--text">or</span>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3 text-xs-center>
                  <v-btn @click="auth('github')" block>
                    <img src='/static/icon/github_icon.png' height="25px" class="mr-2" />
                    <span>Use <b> Github Account</b></span>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3 text-xs-center>
                  <v-btn @click="auth('facebook')" block>
                    <img src='/static/icon/facebook_icon.png' height="25px" class="mr-2" />
                    <span>Use <b> Facebook Account</b></span>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3 text-xs-center>
                  <v-btn @click="auth('google')" block>
                    <img src='/static/icon/google_icon.png' height="25px" class="mr-2" />
                    <span>Use <b> Google Account</b></span>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3 text-xs-center>
                  <v-btn @click="auth('live')" block>
                    <img src='/static/icon/live_icon.png' height="25px" class="mr-2" />
                    <span>Use <b> Live Account</b></span>
                  </v-btn>
                </v-flex>
              </v-layout>
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
        isEmail: false,
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    },
    computed: {
      comparePasswords () {
        return this.password !== this.confirmPassword ? 'Passwords do not match' : ''
      },
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
          this.$router.push('/')
        }
      },
      onSignup () {
        this.$store.dispatch('signUserUp', {first_name: this.firstname, last_name: this.lastname, email: this.email, password: this.password})
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      },
      activeEmail () {
        this.isEmail = true
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

