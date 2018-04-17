<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-container>
              <h1 class="mb-4">Create Form</h1>

              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    name="name"
                    label="Name"
                    id="name"
                    v-model="name"
                    required></v-text-field>
                </v-flex>

                <v-flex xs12 class="pt-3">
                  <v-select
                    :items="periodTypes"
                    item-value="id"
                    item-text="name"
                    v-model="periodType"
                    label="Period Type"
                  ></v-select>
                </v-flex>

                <v-spacer></v-spacer>

                <v-flex xs12 class="pt-3">
                  <v-menu
                    lazy
                    :close-on-content-click="false"
                    v-model="startMenu"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                  >
                    <v-text-field
                      slot="activator"
                      label="Period Start"
                      v-model="periodStart"
                      prepend-icon="event"
                      readonly
                    ></v-text-field>

                    <v-date-picker v-model="periodStart" no-title scrollable actions>
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                          <v-btn flat color="primary" @click="save">OK</v-btn>
                        </v-card-actions>
                      </template>
                    </v-date-picker>
                  </v-menu>
                </v-flex>

                <v-spacer></v-spacer>

                <v-flex xs12 class="pt-3">
                  <v-menu
                    lazy
                    :close-on-content-click="false"
                    v-model="endMenu"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    v-if="periodType === 2"
                  >
                    <v-text-field
                      slot="activator"
                      label="Period End"
                      v-model="periodEnd"
                      prepend-icon="event"
                      readonly
                    ></v-text-field>

                    <v-date-picker v-model="periodEnd" no-title scrollable actions>
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                          <v-btn flat color="primary" @click="save">OK</v-btn>
                        </v-card-actions>
                      </template>
                    </v-date-picker>
                  </v-menu>

                  <v-select
                    :items="periodDurations"
                    item-value="id"
                    item-text="period"
                    v-model="periodDuration"
                    label="Period Duration"
                    v-if="periodType === 1"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-btn color="info" @click=onCancel>Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              class="primary"
              :disabled="!formIsValid"
              @click="onCreateForm">Create Form</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['application_id'],
    data () {
      return {
        name: '',
        periodType: 1,
        startMenu: false,
        periodStart: null,
        endMenu: false,
        periodEnd: null,
        periodDuration: 1
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.application_id))
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.getRole(this.application.application_role_id) === 'Admin'
      },
      formIsValid () {
        return this.name !== ''
      },
      periodTypes () {
        return [
          {id: 1, name: 'Set Period Duration'},
          {id: 2, name: 'Set Period End'}
        ]
      },
      periodDurations () {
        return this.$store.getters.periods
      }
    },
    watch: {
      application (value) {
        if (this.getRole(value.application_role_id) === 'User') {
          this.$router.push('/applications/')
        }
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onCreateForm () {
        if (!this.formIsValid || !this.userIsAdmin) {
          return
        }

        const formData = {
          applicationId: this.application_id,
          name: this.name,
          periodStart: this.periodStart,
          periodEnd: this.periodType === 2 ? this.periodEnd : null,
          periodId: this.periodType === 1 ? this.periodDuration : null
        }

        this.$store.dispatch('createForm', formData)
        this.$router.push('/applications/' + this.application_id + '/forms')
      },
      onCancel () {
        this.$router.push('/applications/' + this.application_id + '/forms')
      }
    },
    created: function () {
      this.$store.dispatch('loadApplications')
    }
  }
</script>

<style>
  .input-group__details {
    min-height: unset;
  }

  .menu__content {
    min-width: unset !important;
  }

  .pt-3 {
    padding-top: 16px;
  }
</style>
