<template>
  <v-dialog width="350px" persistent v-model="editForm">
    <div slot="activator">Edit Form</div>

    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex>
            <h2>Edit Form</h2>
          </v-flex>
          <v-flex>
            <v-spacer></v-spacer>
            <v-btn
              flat
              icon
              href='/static/Form Template.xlsx'>
              <v-icon>cloud_download</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>

        <v-divider></v-divider>
        <v-card-text>

          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                name="name"
                label="Name"
                id="name"
                v-model="editedName"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row wrap pt-4>
            <v-flex xs12>
              <v-checkbox label="Show Progress" v-model="showProgress" light></v-checkbox>
            </v-flex>
          </v-layout>

          <!-- <v-layout>
            <v-flex>
              <label for="upload"><span>{{ csvFileName }}</span></label>
              <input id="upload" type="file" class="hide inputfile" accept=".csv, .xls, .xlsx" @change="onFileChange"
                     data-multiple-caption="{count} files selected" multiple/>
            </v-flex>
          </v-layout> -->
        </v-card-text>

        <v-divider></v-divider>

        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat class="secondary" @click="onCancel">Close</v-btn>
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
    props: ['form', 'slug'],
    data () {
      return {
        id: this.form.id,
        editForm: false,
        editedName: this.form.name,
        showProgress: this.form.show_progress
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedName.trim() === '') {
          return
        }

        this.editForm = false

        this.$store.dispatch('updateForm', {
          slug: this.slug,
          id: this.id,
          name: this.editedName,
          showProgress: this.showProgress
        })
      },
      onCancel () {
        this.editedName = this.form.name
        this.editForm = false
      }
      /* onFileChange (e) {
        const files = e.target.files || e.dataTransfer.files

        if (files.length) {
          this.csv = files[0]
          this.csvFileName = this.csv.name
        }
      } */
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
