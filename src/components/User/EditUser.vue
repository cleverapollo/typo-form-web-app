<template>
  <v-dialog width="350px" persistent v-model="editUser">
    <v-btn class="primary" slot="activator">Edit</v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>
              <h2>Edit User</h2>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="email"
                label="Email"
                id="email"
                v-model="editedEmail"
                type="email"
                disabled></v-text-field>
              <v-select
                :items="roles"
                item-text="name"
                item-value="id"
                v-model="editedRole"
                label="Role"
                single-line
              ></v-select>
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
                @click="onCancel"
              >
                Close
              </v-btn>
              <v-btn 
                flat 
                class="primary" 
                @click="onSaveChanges"
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
    props: ['user', 'applicationName'],
    data () {
      return {
        id: this.user.id,
        editUser: false,
        editedEmail: this.user.email,
        editedRole: this.user.application_role_id
      }
    },
    methods: {
      onSaveChanges () {
        this.editUser = false
        if (this.editedRole !== this.user.application_role_id) {
          this.$store.dispatch('updateUser',
            {
              applicationName: this.applicationName,
              id: this.id,
              email: this.editedEmail,
              applicationRoleId: this.editedRole
            })
        }
      },
      onCancel () {
        this.editedEmail = this.user.email
        this.editedRole = this.user.application_role_id
        this.editUser = false
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
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
