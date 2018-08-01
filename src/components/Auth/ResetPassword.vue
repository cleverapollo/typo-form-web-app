<template>
  <v-container>
    <v-layout row v-if="message">
      <v-flex sm12 md8 offset-md2 xl4 offset-xl4>
        <app-alert @dismissed="onDismissed" :text="message" type="success"></app-alert>
      </v-flex>
    </v-layout>
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
                  <div class="headline">Reset my password</div>
                </v-flex>
              </v-layout>
              <v-divider class="my-2"></v-divider>

              <form @submit.prevent="onResetPassword">
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
                    <v-btn
                      block
                      color="info"
                      type="submit"
                      :disabled="loading"
                      :loading="loading">
                      Reset my password
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
  export default {
    data () {
      return {
        email: '',
        message: ''
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      loading () {
        return this.$store.getters.loading
      },
      error () {
        return this.$store.getters.error
      }
    },
    methods: {
      onValidate (value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/')
        }
      },
      onResetPassword () {
        this.message = ''
        this.$store.dispatch('resetPassword', {email: this.email})
          .then(response => {
            this.message = response.data.user
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
