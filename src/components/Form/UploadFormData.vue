<template>
  <v-dialog width="600px" persistent v-model="uploadFormData">
    <div slot="activator">
      Upload Form Data
    </div>

    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex>
            <h2>Upload Form Data</h2>
          </v-flex>
        </v-layout>

        <v-divider></v-divider>
        <v-card-text>
          <v-layout>
            <v-flex>
              <label for="upload"><span>{{ csvFileName }}</span></label>
              <input id="upload" type="file" accept=".csv, .xls, .xlsx" @change="onFileChange"
                     data-multiple-caption="{count} files selected" multiple/>
            </v-flex>
          </v-layout>
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
    props: ['formTemplate', 'slug'],
    data () {
      return {
        id: this.formTemplate.id
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedName.trim() === '') {
          return
        }

        this.uploadFormTemplate = false

        this.$store.dispatch('updateFormTemplate', {
          slug: this.slug,
          id: this.id,
          csv: this.csv
        })
      },
      onCancel () {
        this.editedName = this.formTemplate.name
        this.editFormTemplate = false
        this.typeId = this.formTemplate.type_id
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>
