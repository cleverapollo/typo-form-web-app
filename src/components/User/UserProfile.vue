<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">User</h1>
        </v-flex>

        <v-flex d-flex xs12>
          <v-card>
            <v-card-text>
              <v-layout row wrap>
                <v-flex d-flex xs12>
                  <div class="title my-2">{{ fullName }}</div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex d-flex xs12>
          <v-tabs
            slider-color="primary"
            color="transparent"
          >
            <v-tab href="#forms">Forms</v-tab>
            <v-tab href="#organisations">Organisations</v-tab>
            <v-tab href="#notes">Notes</v-tab>

            <v-tab-item value="forms">
              <UserForms :user-id="userId"></UserForms>
            </v-tab-item>
            <v-tab-item value="organisations">
              <UserOrganisations :user-id="userId"></UserOrganisations>
            </v-tab-item>
            <v-tab-item value="notes">
              <UserNotes :user-id="userId"></UserNotes>
            </v-tab-item>
          </v-tabs>

        </v-flex>

      </v-layout>
    </v-flex>

  </v-layout>
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
      loading: false
    }
  },
  computed: {
    user () {
      return this.$store.getters.userByUserId(this.$_slug, this.userId)
    },
    fullName () {
      return this.user ? this.user.first_name + ' ' + this.user.last_name : ''
    }
  },
  methods: {
    getUsers () {
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
    this.getUsers()
  }
}
</script>
