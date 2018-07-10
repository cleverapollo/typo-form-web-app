<template>
  <v-dialog width="600px" persistent v-model="editEmail" full-width>
    <v-btn large block slot="activator" :disabled="disabled">Change Email</v-btn>
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
              <h2>Change Email</h2>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="email"
                label="Email"
                id="editemail"
                v-model="email"
                type="email"
                required></v-text-field>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
              <v-btn
                flat
                @click="editEmail = false"
              >
                Close
              </v-btn>
              <v-btn
                color="primary"
                @click="onSaveEmail"
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
    props: ['disabled'],
    data () {
      return {
        email: '',
        editEmail: false
      }
    },
    methods: {
      onSaveEmail () {
        if (this.email.trim() === '') {
          return
        }
        this.$store.dispatch('updateEmail', { email: this.email })
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      }
    },
    watch: {
      loading (value) {
        if (!value && !this.error && this.editEmail) {
          this.editEmail = false
        }
      },
      editEmail (value) {
        if (!value) {
          this.email = ''
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