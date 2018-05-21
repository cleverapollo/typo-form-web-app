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
        <v-layout row wrap>
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
              ></v-text-field>
            </v-card-text>
          </v-flex>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                id="subject"
                name="subject"
                label="Subject"
              ></v-text-field>
            </v-card-text>
          </v-flex>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                id="body"
                name="body"
                label="Body"
                multi-line
              ></v-text-field>
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
        selectedForms: []
      }
    },
    methods: {
      onSaveChanges () {
        this.settingApplication = false
        let updateObj = {
          slug: this.application.slug,
          formIds: this.selectedForms
        }

        this.$store.dispatch('setAuto', updateObj)
      },
      onCancel () {
        this.settingApplication = false
      }
    },
    computed: {
      forms () {
        return this.$store.getters.loadedForms(this.application.slug)
      },
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      forms (value) {
        this.selectedForms = value.filter(e => {
          return e.auto
        }).map(e => e.id)
      }
    },
    created () {
      this.selectedForms = this.forms.filter(e => {
        return e.auto
      }).map(e => e.id)
    }
  }
</script>
