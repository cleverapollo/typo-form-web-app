<template>
  <v-dialog v-model="show" fullscreen hide-overlay lazy>
    <v-card>

      <v-toolbar dark color="primary">
        <v-btn icon dark @click.stop="show = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Invite Users</v-toolbar-title>
      </v-toolbar>

      <!-- // Users -->
      <v-container fluid>
        <div class="subheading my-2">Users</div>
        <template v-for="(item, index) in invitations">
          <v-layout row wrap v-bind:key="index">

            <v-flex xs12 md11>
              <v-layout>

                <!-- // Firstname -->
                <v-flex xs12 md4 pr-4>
                  <v-text-field
                    label="First Name"
                    v-model="item.firstname"
                    required
                  ></v-text-field>
                </v-flex>

                <!-- // Lastname -->
                <v-flex xs12 md4 pr-4>
                  <v-text-field
                    label="Last Name"
                    v-model="item.lastname"
                    required
                  ></v-text-field>
                </v-flex>

                <!-- // Email -->
                <v-flex xs12 md4 pr-4>
                  <v-text-field
                    label="Email"
                    v-model="item.email"
                    required
                  ></v-text-field>
                </v-flex>

                <!-- // Organisation -->
                <v-flex xs12 md4>
                  <v-text-field
                    label="Organisation"
                    v-model="item.organisation"
                    required
                  ></v-text-field>
                </v-flex>

              </v-layout>
            </v-flex>
            <v-flex xs12 md1 text-xs-center text-sm-right>
              <v-btn flat icon @click="removeUser" class="mt-3">
                <v-icon>close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </template>

        <!-- // Add User -->
        <v-layout row>
          <v-flex xs12 class="text-xs-center">
            <v-btn flat @click.stop="addUser">Add User</v-btn>
            <v-btn flat @click.stop="bulkUpload">Bulk Upload</v-btn>
            <input
                type="file"
                style="display: none"
                ref="image"
                accept=".csv"
                @change="onFilePicked"
            >

          </v-flex>
        </v-layout>

      </v-container>

      <v-divider class="py-2"></v-divider>

      <v-container fluid>

        <!-- // Permissions -->
        <div class="subheading my-2">User Permissions</div>
        <v-layout row wrap class="mb-4">

          <!-- // Application Role -->
          <v-flex sm12 md6 pr-4>
            <v-autocomplete
              :items="applicationRoles"
              item-text="name"
              item-value="id"
              v-model="role"
              label="Application Role"
              required
            ></v-autocomplete>
          </v-flex>

          <!-- // Form Templates -->
          <v-flex sm12 md6>
            <v-autocomplete
              :items="formTemplates"
              item-text="name"
              item-value="id"
              v-model="form_templates"
              label="Form Templates"
              required
              multiple
            ></v-autocomplete>
          </v-flex>

        </v-layout>

      </v-container>

      <v-divider class="py-2"></v-divider>

      <v-container fluid>

        <!-- // Invitation -->
        <div class="subheading my-2">Invitation Email</div>
        <v-layout row wrap class="mb-4">

          <v-flex xs12>

            <!-- // Subject -->
            <v-flex xs12>
              <v-text-field
                label="Subject"
                v-model="subject"
                required
              ></v-text-field>
            </v-flex>

            <!-- // CC -->
            <v-flex xs12>
              <v-text-field
                label="CC"
                v-model="cc"
                required
              ></v-text-field>
            </v-flex>

            <!-- // BCC -->
            <v-flex xs12>
              <v-text-field
                label="BCC"
                v-model="bcc"
                required
              ></v-text-field>
            </v-flex>

            <!-- // Message -->
            <v-flex xs12>
              <v-textarea
                label="Message"
                v-model="message"
                required
              ></v-textarea>
            </v-flex>

          </v-flex>

        </v-layout>

      </v-container>


      <!-- //Actions -->
      <v-divider></v-divider>
      <v-container fluid>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click.stop="close">Cancel</v-btn>
            <v-btn color="primary" @click.stop="invite">Invite Users</v-btn>
          </v-flex>
        </v-layout>
      </v-container>

    </v-card>
  </v-dialog>
</template>

<script>
  import * as _ from 'lodash'
  export default {
    props: ['visible', 'slug'],
    data () {
      return {
        role: null,
        form_templates: [],
        subject: '',
        message: '',
        cc: '',
        bcc: '',
        invitations: [],
        invitationTemplate: {
          firstname: '',
          lastname: '',
          email: '',
          organisation: '',
          properties: {}
        }
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      formTemplates () {
        let formTemplates = _.sortBy(this.$store.getters.loadedFormTemplates(this.slug), element => {
          return element.name.toLowerCase()
        })
        return formTemplates
      },
      applicationRoles () {
        return this.roles.filter((role) => { return role.name !== 'Super Admin' })
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
        this.show = false
        this.setForm()
      },
      addUser () {
        const newTemplate = Object.assign({}, this.invitationTemplate)
        this.invitations.push(newTemplate)
      },
      bulkUpload () {
        this.$refs.image.click()
      },
      onFilePicked (e) {
        const files = e.target.files
        if (files[0] !== undefined) {
          const file = files[0]
          const reader = new FileReader()
          reader.readAsText(file)
          reader.onload = (event) => {
            const data = event.target.result
            const lines = data.split('\n')
            if (data && lines.length) {
              const keys = {}
              const headerKeys = lines[0].split(',')
              headerKeys.forEach((key, index) => {
                keys[index] = key
              })
              lines.splice(0, 1)
              lines.forEach((line) => {
                if (!line.length) {
                  return
                }
                const result = Object.assign({}, this.invitationTemplate)
                const values = line.split(',')
                values.forEach((value, index) => {
                  if (value) {
                    result[keys[index]] = value
                  }
                })
                this.invitations.push(result)
              })
            }
          }
        }
      },
      removeUser (index) {
        this.invitations.splice(index, 1)
        if (!this.invitations.length) {
          const newTemplate = Object.assign({}, this.invitationTemplate)
          this.invitations.push(newTemplate)
        }
      },
      invite () {
        this.show = false
        this.$store.dispatch('inviteApplication', { invitations: this.invitations, slug: this.slug, role: this.role })
        this.setForm()
      },
      setForm () {
        const newTemplate = Object.assign({}, this.invitationTemplate)
        this.invitations = []
        this.invitations.push(newTemplate)
        this.role = null
        this.form_templates = []
        this.subject = ''
        this.body = ''
        this.cc = ''
        this.bcc = ''
      }
    },
    created: function () {
      this.setForm()
      this.$store.dispatch('loadFormTemplates', this.slug)
    }
  }
</script>
