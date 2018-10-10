<template>

  <v-container fill-height>

    <!-- // Login -->
    <Login v-if="!this.user" />
    <v-layout row wrap align-center v-else>

      <!-- // Welcome Message -->
      <v-flex xs12 class="text-xs-center white--text">
        <div class="flex display-3 font-weight-light my-3 welcome-message">{{ welcomeMessage() }}.</div>
        <v-btn
          @click="showApplication"
          large
          color="success"
          >Let's get started
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
  import Login from './Auth/Login'
  import parseDomain from 'parse-domain'
  export default {
    computed: {
      user () {
        return this.$store.getters.user
      },
      application () {
        let domain = parseDomain(window.location.hostname, { customTlds: ['local'] })
        return domain && domain.subdomain ? this.$store.getters.loadedApplication(domain.subdomain) : null
      }
    },
    methods: {
      showApplication () {
        this.$router.push(this.application ? '/submissions/' : '/applications')
      },
      welcomeMessage () {
        var today = new Date()
        var curHr = today.getHours()

        if (curHr < 12) {
          return 'Good morning ' + this.user.first_name
        } else if (curHr < 18) {
          return 'Good afternoon ' + this.user.first_name
        } else {
          return 'Good evening ' + this.user.first_name
        }
      }
    },
    components: {
      Login
    }
  }
</script>

<style>
</style>
