<template>
  <v-dialog width="600px" persistent v-model="editPassword" full-width>
    <v-btn large block slot="activator">Change Password</v-btn>
    <v-card>
      <v-container>
        <v-layout row v-if="error">
          <v-flex xs12 sm12>
            <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>
              <h2>Change Password</h2>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="password"
                label="Password"
                id="password"
                v-model="password"
                type="password"
                required>
              </v-text-field>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn
              flat
              @click="editPassword = false"
            >
              Close
            </v-btn>
            <v-btn
              class="primary"
              @click="onSavePassword"
              :disabled="loading"
              :loading="loading"
            >
              Save
              <span slot="loader" class="custom-loader">
                <v-icon light>cached</v-icon>
              </span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        password: '',
        editPassword: false
      }
    },
    methods: {
      onSavePassword () {
        if (this.password === '') {
          return
        }
        this.$store.dispatch('updatePassword', { password: this.password })
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      }
    },
    watch: {
      loading (value) {
        if (!value && !this.error && this.editPassword) {
          this.editPassword = false
        }
      },
      editPassword (value) {
        if (!value) {
          this.password = ''
        } else {
          this.$store.dispatch('clearError')
        }
      }
    },
    computed: {
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>