<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>

        <!-- //Title -->
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Settings</h1>
          <v-spacer></v-spacer>

        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex xs12>
      <v-card>
        <v-card-text>

          <!-- Application Name -->
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
              name="name"
              label="Application Name"
              v-model="name"
              required>
              </v-text-field>
            </v-flex>
          </v-layout>

          <!-- //Application Image -->
          <v-layout row>
            <v-flex xs12>
              <label class="v-label v-label--active theme--light">Application Image</label>
              <v-layout row>
              <v-flex xs12 mt-2>
                <FileUpload
                  v-bind:maxFiles="maxFiles"
                  v-bind:maxFilesize="maxFilesize"
                  v-bind:acceptedFiles="acceptedFiles"
                  v-bind:files="images"
                ></FileUpload>
              </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>

          <!-- //Custom CSS -->
          <v-layout row wrap>
            <v-flex xs12>
              <v-textarea
              name="css"
              label="Custom CSS"
              v-model="css"
              >
              </v-textarea>
            </v-flex>
          </v-layout>

        </v-card-text>

        <!-- //Actions -->
        <v-divider></v-divider>
        <v-card-actions>
          <v-layout row py-2 px-2>
            <v-flex xs12>
              <v-btn flat class="primary" @click="saveApplication" :disabled="!valid">Save</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>

      </v-card>
    </v-flex>

    <v-flex xs6>
      <v-btn flat secondary @click.stop="exportApplicationData">Export Application Data</v-btn>
    </v-flex>

    <!-- //Delete Application -->
    <v-flex xs6 text-xs-right>
      <v-btn flat secondary @click.stop="deleteApplication = true">Delete Application</v-btn>
    </v-flex>
    <DeleteConfirmDialog @delete-action="onDeleteApplication" :visible="deleteApplication" @close="deleteApplication = false"></DeleteConfirmDialog>

  </v-layout>

</template>

<script>
  export default {
    data () {
      return {
        name: null,
        css: null,
        images: [],
        acceptedFiles: 'image/*',
        maxFiles: 1,
        maxFilesize: 5,
        deleteApplication: false,
        slug: window.location.hostname.split('.')[0]
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(this.slug)
      },
      applicationImage () {
        let image = null
        if (this.images.length) {
          image = {
            name: this.images[0].name,
            url: this.images[0].url,
            size: this.images[0].size,
            stored_name: this.images[0].stored_name
          }
        }
        return image === null ? null : JSON.stringify(image)
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsApplicationAdmin () {
        return this.userIsAdmin || this.isSuperUser
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.getRole(this.application.application_role_id) === 'Admin'
      },
      isSuperUser () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.getRole(this.$store.getters.user.role_id) === 'Super Admin'
      },
      loading () {
        return this.$store.getters.loading
      },
      joinURL () {
        return window.location.origin + '/join/application/' + this.application.share_token
      },
      valid () {
        return this.name.length > 0
      }
    },
    methods: {
      exportApplicationData () {
        window.axios.get(process.env.API_URL + 'application/' + this.slug + '/export')
        .then(response => {
          if (response.data.file.url) {
            window.open(response.data.file.url, '_blank')
          }
        })
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onDeleteApplication () {
        this.$store.dispatch('deleteApplication', {
          slug: this.slug
        })
        this.$router.push('/applications')
      },
      saveApplication () {
        let application = {
          slug: this.application.slug,
          css: this.css,
          icon: this.applicationImage
        }

        if (this.name !== this.application.name) {
          application.name = this.name
        }

        this.$store.dispatch('updateApplication', application)
          .then(response => {
            this.$store.dispatch('loadApplication', response.data.application.slug)
            .then((response) => {
              const slug = response.data.application.slug
              const url = window.location.origin.split('://')
              const subdomain = url[1].split('.')
              if (subdomain[0] === 'informed365') {
                subdomain.unshift(slug)
              } else {
                subdomain[0] = slug
              }
            })
          })
      }
    },
    created: function () {
      this.name = this.application.name
      this.css = this.application.css
      this.images = this.application.icon !== null ? [JSON.parse(this.application.icon)] : []
    }
  }
</script>
