<template>
  <v-container>
    <v-layout row v-if="message">
      <v-flex xs12 md6 offset-md3>
        <app-alert @dismissed="onDismissed" :text="message" type="success"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row v-if="error">
      <v-flex xs12 md6 offset-md3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 md6 offset-md3>
        <v-card>
          <v-card-text>
            <v-container>

              <v-layout row>
                <v-flex xs12>
                  <div class="headline">Reset my password</div>
                </v-flex>
              </v-layout>
              <v-divider class="my-2"></v-divider>

              <v-layout row>
                <v-flex xs12>
                  <p>Enter your email address and new password.</p>
                </v-flex>
              </v-layout>

              <form @submit.prevent="onCreatePassword">
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
                      :rules="[validation]"></v-text-field>
                  </v-flex>
                </v-layout>
                <PasswordComplexity />
                <v-layout row>
                  <v-flex xs12>
                    <v-btn
                      block
                      color="info"
                      type="submit"
                      :disabled="loading"
                      :loading="loading">
                      Create New Password
                       <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                       </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>

              <v-divider class="my-2"></v-divider>

              <v-layout row>
                <v-flex xs12 text-xs-left class="mt-4">
                  <span>Im ready to </span>
                  <router-link :to="{ path: '/login', query: $route.query}">Log In</router-link>
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
  import PasswordComplexity from './PasswordComplexity'
  import PasswordMixin from './PasswordMixin.js'
  export default {
    mixins: [PasswordMixin],
    components: {
      PasswordComplexity
    },
    props: ['token'],
    data () {
      return {
        email: '',
        password: '',
        message: ''
      }
    },
    computed: {
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onCreatePassword () {
        this.$store.dispatch('resetPassword', {email: this.email, token: this.token, password: this.password})
          .then(response => {
            this.message = response.data.message
            let router = this.$router
            setTimeout(function () { router.push('/login') }, 2000)
          })
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      }
    },
    created: function () {
      this.onDismissed()
    }
  }
</script>
