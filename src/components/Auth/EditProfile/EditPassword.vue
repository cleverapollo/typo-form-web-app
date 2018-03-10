<template>
  <v-dialog width="350px" persistent v-model="editPassword" full-width>
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
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="oldpassword"
                label="Old Password"
                id="oldpassword"
                v-model="oldpassword"
                type="password"
                required></v-text-field>
              <v-text-field
                name="newpassword"
                label="New Password"
                id="newpassword"
                v-model="newpassword"
                type="password"
                required></v-text-field>
              <v-text-field
                name="newconfirmpassword"
                label="Confirm Password"
                id="newconfirmpassword"
                v-model="newconfirmpassword"
                type="password"
                :rules="[comparePasswords]"
                required></v-text-field>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn
                flat
                class="secondary"
                @click="editPassword = false"
              >
                Close
              </v-btn>
              <v-btn
                flat
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
            </v-card-actions>
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
        oldpassword: '',
        newpassword: '',
        newconfirmpassword: '',
        editPassword: false
      }
    },
    methods: {
      onSavePassword () {
        if (this.oldpassword === '' ||
          this.newpassword !== this.newconfirmpassword) {
          return
        }
        this.$store.dispatch('updatePassword', {password: this.oldpassword, newPassword: this.newpassword})
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
          this.oldpassword = ''
          this.newpassword = ''
          this.newconfirmpassword = ''
        } else {
          this.$store.dispatch('clearError')
        }
      }
    },
    computed: {
      comparePasswords () {
        return this.newpassword !== this.newconfirmpassword ? 'Passwords do not match' : ''
      },
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>