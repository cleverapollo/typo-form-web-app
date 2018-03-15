<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12>
        {{messageString}}
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['type', 'token'],
    data () {
      return {
        messageString: 'Please Sign in'
      }
    },
    computed: {
      error () {
        return this.$store.getters.error
      },
      user () {
        return this.$store.getters.user
      }
    },
    watch: {
      error (value) {
        if (value) {
          this.messageString = value.message
        }
      },
      user (value) {
        if (this.token.trim() !== '' && value !== null && value !== undefined) {
          this.$store.dispatch('acceptInvitation', {type: this.type, token: this.token})
          this.messageString = 'Thanks for accepting the invitations'
        }
      }
    }
  }
</script>
