<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <h1 class="headline primary--text py-3">User Profile</h1>
      </v-flex>
    </v-layout>

    <v-container fluid grid-list-lg pa-0>
      <v-layout row wrap justify-space-between>
        <v-flex d-flex xs12 sm3>
          <v-card>
            <v-card-text>
              <v-layout row wrap>
                <v-flex d-flex xs12 pb-0>
                  <div class="title">
                    {{ fullName }}
                    <v-chip :color='statusColor' text-color="white" small>
                      {{ status }}
                    </v-chip>
                  </div>
                </v-flex>
                <v-flex d-flex xs12 pt-1>
                  <div class="body-2">{{ email }}</div>
                </v-flex>
                <v-flex d-flex xs12 py-1>
                  <div class="">Role: {{ roleName }}</div>
                </v-flex>
                <v-flex d-flex xs12 py-1>
                  <div class="grey--text text--darken-1">Last signed-in: {{ signInTime }}</div>
                </v-flex>
                <v-flex d-flex xs12 py-1>
                  <div class="grey--text text--darken-1">Created: {{ createdDate }}</div>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <v-list>
                <!--
                <v-list-tile @click=''>
                  <v-list-tile-action>
                    <v-icon>edit</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    Edit User
                  </v-list-tile-content>
                </v-list-tile>
                -->
                <v-list-tile @click='confirmDelete = true'>
                  <v-list-tile-action>
                    <v-icon>delete</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    Delete User
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex d-flex xs12 sm9>
          <v-tabs
            slider-color="primary"
          >
            <v-tab href="#forms">Forms</v-tab>
            <!--
            <v-tab href="#organisations">Organisations</v-tab>
            -->
            <v-tab href="#notes">Notes</v-tab>

            <v-tab-item value="forms">
              <UserForms :user-id="userId"></UserForms>
            </v-tab-item>
            <!--
            <v-tab-item value="organisations">
              <UserOrganisations :user-id="userId"></UserOrganisations>
            </v-tab-item>
            -->
            <v-tab-item value="notes">
              <UserNotes :user-id="userId"></UserNotes>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- // Delete Confirmation -->
    <v-dialog 
      v-model="confirmDelete"
      width="600">
      <v-card>
        <v-toolbar
          flat
          dark
          color="primary">
          <v-toolbar-title>Confirm deleting user</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          This action will delete this user. Are you sure you want to continue?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn
              flat
              @click.stop="confirmDelete = false"
            >Cancel</v-btn>
            <v-btn
              color="primary"
              @click.stop="deleteUser()"
            >Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import UserForms from './UserForms'
import UserOrganisations from './UserOrganisations'
import UserNotes from './UserNotes'
export default {
  name: 'UserProfile',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    UserForms,
    UserOrganisations,
    UserNotes
  },
  data () {
    return {
      userId: parseInt(this.id),
      loading: false,
      confirmDelete: false
    }
  },
  computed: {
    user () {
      return this.$store.getters.userByUserId(this.$_slug, this.userId)
    },
    fullName () {
      return this.user ? this.user.first_name + ' ' + this.user.last_name : ''
    },
    email () {
      return this.user ? this.user.email : ''
    },
    status () {
      return this.user ? this.user.status.label : ''
    },
    statusColor () {
      return this.status === 'Active' ? 'green' : 'orange'
    },
    signInTime () {
      return this.user && this.status !== 'Invited' ? this.$_getTimeSince(this.user.updated_at) : 'Never'
    },
    createdDate () {
      return this.user ? this.$_getDateTime(this.user.created_at) : ''
    },
    roleName () {
      return this.user ? this.user.role.label : ''
    }
  },
  methods: {
    deleteUser () {
      this.$store.dispatch('deleteUser', { slug: this.$_slug, id: this.userId })
      .then(() => {
        this.$store.dispatch('loadUsers', this.$_slug)
        this.$router.push('/users')
      })
    },
    loadData () {
      this.loading = true
      Promise.all([
        this.$store.dispatch('loadUsers', this.$_slug)
      ])
      .catch(() => {
        this.$router.push('/dashboard?error=403')
      })
      .finally(() => {
        this.loading = false
      })
    }
  },
  created: function () {
    this.loadData()
  }
}
</script>
