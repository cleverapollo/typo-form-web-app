<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <h1 class="headline primary--text py-3">User Profile</h1>
      </v-flex>
    </v-layout>

    <v-container fluid grid-list-lg pa-0>
      <v-layout row wrap justify-space-between>
        <v-flex xs12>
          <v-card>
            <v-card-text>
              <v-layout row wrap pa-2>
                <v-flex shrink>
                  <v-avatar color="primary" size="90">
                    <span class="white--text display-2">{{ avatar }}</span>
                  </v-avatar>
                </v-flex>
                <v-flex grow>
                  <v-flex d-flex xs12 py-0>
                    <div class="headline">
                      {{ fullName }}
                    </div>
                  </v-flex>
                  <v-flex d-flex xs12 pt-1>
                    <div class="body-2">{{ email }}</div>
                  </v-flex>
                  <v-flex xs12 pa-0>
                    <v-chip :color='statusColor' text-color="white" small>
                      {{ status }}
                    </v-chip>
                  </v-flex>
                </v-flex>
                <v-spacer></v-spacer>
                <v-divider vertical></v-divider>
                <v-flex shrink>
                  <v-flex xs12 py-0>
                    <div class="grey--text text--darken-1">Role: {{ roleName }}</div>
                  </v-flex>
                  <v-flex xs12 py-0>
                    <div class="grey--text text--darken-1">Updated: {{ updatedTime }}</div>
                  </v-flex>
                  <v-flex xs12 py-0>
                    <div class="grey--text text--darken-1">Created: {{ createdDate }}</div>
                  </v-flex>
                  <v-flex xs12 py-0>
                    <v-tooltip bottom>
                      <v-btn class="ma-0" flat icon @click.stop="editUser = true" slot="activator">
                        <v-icon>edit</v-icon>
                      </v-btn>
                      <span>Edit user</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <v-btn class="ma-0" flat icon @click.stop="confirmDelete = true" slot="activator">
                        <v-icon>delete</v-icon>
                      </v-btn>
                      <span>Delete user</span>
                    </v-tooltip>
                  </v-flex>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12>
          <v-tabs
            slider-color="primary"
            color="transparent"
            class="user-profile-tabs"
          >
            <v-tab href="#forms">Forms</v-tab>
            <v-tab href="#notes">Notes</v-tab>
            <v-tab-item value="forms">
              <UserForms :user-id="userId"></UserForms>
            </v-tab-item>
            <v-tab-item value="notes">
              <NotesTable :filters='filters'></NotesTable>
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
    <UserEdit :show='editUser' :id='userId' :slug='$_slug' @close='editUser = false'></UserEdit>
  </div>
</template>

<script>
import UserForms from './UserForms'
import NotesTable from '../Note/NotesTable'
import UserEdit from './UserEdit'
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
    NotesTable,
    UserEdit
  },
  data () {
    return {
      userId: parseInt(this.id),
      loading: false,
      confirmDelete: false,
      editUser: false,
      filters: [
        { key: 'User', values: [parseInt(this.id)] }
      ]
    }
  },
  computed: {
    user () {
      return this.$store.getters.userById(this.$_slug, this.userId)
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
    updatedTime () {
      return this.user && this.status !== 'Invited' ? this.$_getTimeSince(this.user.updated_at) : 'Never'
    },
    createdDate () {
      return this.user ? this.$_getDateTime(this.user.created_at) : ''
    },
    roleName () {
      return this.$_getUserApplicationRole(this.user)
    },
    avatar () {
      return this.user && this.user.first_name ? this.user.first_name.charAt(0).toUpperCase() : null
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
<style>
.user-profile-tabs .v-tabs__bar {
  margin-bottom:15px
}
</style>
