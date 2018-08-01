<template>
  <div>
    <v-layout row>
      <v-flex xs12 sm12 text-xs-center>
        <v-btn @click="auth('google')" depressed block class="btn-oauth btn-google">
          <i class="fab fa-google"></i>
          <span>Login with Google</span>
        </v-btn>
      </v-flex>
    </v-layout>

    <!-- //Disabled Providers -->
    <!--
    <v-layout row>
      <v-flex xs12 sm12 text-xs-center>
        <v-btn @click="auth('live')" block>
          <img src='/static/icon/live_icon.png' height="25px" class="mr-2" />
          <span>Login with Live</span>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm12 text-xs-center>
        <v-btn @click="auth('facebook')" block>
          <img src='/static/icon/facebook_icon.png' height="25px" class="mr-2" />
          <span>Login with Facebook</span>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row>  
      <v-flex xs12 sm12 text-xs-center>
        <v-btn @click="auth('github')" block>
          <img src='/static/icon/github_icon.png' height="25px" class="mr-2" />
          <span>Login with Github</span>
        </v-btn>
      </v-flex>
    </v-layout>
    -->
  </div>
</template>

<script>
  export default {
    name: 'oauth',
    data () {
      return {
        response: null
      }
    },
    methods: {
      authSignIn: function (parameter) {
        this.$store.dispatch('authSignIn', parameter)
      },
      auth: function (provider) {
        if (this.$auth.isAuthenticated()) {
          this.$auth.logout()
        }
        this.response = null

        var this_ = this
        this.$auth.authenticate(provider).then(function (authResponse) {
          if (provider === 'github') {
            this_.$http.get('https://api.github.com/user').then(function (response) {
              this_.response = response
              this_.authSignIn({ provider: provider, id: response.data.id + '' })
            })
          } else if (provider === 'facebook') {
            this_.$http.get('https://graph.facebook.com/v2.5/me', {
              params: { access_token: this_.$auth.getToken() }
            }).then(function (response) {
              this_.response = response
              this_.authSignIn({ provider: provider, id: response.data.id })
            })
          } else if (provider === 'google') {
            this_.$http.get('https://www.googleapis.com/oauth2/v3/userinfo').then(function (response) {
              this_.response = response
              this_.authSignIn({ provider: provider, id: response.data.sub, first_name: response.data.given_name, last_name: response.data.family_name, email: response.data.email })
            })
          } else if (provider === 'twitter') {
            this_.response = authResponse.body.profile
          } else if (provider === 'instagram') {
            this_.response = authResponse
          } else if (provider === 'bitbucket') {
            this_.$http.get('https://api.bitbucket.org/2.0/user').then(function (response) {
              this_.response = response
            })
          } else if (provider === 'linkedin') {
            this_.response = authResponse
          } else if (provider === 'live') {
            this_.response = authResponse
            this_.authSignIn({ provider: provider, id: authResponse.data.user_id })
          }
        }).catch(function (err) {
          this_.response = err
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped>
  .btn-google {
    background-color: #dd4b39 !important;
    color: #ffffff;
  }

  .btn-oauth i {
    font-size: 20px;
    left: 0px;
    position: absolute;
  }
</style>