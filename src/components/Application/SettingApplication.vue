<template>
  <v-dialog width="350px" persistent v-model="settingApplication">
    <div slot="activator">Setting Application</div>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>
              <h2>Setting Application</h2>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap v-if="forms.length">
          <v-flex xs12>
            <v-card-text>
              <v-select
                :items="forms"
                item-text="name"
                item-value="id"
                v-model="selectedForms"
                label="Forms"
                multiple
              ></v-select>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                id="recipient"
                name="recipient"
                label="Recipient"
                v-model="emailRecipients"
              ></v-text-field>
            </v-card-text>
          </v-flex>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                id="subject"
                name="subject"
                label="Subject"
                v-model="emailSubject"
              ></v-text-field>
            </v-card-text>
          </v-flex>
          <v-flex xs12>
            <v-card-text>
              <v-textarea
                id="body"
                name="body"
                label="Body"
                v-model="emailBody"
              ></v-textarea>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
          <v-flex xs12>
            <v-card-actions>
              <v-btn
                flat
                class="secondary"
                @click="onCancel"
              >
                Close
              </v-btn>
              <v-btn
                flat
                class="primary"
                @click="onSaveChanges"
                :disabled="loading"
                :loading="loading"
              >
                Save
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      application: {
        type: Object
      }
    },
    data () {
      return {
        settingApplication: false,
        selectedForms: [],
        emailRecipients: '',
        emailSubject: '',
        emailBody: ''
      }
    },
    methods: {
      onSaveChanges () {
        if (this.emailRecipients.trim() === '' || this.emailSubject.trim() === '' || this.emailBody.trim() === '') {
          return
        }

        this.settingApplication = false
        let updateObj = {}
        if (this.selectedForms.length) {
          updateObj = {
            slug: this.application.slug,
            formIds: this.selectedForms
          }
          this.$store.dispatch('setAuto', updateObj)
        }

        updateObj = {
          slug: this.application.slug,
          id: this.applicationEmail.id,
          recipients: this.emailRecipients,
          subject: this.emailSubject,
          body: this.emailBody
        }
        this.$store.dispatch('updateApplicationEmail', updateObj)
      },
      onCancel () {
        this.settingApplication = false
      }
    },
    computed: {
      forms () {
        return this.$store.getters.loadedForms(this.application.slug)
      },
      loading () {
        return this.$store.getters.loading
      },
      applicationEmail () {
        return this.$store.getters.loadedApplicationEmail(this.application.slug)
      }
    },
    watch: {
      forms (value) {
        this.selectedForms = value.filter(e => {
          return e.auto
        }).map(e => e.id)
      },
      applicationEmail (value) {
        if (value) {
          this.emailRecipients = value.recipients
          this.emailSubject = value.subject
          this.emailBody = value.body
        }
      }
    },
    created () {
      this.selectedForms = this.forms.filter(e => {
        return e.auto
      }).map(e => e.id)
      if (this.applicationEmail) {
        this.emailRecipients = this.applicationEmail.recipients
        this.emailSubject = this.applicationEmail.subject
        this.emailBody = this.applicationEmail.body
      }
    }
  }
</script>
