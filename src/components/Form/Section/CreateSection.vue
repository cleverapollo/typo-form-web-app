<template>
  <v-dialog width="350px" persistent v-model="createSection">
    <div slot="activator">
      Create Section
    </div>
    <!--<v-btn slot="activator" block class="primary" v-else>Create Section</v-btn>-->
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>
              <h2>Create Section</h2>
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
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-spacer></v-spacer>
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
              <v-btn
                flat
                class="secondary"
                @click="onCancel"
              >
                Close
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
    props: ['parentSectionId', 'formId'],
    data () {
      return {
        createSection: false,
        editedName: ''
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedName.trim() === '') {
          return
        }
        this.createSection = false
        this.$store.dispatch('createSection',
          {
            formId: this.formId,
            parentSectionId: this.parentSectionId,
            name: this.editedName
          })
        this.editedName = ''
      },
      onCancel () {
        this.editedName = ''
        this.createSection = false
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
