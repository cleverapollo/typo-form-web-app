<template>
  <v-layout row wrap v-if='form'>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Edit Form</h1>
        </v-flex>

        <!-- //Form Layout -->
        <v-flex xs12>
          <v-card>

            <!-- //Header -->
            <v-card-title class="info white--text">
              <v-layout row wrap>
                <v-flex d-flex xs12>
                  <div class="title pt-3">{{ form.name }}</div>
                  <v-spacer></v-spacer>

                  <!-- //Menu -->
                  <div class="text-xs-right">

                    <v-menu offset-y left>
                      <v-btn icon slot="activator">
                        <v-icon class="white--text">more_vert</v-icon>
                      </v-btn>

                      <v-list>

                        <v-list-tile @click="">
                          <v-list-tile-avatar>
                            <v-icon>create_new_folder</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <CreateSection :parentSectionId="-1" :formId="id"></CreateSection>
                          </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile @click="">
                          <v-list-tile-avatar>
                            <v-icon>edit</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <EditForm :form="form" :slug="slug"></EditForm>
                          </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile @click.stop="deleteForm = true">
                          <v-list-tile-avatar>
                            <v-icon>delete</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            Delete Form
                          </v-list-tile-content>
                        </v-list-tile>

                      </v-list>
                    </v-menu>
                  </div>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text>
              <v-layout row wrap>

                <v-flex d-flex xs12>
                  <form-view
                    :slug="slug"
                    :formId="id"
                    :submissionId="-1"
                  ></form-view>
                </v-flex>

              </v-layout>
            </v-card-text>

            <!-- //Footer -->
            <v-divider></v-divider>
            <v-card-actions>

              <formNavigation
                :slug="slug"
                :formId="id"
                :submissionId="-1"
              ></formNavigation>

            </v-card-actions>

          </v-card>
        </v-flex>

      </v-layout>
    </v-flex>

    <!-- //Delete Form -->
    <DeleteConfirmDialog @delete-action="onDeleteForm" :visible="deleteForm" @close="deleteForm = false"></DeleteConfirmDialog>
  </v-layout>
</template>

<script>
  import FormView from './FormView'
  import EditForm from './EditForm'
  import CreateSection from './Section/CreateSection'
  import FormNavigation from './FormNavigation'

  export default {
    props: ['id'],
    components: {
      FormView,
      EditForm,
      CreateSection,
      FormNavigation
    },
    data () {
      return {
        deleteForm: false,
        slug: window.location.hostname.split('.')[0]
      }
    },
    computed: {
      form () {
        return this.$store.getters.loadedForm(this.slug, parseInt(this.id))
      }
    },
    methods: {
      onDeleteForm () {
        this.$store.dispatch('deleteForm', {
          slug: this.slug,
          id: this.form.id
        })
        this.$router.push('/forms')
      }
    },
    created: function () {
      this.$store.dispatch('loadForms', this.slug)
      this.$store.dispatch('loadSections', this.id)
      this.$store.dispatch('loadValidations', this.id)
      this.$store.dispatch('loadTriggers', this.id)
      this.$store.dispatch('selectSection', null)
    }
  }
</script>
