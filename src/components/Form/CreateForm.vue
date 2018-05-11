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
              </v-layout>

              <v-layout row wrap pt-4>

                <v-flex xs12 sm3>
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

                <v-flex xs12 offset-sm1 sm3>
                  <v-select
                    :items="periodDurations"
                    item-value="id"
                    item-text="period"
                    v-model="periodDuration"
                    label="Period Duration"
                  ></v-select>
                </v-flex>

                <v-flex xs12 offset-sm1 sm3 v-if="periodDuration === 5">
                  <v-menu
                    lazy
                    :close-on-content-click="false"
                    v-model="endMenu"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
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
                </v-flex>
              </v-layout>

              <v-layout pt-4>
                <v-flex xs12>
                  <v-checkbox label="Show Progress" v-model="showProgress" light></v-checkbox>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex v-on:click="startedUploading" class="ma-5">
                  <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"
                                v-on:vdropzone-drop="startedUploading"
                                v-on:vdropzone-success="onUploaded"></vue-dropzone>
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
              @click="onCreateForm">Create Form
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import vue2Dropzone from 'vue2-dropzone/dist/vue2Dropzone.js'
  import 'vue2-dropzone/dist/vue2Dropzone.css'

  export default {
    props: ['slug'],
    components: {
      vueDropzone: vue2Dropzone
    },
    data () {
      return {
        name: '',
        startMenu: false,
        periodStart: null,
        endMenu: false,
        periodEnd: null,
        periodDuration: 5,
        showProgress: true,
        csv: null
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(this.slug)
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
      periodDurations () {
        var options = this.$store.getters.periods
        options.push({
          id: 5,
          period: 'Custom'
        })
        return options
      },
      dropzoneOptions () {
        return {
          url: process.env.API_URL + 'file',
          thumbnailWidth: 150,
          acceptedFiles: '.csv',
          dictDefaultMessage: 'Please Drag and Drop CSV file.',
          headers: {'api_token': localStorage.getItem('token')}
        }
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
          slug: this.slug,
          name: this.name,
          periodStart: this.periodStart,
          periodEnd: this.periodDuration === 5 ? this.periodEnd : null,
          periodId: this.periodDuration !== 5 ? this.periodDuration : null,
          showProgress: this.showProgress,
          csv: this.csv
        }

        this.$store.dispatch('createForm', formData)
        this.$router.push('/' + this.slug + '/forms')
      },
      onCancel () {
        this.$router.push('/' + this.slug + '/forms')
      },
      startedUploading () {
        this.$refs.myVueDropzone.removeAllFiles()
      },
      onUploaded (file, response) {
        this.csv = response.path
      }
    }
  }
</script>
