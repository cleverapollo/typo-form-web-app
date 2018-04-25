<template>
  <v-container>
    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          indeterminate
          class="primary--text"
          :width="7"
          :size="70"
        ></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mb-2" v-else>
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
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      error (value) {
        if (value) {
          this.messageString = value.message
        }
      }
    },
    created: function () {
      if (this.token.trim() !== '' && this.user !== null && this.user !== undefined) {
        this.$store.dispatch('acceptJoin', {type: this.type, token: this.token})
        this.messageString = 'Thanks to join the ' + this.type
      }
    }
  }
</script>
