<template>
  <v-dialog width="350px" persistent v-model="editApplication">
    <div slot="activator" v-if="btnRect">Edit</div>
    <v-btn
      v-else
      class="primary"
      slot="activator"
      fab
      fixed
      bottom
      right
      dark>
      <v-icon>
        edit
      </v-icon>
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>
              <h2>Edit Application</h2>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="name"
                label="Name"
                id="name"
                v-model="editedName"
                required></v-text-field>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="css"
                label="CSS"
                id="css"
                v-model="editedCSS"
                required></v-text-field>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
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
      },
      btnRect: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        id: this.application.id,
        editApplication: false,
        editedName: this.application.name,
        editedCSS: this.application.css
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedName.trim() === '') {
          return
        }
        this.editApplication = false
        this.$store.dispatch('updateApplication', {
          slug: this.application.slug,
          name: this.editedName,
          css: this.editedCSS
        })
      },
      onCancel () {
        this.editedName = this.application.name
        this.editedCSS = this.application.css
        this.editApplication = false
      }
    },
    computed: {
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>
