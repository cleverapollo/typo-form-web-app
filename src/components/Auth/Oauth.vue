<template>
  <div>
    <v-layout row>
      <v-flex xs12 sm12 md8 offset-md2 lg6 offset-lg3 text-xs-center class="mt-4">
        <span class="grey--text">or</span>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm12 md8 offset-md2 lg6 offset-lg3 text-xs-center>
        <v-btn @click="auth('github')" block>
          <img src='/static/icon/github_icon.png' height="25px" class="mr-2" />
          <span>Use <b> Github Account</b></span>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm12 md8 offset-md2 lg6 offset-lg3 text-xs-center>
        <v-btn @click="auth('facebook')" block>
          <img src='/static/icon/facebook_icon.png' height="25px" class="mr-2" />
          <span>Use <b> Facebook Account</b></span>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm12 md8 offset-md2 lg6 offset-lg3 text-xs-center>
        <v-btn @click="auth('google')" block>
          <img src='/static/icon/google_icon.png' height="25px" class="mr-2" />
          <span>Use <b> Google Account</b></span>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm12 md8 offset-md2 lg6 offset-lg3 text-xs-center>
        <v-btn @click="auth('live')" block>
          <img src='/static/icon/live_icon.png' height="25px" class="mr-2" />
          <span>Use <b> Live Account</b></span>
        </v-btn>
      </v-flex>
    </v-layout>
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
      authSignIn: function (provider, id) {
        this.$store.dispatch('authSignIn', {provider: provider, id: id})
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
              this_.authSignIn(provider, response.data.id + '')
            })
          } else if (provider === 'facebook') {
            this_.$http.get('https://graph.facebook.com/v2.5/me', {
              params: { access_token: this_.$auth.getToken() }
            }).then(function (response) {
              this_.response = response
              this_.authSignIn(provider, response.data.id)
            })
          } else if (provider === 'google') {
            this_.$http.get('https://www.googleapis.com/oauth2/v3/userinfo').then(function (response) {
              this_.response = response
              this_.authSignIn(provider, response.data.sub)
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
            this_.authSignIn(provider, authResponse.user_id)
          }
        }).catch(function (err) {
          this_.response = err
        })
      }
    }
  }
</script>