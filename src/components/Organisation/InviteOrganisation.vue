<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <v-card>

      <!-- //Title -->
      <v-card-title>
        <div class="title mb-2 mt-2">Invite Users</div>
      </v-card-title>

      <!-- //Invitation -->
      <v-card-text>
        <template v-for="(item, index) in invitations">
          <v-layout wrap>
            <v-flex xs12 sm6 d-flex>
              <v-text-field
                label="Email"
                @change="multiEmail(index, $event)"
                v-model="item.email"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 offset-sm1 d-flex>
              <v-select
                :items="invitationRoles"
                item-text="name"
                item-value="id"
                v-model="item.organisation_role_id"
                label="Role"
                single-line
                required
              ></v-select>
            </v-flex>
            <v-flex xs12 sm1 text-xs-center text-sm-right>
              <v-btn flat icon @click="removeUser" class="mt-3">
                <v-icon>close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </template>

        <!-- //Add Row -->
        <v-layout row>
          <v-flex xs12 class="text-xs-left">
            <v-btn flat @click.stop="addUser">Add another user</v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>

      <!-- //Actions -->
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click.stop="close">Cancel</v-btn>
            <v-btn color="primary" @click.stop="invite">Invite</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
  import * as _ from 'lodash'
  export default {
    props: ['slug', 'organisationId', 'visible'],
    data () {
      return {
        invitations: [{ email: '', organisation_role_id: '' }],
        role: 2
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
      },
      show: {
        get () {
          return this.visible
        },
        set (value) {
          if (!value) {
            this.$emit('close')
          }
        }
      }
    },
    methods: {
      close () {
        this.invitations = [{ email: '', organisation_role_id: '' }]
        this.show = false
      },
      addUser () {
        this.invitations.push({ email: '', organisation_role_id: '' })
      },
      removeUser (index) {
        this.invitations.splice(index, 1)
      },
      invite () {
        const invitations = this.invitations.filter(function (item) {
          return item.email.trim() !== ''
        })
        if (!invitations.length) {
          return
        }
        this.show = false
        this.$store.dispatch('inviteOrganisation', {invitations: invitations, id: this.organisationId, slug: this.slug, role: this.role})
      },
      multiEmail (insertIndex, value) {
        if (!value.includes(',')) {
          return
        }
        const values = value.split(',').map((value) => value.trim())
        this.invitations[insertIndex].email = values[0]
        let _this = this
        _.forEach(values, function (value, index) {
          if (index === 0) {
            return
          }
          _this.invitations.splice(insertIndex + index, 0, { email: value, organisation_role_id: _this.invitations[insertIndex].organisation_role_id })
        })
      }
    }
  }
</script>
