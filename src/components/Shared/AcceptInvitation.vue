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
    props: ['token'],
    data () {
      return {
        messageString: 'Thank you for accepting the invitation'
      }
    },
    computed: {
      error () {
        return this.$store.getters.error
      }
    },
    watch: {
      error (value) {
        if (value) {
          this.messageString = 'Sorry but the invitation is not correct'
        }
      }
    },
    created: function () {
      if (this.token.trim() !== '') {
        this.$store.dispatch('acceptInvitation', {token: this.token})
      }
    }
  }
</script>
