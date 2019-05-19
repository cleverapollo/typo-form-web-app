<template>
  <v-dialog persistent v-model="editUser" max-width="600px">
    <v-btn icon slot="activator" class="mx-0"><v-icon color="teal">edit</v-icon></v-btn>
    <v-card>

      <!-- //Title -->
      <v-card-title>
        <div class="title mb-2 mt-2">Edit User</div>
      </v-card-title>

      <!-- //Body -->
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              name="email"
              label="Email"
              id="email"
              v-model="editedEmail"
              type="email"
              disabled></v-text-field>
            <v-select
              :items="invitationRoles"
              item-text="name"
              item-value="id"
              v-model="editedRole"
              label="Role"
              single-line
            ></v-select>
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-divider></v-divider>
      <v-subheader>Workflow Snooze</v-subheader>
      <v-card-text>
        <p class="body-1">
          Occasionally you may need to delay workflow emails for a user, for example, when you know 
          they will be on leave.
        </p>
        <v-layout>
          <v-flex xs12 md6 pr-4>
            <v-text-field
              v-model="editedMultiplier"
              label="Delay"
              type="number"
              :rules="rules.delay"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md6>
            <v-autocomplete
              :items="periods"
              item-value="milliseconds"
              item-text="label"
              label="Period"
              v-model="editedPeriod"
            ></v-autocomplete>
          </v-flex>
        </v-layout>
      </v-card-text>

      <!-- //Actions -->
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click="onCancel">Cancel</v-btn>
            <v-btn class="primary" @click="onSaveChanges">Save</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import * as _ from 'lodash'
  export default {
    props: ['user', 'slug'],
    data () {
      return {
        id: this.user.id,
        editUser: false,
        editedEmail: this.user.email,
        editedRole: this.user.application_role_id,
        editedPeriod: _.get(this.user, 'meta.period', 60000),
        editedMultiplier: _.get(this.user, 'meta.multiplier', 0),
        periods: [
          { milliseconds: 60000, label: 'minutes' },
          { milliseconds: 3600000, label: 'hours' },
          { milliseconds: 86400000, label: 'days' },
          { milliseconds: 604800000, label: 'weeks' }
        ],
        rules: {
          delay: [
            v => !!v || 'Delay is required'
          ]
        }
      }
    },
    methods: {
      onSaveChanges () {
        if (
          this.editedRole !== this.user.application_role_id ||
          this.editedPeriod !== _.get(this.user, 'meta.period', 60000) ||
          this.editedMultiplier !== _.get(this.user, 'meta.multiplier', 0)
        ) {
          this.$store.dispatch('updateUser', {
            slug: this.slug,
            id: this.id,
            applicationRoleId: this.editedRole,
            multiplier: this.editedMultiplier,
            period: this.editedPeriod
          })
          this.editUser = false
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
      invitationRoles () {
        return this.roles.filter((role) => {
          return role.name !== 'Super Admin'
        })
      }
    }
  }
</script>
