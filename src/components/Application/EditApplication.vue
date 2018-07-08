<template>
  <v-dialog width="600px" persistent v-model="editApplication">
    <div slot="activator" v-if="btnRect">Edit Application</div>
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

      <!-- //Title -->
      <v-card-title>
        <div class="title mb-2 mt-2">Edit Application</div>
      </v-card-title>

      <!-- //Content -->
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              name="name"
              label="Name"
              id="name"
              v-model="editedName"
              required></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-textarea
              name="css"
              label="CSS"
              id="css"
              v-model="editedCSS">
            </v-textarea>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12 class="ph-2">
            <upload-icon :icon='icon' @update-icon="updateIcon"></upload-icon>
          </v-flex>
        </v-layout>
      </v-card-text>

      <!-- //Actions -->
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click="onCancel">Cancel</v-btn>
            <v-btn flat class="primary" @click="onSaveChanges">Save</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
      
    </v-card>
  </v-dialog>
</template>

<script>
  import uploadIcon from './IconUpload'

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
    components: {
      uploadIcon
    },
    data () {
      return {
        id: this.application.id,
        editApplication: false,
        editedName: this.application.name,
        editedCSS: this.application.css,
        icon: this.application.icon
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedName.trim() === '') {
          return
        }
        this.editApplication = false
        let updateObj = {
          slug: this.application.slug,
          css: this.editedCSS
        }

        if (this.editedName !== this.application.name) {
          updateObj.name = this.editedName
        }

        if (this.icon !== this.application.icon) {
          updateObj.icon = this.icon
        }

        this.$store.dispatch('updateApplication', updateObj)
          .then((response) => this.$router.push('/' + response.data.application.slug))
      },
      updateIcon (icon) {
        this.icon = icon
      },
      onCancel () {
        this.editedName = this.application.name
        this.editedCSS = this.application.css
        this.editApplication = false
      }
    }
  }
</script>
