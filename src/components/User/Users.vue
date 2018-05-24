<template>
  <v-layout row wrap>
    <v-flex d-flex sm12 md10 offset-md1 xl8 offset-xl2>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">Users</div>
        </v-flex>
        <v-flex d-flex xs12>
          <v-card>

            <v-tabs dark slider-color="white" color="info">
              <v-tab href="#active">Active</v-tab>
              <v-tab href="#invited">Invited</v-tab>
              <v-tab-item id="active">

                <!-- //Users -->
                <v-data-table
                  :headers="userHeaders"
                  :items="users"
                >
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.first_name }}</td>
                    <td>{{ props.item.last_name }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>{{ getRole(props.item.application_role_id) }}</td>
                    <td>{{ props.item.created_at.date }}</td>
                  </template>
                </v-data-table>
              </v-tab-item>
              <v-tab-item id="invited">

                <!-- //Invited Users -->
                <v-data-table
                  :headers="invitedHeaders"
                  :items="invitedUsers"
                >
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.invitee }}</td>
                    <td>{{ getRole(props.item.role_id) }}</td>
                    <td>{{ props.item.created_at }}</td>
                  </template>
                </v-data-table>
              </v-tab-item>
            </v-tabs>

          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <!-- //Action Button -->
    <v-tooltip top>
      <v-btn slot="activator" fixed dark bottom right fab router class="red" @click.stop="inviteApplication = true" v-if="isApplicationAdmin">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Invite Users</span>
    </v-tooltip>

    <!-- //Invite Application -->
    <InviteApplication :visible="inviteApplication" :slug="slug" @close="inviteApplication = false"></InviteApplication>
  </v-layout>
</template>

<script>
  import InviteApplication from '../Application/InviteApplication'
  export default {
    props: ['slug'],
    data () {
      return {
        inviteApplication: false,
        userHeaders: [
          { text: 'First Name', value: 'first_name', sortable: true, align: 'left' },
          { text: 'Last Name', value: 'last_name', sortable: true, align: 'left' },
          { text: 'Email', value: 'email', sortable: true, align: 'left' },
          { text: 'Role', value: 'role', sortable: true, align: 'left' },
          { text: 'Joined', value: 'created_at', sortable: true, align: 'left' }
        ],
        invitedHeaders: [
          { text: 'Email', value: 'email', sortable: true, align: 'left' },
          { text: 'Role', value: 'role', sortable: true, align: 'left' },
          { text: 'Invited', value: 'created_at', sortable: true, align: 'left' }
        ]
      }
    },
    components: {
      InviteApplication
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(this.slug)
      },
      isApplicationAdmin () {
        return this.application && this.application.application_role_id <= 2
      },
      users () {
        return this.$store.getters.loadedUsers(this.slug)
      },
      invitedUsers () {
        return this.$store.getters.invitedUsers(this.slug)
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      }
    },
    created: function () {
      this.$store.dispatch('loadUsers', this.slug)
    }
  }
</script>